/**
 * Enemy Manager - Manages enemy spawning, AI, and behaviors
 * Handles all enemy types, special behaviors, and death effects
 */

import { ENEMY_TYPES, getEnemyStats, type EnemyType } from '../../data/EnemyConfig';
import type { ElementKey } from '../../data/ElementConfig';

/**
 * Enemy sprite with game properties
 */
export interface IEnemySprite extends Phaser.Physics.Arcade.Sprite {
    enemyType: EnemyType;
    health: number;
    maxHealth: number;
    moveSpeed: number;
    damage: number;
    xpValue: number;
    element?: ElementKey;
    isDying?: boolean;
    stunned?: boolean;
    noStagger?: boolean;
    active: boolean;
    x: number;
    y: number;

    // Sprite methods
    setScale(scale: number): this;
    setFlipX(value: boolean): this;
    play(key: string): this;
    setVelocity(x: number, y: number): this;
    once(event: string, callback: () => void): this;

    // Golem-specific
    golemColor?: 'orange' | 'blue';

    // Slime-specific
    canSplit?: boolean;

    // Summoner-specific
    lastSummonTime?: number;
    summonCooldown?: number;

    // Soul-specific
    attackRange?: number;
    attackCooldown?: number;
    lastAttackTime?: number;

    // Dark Eye-specific
    isLevelUpDarkEye?: boolean;
}

/**
 * Enemy projectile sprite
 */
interface IEnemyProjectile extends Phaser.Physics.Arcade.Sprite {
    damage: number;
    x: number;
    y: number;
    setVelocity(x: number, y: number): this;
    setTint(tint: number): this;
    destroy(): void;
}

/**
 * Enemy spawn event data
 */
interface IEnemySpawnData {
    readonly type: EnemyType;
    readonly x: number;
    readonly y: number;
    readonly variant?: string;
}

/**
 * Enemy stats from config
 */
interface IEnemyStats {
    health: number;
    speed: number;
    damage: number;
    xpValue: number;
    scale: number;
}

/**
 * Player sprite interface for AI targeting
 */
interface IPlayerSprite extends Phaser.Physics.Arcade.Sprite {
    x: number;
    y: number;
    active: boolean;
}

/**
 * Enemy Manager - Manages all enemy spawning and behaviors
 */
export class EnemyManager {
    private scene: Phaser.Scene;
    public enemies: Phaser.Physics.Arcade.Group;
    public enemyProjectiles: Phaser.Physics.Arcade.Group;

    // Track special enemies
    private eliteEnemies: Set<IEnemySprite>;
    private summonerCooldowns: Map<IEnemySprite, number>;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.enemies = scene.physics.add.group();
        this.enemyProjectiles = scene.physics.add.group();

        // Track special enemies
        this.eliteEnemies = new Set();
        this.summonerCooldowns = new Map();

        this.setupEventListeners();
        this.createAnimations();
    }

    /**
     * Set up event listeners for enemy management
     */
    private setupEventListeners(): void {
        // Listen for enemy spawn requests
        this.scene.events.on('spawnEnemy', (data: IEnemySpawnData) => {
            this.spawnEnemy(data.type, data.x, data.y, data.variant);
        });

        // Listen for enemy death
        this.scene.events.on('enemyKilled', (enemy: IEnemySprite) => {
            this.handleEnemyDeath(enemy);
        });
    }

    /**
     * Create all enemy animations
     */
    private createAnimations(): void {
        // Tree enemy
        if (!this.scene.anims.exists('enemy-walk-anim')) {
            this.scene.anims.create({
                key: 'enemy-walk-anim',
                frames: this.scene.anims.generateFrameNumbers('enemy-walk', { start: 0, end: 2 }),
                frameRate: 6,
                repeat: -1
            });
        }

        // Slime animations
        if (!this.scene.anims.exists('slime-idle')) {
            this.scene.anims.create({
                key: 'slime-idle',
                frames: [
                    { key: 'slime-idle-0' },
                    { key: 'slime-idle-1' },
                    { key: 'slime-idle-2' },
                    { key: 'slime-idle-3' }
                ],
                frameRate: 6,
                repeat: -1
            });

            this.scene.anims.create({
                key: 'slime-die',
                frames: [
                    { key: 'slime-die-0' },
                    { key: 'slime-die-1' },
                    { key: 'slime-die-2' },
                    { key: 'slime-die-3' }
                ],
                frameRate: 8,
                repeat: 0
            });
        }

        // Golem animations
        this.createGolemAnimations();

        // Other enemy animations
        this.createBatAnimations();
        this.createMushroomAnimations();
        this.createFirewormAnimations();
        this.createSummonerAnimations();
        this.createSoulAnimations();
        this.createBloboidAnimations();
        this.createDarkEyeAnimations();
    }

    /**
     * Create golem animations
     */
    private createGolemAnimations(): void {
        const colors: ('orange' | 'blue')[] = ['orange', 'blue'];
        colors.forEach(color => {
            if (!this.scene.anims.exists(`golem-${color}-walk`)) {
                this.scene.anims.create({
                    key: `golem-${color}-walk`,
                    frames: this.scene.anims.generateFrameNumbers(`golem-${color}-walk`, { start: 0, end: 17 }),
                    frameRate: 10,
                    repeat: -1
                });

                this.scene.anims.create({
                    key: `golem-${color}-hurt`,
                    frames: this.scene.anims.generateFrameNumbers(`golem-${color}-hurt`, { start: 0, end: 11 }),
                    frameRate: 10,
                    repeat: 0
                });

                this.scene.anims.create({
                    key: `golem-${color}-die`,
                    frames: this.scene.anims.generateFrameNumbers(`golem-${color}-die`, { start: 0, end: 14 }),
                    frameRate: 10,
                    repeat: 0
                });
            }
        });
    }

    /**
     * Create bat animations
     */
    private createBatAnimations(): void {
        if (!this.scene.anims.exists('bat-flying')) {
            this.scene.anims.create({
                key: 'bat-flying',
                frames: [
                    { key: 'bat-fly-0' },
                    { key: 'bat-fly-1' },
                    { key: 'bat-fly-2' },
                    { key: 'bat-fly-3' },
                    { key: 'bat-fly-4' },
                    { key: 'bat-fly-5' },
                    { key: 'bat-fly-6' }
                ],
                frameRate: 12,
                repeat: -1
            });
        }
    }

    /**
     * Create mushroom animations
     */
    private createMushroomAnimations(): void {
        if (!this.scene.anims.exists('mushroom-walking')) {
            this.scene.anims.create({
                key: 'mushroom-walking',
                frames: [
                    { key: 'mushroom-walk-0' },
                    { key: 'mushroom-walk-1' },
                    { key: 'mushroom-walk-2' },
                    { key: 'mushroom-walk-3' },
                    { key: 'mushroom-walk-4' },
                    { key: 'mushroom-walk-5' },
                    { key: 'mushroom-walk-6' },
                    { key: 'mushroom-walk-7' }
                ],
                frameRate: 10,
                repeat: -1
            });
        }
    }

    /**
     * Create fireworm animations
     */
    private createFirewormAnimations(): void {
        if (!this.scene.anims.exists('fireworm-walking')) {
            this.scene.anims.create({
                key: 'fireworm-walking',
                frames: [
                    { key: 'fireworm-walk-0' },
                    { key: 'fireworm-walk-1' },
                    { key: 'fireworm-walk-2' },
                    { key: 'fireworm-walk-3' },
                    { key: 'fireworm-walk-4' },
                    { key: 'fireworm-walk-5' },
                    { key: 'fireworm-walk-6' },
                    { key: 'fireworm-walk-7' },
                    { key: 'fireworm-walk-8' }
                ],
                frameRate: 12,
                repeat: -1
            });
        }
    }

    /**
     * Create summoner animations
     */
    private createSummonerAnimations(): void {
        if (!this.scene.anims.exists('summoner-idle-anim')) {
            this.scene.anims.create({
                key: 'summoner-idle-anim',
                frames: this.scene.anims.generateFrameNumbers('summoner-idle', { start: 0, end: 11 }),
                frameRate: 8,
                repeat: -1
            });

            this.scene.anims.create({
                key: 'summoner-cast-anim',
                frames: this.scene.anims.generateFrameNumbers('summoner-cast', { start: 0, end: 14 }),
                frameRate: 12,
                repeat: 0
            });
        }
    }

    /**
     * Create soul animations
     */
    private createSoulAnimations(): void {
        if (!this.scene.anims.exists('soul-idle')) {
            const frames = [];
            for (let i = 0; i < 16; i++) {
                frames.push({ key: `soul-idle-${i}` });
            }
            this.scene.anims.create({
                key: 'soul-idle',
                frames: frames,
                frameRate: 10,
                repeat: -1
            });
        }
    }

    /**
     * Create bloboid animations
     */
    private createBloboidAnimations(): void {
        if (!this.scene.anims.exists('bloboid-walking')) {
            const frames = [];
            for (let i = 0; i < 8; i++) {
                frames.push({ key: `bloboid-walk-${i}` });
            }
            this.scene.anims.create({
                key: 'bloboid-walking',
                frames: frames,
                frameRate: 8,
                repeat: -1
            });
        }
    }

    /**
     * Create dark eye animations
     */
    private createDarkEyeAnimations(): void {
        if (!this.scene.anims.exists('darkeye-walking')) {
            const frames = [];
            for (let i = 1; i <= 8; i++) {
                frames.push({ key: `darkeye-walk-${i}` });
            }
            this.scene.anims.create({
                key: 'darkeye-walking',
                frames: frames,
                frameRate: 8,
                repeat: -1
            });
        }
    }

    /**
     * Spawn an enemy at position
     *
     * @param type - Enemy type
     * @param x - X position
     * @param y - Y position
     * @param variant - Optional variant (e.g., golem color)
     * @returns The spawned enemy sprite
     */
    public spawnEnemy(type: EnemyType, x: number, y: number, variant: string | null = null): IEnemySprite | null {
        const playerLevel = (this.scene as any).playerStats?.level || 1;
        const stats = getEnemyStats(type, playerLevel);

        let enemy: IEnemySprite | null = null;

        switch (type) {
            case 'golem':
                enemy = this.createGolem(x, y, (variant as 'orange' | 'blue') || 'orange', stats);
                break;
            case 'slime':
                enemy = this.createSlime(x, y, stats);
                break;
            case 'summoner':
                enemy = this.createSummoner(x, y, stats);
                break;
            case 'soul':
                enemy = this.createSoul(x, y, stats);
                break;
            case 'darkeye':
                enemy = this.createDarkEye(x, y, stats);
                break;
            default:
                enemy = this.createBasicEnemy(x, y, type, stats);
        }

        if (enemy) {
            this.enemies.add(enemy);

            // Spawn effect
            this.createSpawnEffect(x, y, type);
        }

        return enemy;
    }

    /**
     * Create a basic enemy
     *
     * @param x - X position
     * @param y - Y position
     * @param type - Enemy type
     * @param stats - Enemy stats
     * @returns The created enemy sprite
     */
    private createBasicEnemy(x: number, y: number, type: EnemyType, stats: IEnemyStats): IEnemySprite | null {
        const config = ENEMY_TYPES[type];
        if (!config) return null;

        const enemy = this.scene.physics.add.sprite(x, y, config.sprite) as IEnemySprite;

        // Set properties
        enemy.enemyType = type;
        enemy.health = stats.health;
        enemy.maxHealth = stats.health;
        enemy.moveSpeed = stats.speed;
        enemy.damage = stats.damage;
        enemy.xpValue = stats.xpValue;

        // Set scale
        enemy.setScale(stats.scale || config.scale);

        // Flip if needed
        if (config.flipX) {
            enemy.setFlipX(true);
        }

        // Play animation
        if (config.animation) {
            enemy.play(config.animation);
        }

        // Set element if applicable
        if (config.element) {
            enemy.element = config.element;
        }

        return enemy;
    }

    /**
     * Create a golem enemy
     */
    private createGolem(x: number, y: number, color: 'orange' | 'blue', stats: IEnemyStats): IEnemySprite {
        const enemy = this.scene.physics.add.sprite(x, y, `golem-${color}-walk`) as IEnemySprite;

        enemy.enemyType = 'golem';
        enemy.golemColor = color;
        enemy.health = stats.health;
        enemy.maxHealth = stats.health;
        enemy.moveSpeed = stats.speed;
        enemy.damage = stats.damage;
        enemy.xpValue = stats.xpValue;

        enemy.setScale(stats.scale || 1.0);
        enemy.play(`golem-${color}-walk`);

        return enemy;
    }

    /**
     * Create a slime enemy
     */
    private createSlime(x: number, y: number, stats: IEnemyStats): IEnemySprite {
        const enemy = this.scene.physics.add.sprite(x, y, 'slime-idle-0') as IEnemySprite;

        enemy.enemyType = 'slime';
        enemy.health = stats.health;
        enemy.maxHealth = stats.health;
        enemy.moveSpeed = stats.speed;
        enemy.damage = stats.damage;
        enemy.xpValue = stats.xpValue;
        enemy.canSplit = true;

        enemy.play('slime-idle');

        return enemy;
    }

    /**
     * Create a summoner enemy
     */
    private createSummoner(x: number, y: number, stats: IEnemyStats): IEnemySprite {
        const enemy = this.scene.physics.add.sprite(x, y, 'summoner-idle') as IEnemySprite;

        enemy.enemyType = 'summoner';
        enemy.health = stats.health;
        enemy.maxHealth = stats.health;
        enemy.moveSpeed = stats.speed;
        enemy.damage = stats.damage;
        enemy.xpValue = stats.xpValue;
        enemy.lastSummonTime = 0;
        enemy.summonCooldown = ENEMY_TYPES.summoner.summonCooldown;

        enemy.play('summoner-idle-anim');

        return enemy;
    }

    /**
     * Create a soul enemy
     */
    private createSoul(x: number, y: number, stats: IEnemyStats): IEnemySprite {
        const enemy = this.scene.physics.add.sprite(x, y, 'soul-idle-0') as IEnemySprite;

        enemy.enemyType = 'soul';
        enemy.health = stats.health;
        enemy.maxHealth = stats.health;
        enemy.moveSpeed = stats.speed;
        enemy.damage = stats.damage;
        enemy.xpValue = stats.xpValue;
        enemy.attackRange = ENEMY_TYPES.soul.attackRange;
        enemy.attackCooldown = ENEMY_TYPES.soul.attackCooldown;
        enemy.lastAttackTime = 0;

        enemy.play('soul-idle');

        return enemy;
    }

    /**
     * Create a dark eye enemy
     */
    private createDarkEye(x: number, y: number, stats: IEnemyStats): IEnemySprite {
        const enemy = this.scene.physics.add.sprite(x, y, 'darkeye-walk-1') as IEnemySprite;

        enemy.enemyType = 'darkeye';
        enemy.health = stats.health;
        enemy.maxHealth = stats.health;
        enemy.moveSpeed = stats.speed;
        enemy.damage = stats.damage;
        enemy.xpValue = stats.xpValue;
        enemy.element = 'dark';
        enemy.noStagger = true;
        enemy.isLevelUpDarkEye = true;

        enemy.setScale(stats.scale);
        enemy.setFlipX(true);
        enemy.play('darkeye-walking');

        // Mark as elite
        this.eliteEnemies.add(enemy);

        return enemy;
    }

    /**
     * Create spawn effect
     */
    private createSpawnEffect(x: number, y: number, type: EnemyType): void {
        let color = 0xffffff;
        let scale = 1;

        if (type === 'darkeye') {
            color = 0x9933ff;
            scale = 3;
        } else if (type === 'summoner') {
            color = 0xff00ff;
        } else if (type === 'golem') {
            color = 0xff8800;
        }

        const effect = this.scene.add.circle(x, y, 50, color, 0.8);
        effect.setDepth(10);

        this.scene.tweens.add({
            targets: effect,
            scale: { from: 0, to: scale },
            alpha: { from: 1, to: 0 },
            duration: 500,
            onComplete: () => effect.destroy()
        });
    }

    /**
     * Update all enemies
     *
     * @param time - Current game time
     * @param _delta - Time elapsed since last update (unused)
     */
    public update(time: number, _delta: number): void {
        const wizard = (this.scene as any).wizard as IPlayerSprite;
        if (!wizard || !wizard.active) return;

        this.enemies.children.entries.forEach((enemy: Phaser.GameObjects.GameObject) => {
            const typedEnemy = enemy as IEnemySprite;
            if (!typedEnemy.active) return;

            // Update enemy AI
            this.updateEnemyAI(typedEnemy, wizard, time);

            // Update enemy facing direction
            this.updateEnemyFacing(typedEnemy, wizard);

            // Special enemy behaviors
            this.updateSpecialBehaviors(typedEnemy, time);
        });

        // Update enemy projectiles
        this.updateEnemyProjectiles();
    }

    /**
     * Update enemy AI
     */
    private updateEnemyAI(enemy: IEnemySprite, target: IPlayerSprite, time: number): void {
        if (enemy.stunned || enemy.isDying) {
            enemy.setVelocity(0, 0);
            return;
        }

        // Calculate direction to target
        const dx = target.x - enemy.x;
        const dy = target.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Special AI for ranged enemies
        if (enemy.enemyType === 'soul' && enemy.attackRange && distance < enemy.attackRange) {
            // Stop and attack
            enemy.setVelocity(0, 0);
            this.handleSoulAttack(enemy, target, time);
        } else if (enemy.enemyType === 'summoner' && distance < 300) {
            // Slow down when close
            const slowSpeed = enemy.moveSpeed * 0.3;
            enemy.setVelocity(
                (dx / distance) * slowSpeed,
                (dy / distance) * slowSpeed
            );
        } else {
            // Normal movement toward target
            enemy.setVelocity(
                (dx / distance) * enemy.moveSpeed,
                (dy / distance) * enemy.moveSpeed
            );
        }
    }

    /**
     * Update enemy facing direction
     */
    private updateEnemyFacing(enemy: IEnemySprite, target: IPlayerSprite): void {
        // Update sprite facing
        if (enemy.enemyType === 'golem' || enemy.enemyType === 'bat' ||
            enemy.enemyType === 'fireworm' || enemy.enemyType === 'soul' ||
            enemy.enemyType === 'bloboid') {
            if (target.x < enemy.x) {
                enemy.setFlipX(true);
            } else {
                enemy.setFlipX(false);
            }
        }
    }

    /**
     * Update special enemy behaviors
     */
    private updateSpecialBehaviors(enemy: IEnemySprite, time: number): void {
        // Summoner behavior
        if (enemy.enemyType === 'summoner' && enemy.lastSummonTime !== undefined && enemy.summonCooldown) {
            if (time - enemy.lastSummonTime > enemy.summonCooldown) {
                this.handleSummonerCast(enemy);
                enemy.lastSummonTime = time;
            }
        }
    }

    /**
     * Handle soul enemy attack
     */
    private handleSoulAttack(soul: IEnemySprite, target: IPlayerSprite, time: number): void {
        if (soul.lastAttackTime === undefined || soul.attackCooldown === undefined) return;

        if (time - soul.lastAttackTime > soul.attackCooldown) {
            // Create projectile
            const angle = Math.atan2(target.y - soul.y, target.x - soul.x);
            const projectile = this.scene.physics.add.sprite(soul.x, soul.y, 'soul-projectile') as IEnemyProjectile;

            projectile.setVelocity(
                Math.cos(angle) * 150,
                Math.sin(angle) * 150
            );

            projectile.damage = soul.damage;
            projectile.setTint(0x9900ff);

            this.enemyProjectiles.add(projectile);
            soul.lastAttackTime = time;
        }
    }

    /**
     * Handle summoner casting spell
     */
    private handleSummonerCast(summoner: IEnemySprite): void {
        // Play cast animation
        summoner.play('summoner-cast-anim');

        summoner.once('animationcomplete', () => {
            // Spawn minions around summoner
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2;
                const spawnX = summoner.x + Math.cos(angle) * 100;
                const spawnY = summoner.y + Math.sin(angle) * 100;

                this.spawnEnemy('slime', spawnX, spawnY);
            }

            // Return to idle
            summoner.play('summoner-idle-anim');
        });
    }

    /**
     * Update enemy projectiles
     */
    private updateEnemyProjectiles(): void {
        this.enemyProjectiles.children.entries.forEach((projectile: Phaser.GameObjects.GameObject) => {
            const typedProjectile = projectile as IEnemyProjectile;
            // Remove if out of bounds
            if (typedProjectile.x < -50 || typedProjectile.x > this.scene.physics.world.bounds.width + 50 ||
                typedProjectile.y < -50 || typedProjectile.y > this.scene.physics.world.bounds.height + 50) {
                typedProjectile.destroy();
            }
        });
    }

    /**
     * Handle enemy death
     */
    private handleEnemyDeath(enemy: IEnemySprite): void {
        // Special death behaviors
        if (enemy.enemyType === 'slime' && enemy.canSplit) {
            this.handleSlimeSplit(enemy);
        }

        // Remove from elite tracking
        if (this.eliteEnemies.has(enemy)) {
            this.eliteEnemies.delete(enemy);
        }

        // Create death effect
        this.createDeathEffect(enemy);

        // Spawn drops
        this.spawnDrops(enemy);
    }

    /**
     * Handle slime splitting on death
     */
    private handleSlimeSplit(slime: IEnemySprite): void {
        // Spawn 2 smaller slimes
        for (let i = 0; i < 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 30;
            const miniSlime = this.spawnEnemy('slime',
                slime.x + Math.cos(angle) * distance,
                slime.y + Math.sin(angle) * distance
            );

            if (miniSlime) {
                miniSlime.setScale(0.5);
                miniSlime.health = 1;
                miniSlime.maxHealth = 1;
                miniSlime.canSplit = false;
                miniSlime.xpValue = 2;
            }
        }
    }

    /**
     * Create death effect
     */
    private createDeathEffect(enemy: IEnemySprite): void {
        // Create particle effect based on enemy type
        let particles = 10;
        let color = 0xff0000;

        if (enemy.enemyType === 'slime') {
            color = 0x00ff00;
        } else if (enemy.enemyType === 'darkeye') {
            particles = 20;
            color = 0x9933ff;
        }

        // Simple particle burst
        for (let i = 0; i < particles; i++) {
            const particle = this.scene.add.circle(enemy.x, enemy.y, 3, color);
            const angle = (i / particles) * Math.PI * 2;
            const speed = 100 + Math.random() * 100;

            this.scene.physics.add.existing(particle);
            (particle.body as Phaser.Physics.Arcade.Body).setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );

            this.scene.tweens.add({
                targets: particle,
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }

    /**
     * Spawn drops from enemy
     */
    private spawnDrops(enemy: IEnemySprite): void {
        // XP jewel drop
        this.scene.events.emit('spawnDrop', {
            type: 'xp',
            x: enemy.x,
            y: enemy.y,
            value: enemy.xpValue
        });

        // Special drops
        if (enemy.isLevelUpDarkEye) {
            this.scene.events.emit('spawnDrop', {
                type: 'chargeExpansion',
                x: enemy.x,
                y: enemy.y
            });
        }

        // Random element orb chance
        if (Math.random() < 0.1) {
            this.scene.events.emit('spawnDrop', {
                type: 'elementOrb',
                x: enemy.x,
                y: enemy.y
            });
        }

        // Random health drop
        if (Math.random() < 0.05) {
            this.scene.events.emit('spawnDrop', {
                type: 'health',
                x: enemy.x,
                y: enemy.y
            });
        }
    }

    /**
     * Get all enemies
     *
     * @returns Array of all enemy sprites
     */
    public getAllEnemies(): Phaser.GameObjects.GameObject[] {
        return this.enemies.children.entries;
    }

    /**
     * Get active enemy count
     *
     * @returns Number of active enemies
     */
    public getEnemyCount(): number {
        return this.enemies.children.entries.filter((e: Phaser.GameObjects.GameObject) => (e as IEnemySprite).active).length;
    }

    /**
     * Clear all enemies and projectiles
     */
    public clearAllEnemies(): void {
        this.enemies.clear(true, true);
        this.enemyProjectiles.clear(true, true);
        this.eliteEnemies.clear();
        this.summonerCooldowns.clear();
    }
}
