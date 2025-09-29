/**
 * Dependency Injection Container
 * Manages game services and dependencies
 */

type ServiceFactory<T> = () => T;
type ServiceInstance = any;

export interface ServiceConfig {
  singleton?: boolean;
  lazy?: boolean;
  factory?: ServiceFactory<any>;
}

export class ServiceContainer {
  private services: Map<string, ServiceInstance> = new Map();
  private factories: Map<string, ServiceFactory<any>> = new Map();
  private configs: Map<string, ServiceConfig> = new Map();
  private aliases: Map<string, string> = new Map();
  
  /**
   * Register a service
   */
  register<T>(
    name: string,
    service: T | ServiceFactory<T>,
    config: ServiceConfig = {}
  ): void {
    // Set default config
    config = {
      singleton: true,
      lazy: false,
      ...config
    };
    
    this.configs.set(name, config);
    
    if (typeof service === 'function' && config.factory !== false) {
      // It's a factory function
      this.factories.set(name, service as ServiceFactory<T>);
      
      if (!config.lazy) {
        // Create instance immediately if not lazy
        this.createInstance(name);
      }
    } else {
      // It's a direct instance
      this.services.set(name, service);
    }
  }
  
  /**
   * Get a service
   */
  get<T>(name: string): T {
    // Check for alias
    const actualName = this.aliases.get(name) || name;
    
    // Check if service exists
    if (this.services.has(actualName)) {
      return this.services.get(actualName) as T;
    }
    
    // Check if factory exists
    if (this.factories.has(actualName)) {
      return this.createInstance(actualName) as T;
    }
    
    throw new Error(`Service '${name}' not found in container`);
  }
  
  /**
   * Check if a service exists
   */
  has(name: string): boolean {
    const actualName = this.aliases.get(name) || name;
    return this.services.has(actualName) || this.factories.has(actualName);
  }
  
  /**
   * Create an alias for a service
   */
  alias(alias: string, service: string): void {
    this.aliases.set(alias, service);
  }
  
  /**
   * Remove a service
   */
  remove(name: string): void {
    const actualName = this.aliases.get(name) || name;
    this.services.delete(actualName);
    this.factories.delete(actualName);
    this.configs.delete(actualName);
    
    // Remove any aliases pointing to this service
    for (const [alias, service] of this.aliases.entries()) {
      if (service === actualName) {
        this.aliases.delete(alias);
      }
    }
  }
  
  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear();
    this.factories.clear();
    this.configs.clear();
    this.aliases.clear();
  }
  
  /**
   * Get all service names
   */
  getServiceNames(): string[] {
    const names = new Set<string>();
    this.services.forEach((_, name) => names.add(name));
    this.factories.forEach((_, name) => names.add(name));
    return Array.from(names);
  }
  
  /**
   * Create a service instance
   */
  private createInstance<T>(name: string): T {
    const factory = this.factories.get(name);
    const config = this.configs.get(name);
    
    if (!factory) {
      throw new Error(`Factory for service '${name}' not found`);
    }
    
    const instance = factory();
    
    if (config?.singleton) {
      // Store singleton instance
      this.services.set(name, instance);
      // Remove factory as it's no longer needed
      this.factories.delete(name);
    }
    
    return instance;
  }
  
  /**
   * Bind services to an object
   */
  bind(target: any, services: Record<string, string>): void {
    for (const [property, serviceName] of Object.entries(services)) {
      Object.defineProperty(target, property, {
        get: () => this.get(serviceName),
        enumerable: true,
        configurable: true
      });
    }
  }
  
  /**
   * Create a child container
   */
  createChild(): ServiceContainer {
    const child = new ServiceContainer();
    
    // Copy all services to child
    this.services.forEach((service, name) => {
      child.services.set(name, service);
    });
    
    this.factories.forEach((factory, name) => {
      child.factories.set(name, factory);
    });
    
    this.configs.forEach((config, name) => {
      child.configs.set(name, { ...config });
    });
    
    this.aliases.forEach((service, alias) => {
      child.aliases.set(alias, service);
    });
    
    return child;
  }
}

// Global container instance
let globalContainer: ServiceContainer | null = null;

export function getContainer(): ServiceContainer {
  if (!globalContainer) {
    globalContainer = new ServiceContainer();
  }
  return globalContainer;
}

// Service decorator
export function Service(name?: string): ClassDecorator {
  return (target: any) => {
    const serviceName = name || target.name;
    getContainer().register(serviceName, () => new target(), {
      singleton: true,
      lazy: true
    });
  };
}

// Inject decorator
export function Inject(serviceName: string): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    Object.defineProperty(target, propertyKey, {
      get: () => getContainer().get(serviceName),
      enumerable: true,
      configurable: true
    });
  };
}

export default ServiceContainer;