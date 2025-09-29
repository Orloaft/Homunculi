/**
 * Type-safe event bus for game-wide communication
 */

type EventCallback<T = any> = (data: T) => void;
type UnsubscribeFn = () => void;

export interface GameEvents {
  // Player events
  'player:spawn': { player: any; position: { x: number; y: number } };
  'player:death': { player: any; killer?: any };
  'player:levelup': { level: number; experience: number };
  'player:damage': { amount: number; source: any };
  'player:heal': { amount: number };
  
  // Enemy events
  'enemy:spawn': { enemy: any; type: string };
  'enemy:death': { enemy: any; killer: any };
  'enemy:damage': { enemy: any; amount: number };
  
  // Boss events
  'boss:spawn': { boss: any; type: string };
  'boss:phasechange': { boss: any; phase: number };
  'boss:defeat': { boss: any; rewards: any[] };
  
  // Game state events
  'game:start': { stage: string; difficulty: string };
  'game:pause': { paused: boolean };
  'game:over': { score: number; time: number };
  'game:victory': { stage: string; score: number };
  
  // Wave events
  'wave:start': { wave: number };
  'wave:complete': { wave: number; enemies: number };
  'wave:boss': { wave: number; bossType: string };
  
  // Element/Spell events
  'spell:cast': { element: string; position: any };
  'element:unlock': { element: string };
  'element:fusion': { elements: string[]; result: string };
  
  // UI events
  'ui:notification': { message: string; type: 'info' | 'warning' | 'error' | 'success' };
  'ui:dialog': { title: string; message: string };
  'ui:score': { score: number; delta: number };
}

export class EventBus {
  private events: Map<keyof GameEvents, Set<EventCallback>> = new Map();
  private oneTimeEvents: Map<keyof GameEvents, Set<EventCallback>> = new Map();
  private eventHistory: Array<{ event: keyof GameEvents; data: any; timestamp: number }> = [];
  private maxHistorySize = 100;
  private debug = false;

  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * Subscribe to an event
   */
  on<K extends keyof GameEvents>(
    event: K,
    callback: EventCallback<GameEvents[K]>
  ): UnsubscribeFn {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    
    const callbacks = this.events.get(event)!;
    callbacks.add(callback);
    
    if (this.debug) {
      console.log(`[EventBus] Subscribed to ${event}`);
    }
    
    // Return unsubscribe function
    return () => {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    };
  }

  /**
   * Subscribe to an event once
   */
  once<K extends keyof GameEvents>(
    event: K,
    callback: EventCallback<GameEvents[K]>
  ): UnsubscribeFn {
    if (!this.oneTimeEvents.has(event)) {
      this.oneTimeEvents.set(event, new Set());
    }
    
    const callbacks = this.oneTimeEvents.get(event)!;
    callbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.oneTimeEvents.delete(event);
      }
    };
  }

  /**
   * Emit an event
   */
  emit<K extends keyof GameEvents>(event: K, data: GameEvents[K]): void {
    if (this.debug) {
      console.log(`[EventBus] Emitting ${event}`, data);
    }
    
    // Add to history
    this.addToHistory(event, data);
    
    // Call regular listeners
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[EventBus] Error in event handler for ${event}:`, error);
        }
      });
    }
    
    // Call one-time listeners
    const oneTimeCallbacks = this.oneTimeEvents.get(event);
    if (oneTimeCallbacks) {
      oneTimeCallbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[EventBus] Error in one-time handler for ${event}:`, error);
        }
      });
      // Clear one-time listeners after calling
      this.oneTimeEvents.delete(event);
    }
  }

  /**
   * Remove all listeners for an event
   */
  off<K extends keyof GameEvents>(event: K): void {
    this.events.delete(event);
    this.oneTimeEvents.delete(event);
  }

  /**
   * Remove all listeners
   */
  clear(): void {
    this.events.clear();
    this.oneTimeEvents.clear();
  }

  /**
   * Wait for an event (returns a promise)
   */
  waitFor<K extends keyof GameEvents>(
    event: K,
    timeout?: number
  ): Promise<GameEvents[K]> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.once(event, (data) => {
        resolve(data);
      });
      
      if (timeout) {
        setTimeout(() => {
          unsubscribe();
          reject(new Error(`Timeout waiting for event ${event}`));
        }, timeout);
      }
    });
  }

  /**
   * Get event history
   */
  getHistory(event?: keyof GameEvents): typeof this.eventHistory {
    if (event) {
      return this.eventHistory.filter(entry => entry.event === event);
    }
    return [...this.eventHistory];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  private addToHistory(event: keyof GameEvents, data: any): void {
    this.eventHistory.push({
      event,
      data,
      timestamp: Date.now()
    });
    
    // Trim history if it exceeds max size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event?: keyof GameEvents): number {
    if (event) {
      const regular = this.events.get(event)?.size || 0;
      const oneTime = this.oneTimeEvents.get(event)?.size || 0;
      return regular + oneTime;
    }
    
    let total = 0;
    this.events.forEach(callbacks => total += callbacks.size);
    this.oneTimeEvents.forEach(callbacks => total += callbacks.size);
    return total;
  }

  /**
   * Enable or disable debug mode
   */
  setDebug(enabled: boolean): void {
    this.debug = enabled;
  }
}

// Singleton instance
let instance: EventBus | null = null;

export function getEventBus(): EventBus {
  if (!instance) {
    instance = new EventBus();
  }
  return instance;
}

export default EventBus;