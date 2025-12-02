/**
 * Element definitions and properties
 * Defines all elemental types, their visual properties, and gameplay characteristics
 */

export interface IElementData {
    readonly frame: number;
    readonly color: string;
    readonly name: string;
    readonly sheet: 'element-symbols' | 'element-symbols2' | 'element-symbols3';
    readonly fireRate: number;
}

export type ElementKey =
    // Primary Elements
    | 'fire' | 'water' | 'earth' | 'air' | 'arcane' | 'light' | 'dark' | 'nature' | 'rock'
    // Secondary Elements
    | 'ice' | 'lightning' | 'metal' | 'poison' | 'blood' | 'smoke' | 'chaos' | 'order'
    // Tertiary Elements
    | 'steam' | 'lava' | 'storm' | 'crystal' | 'shadow' | 'radiant' | 'void' | 'time' | 'cosmic' | 'music';

export const ELEMENT_CONFIG = {
    // Primary Elements
    fire: { frame: 0, color: '#ff4444', name: 'Fire', sheet: 'element-symbols', fireRate: 1.2 },
    water: { frame: 1, color: '#4444ff', name: 'Water', sheet: 'element-symbols', fireRate: 1.0 },
    earth: { frame: 2, color: '#44ff44', name: 'Earth', sheet: 'element-symbols', fireRate: 0.8 },
    air: { frame: 3, color: '#aaaaff', name: 'Air', sheet: 'element-symbols', fireRate: 1.5 },
    arcane: { frame: 4, color: '#ff44ff', name: 'Arcane', sheet: 'element-symbols', fireRate: 1.0 },
    light: { frame: 5, color: '#ffffaa', name: 'Light', sheet: 'element-symbols', fireRate: 1.1 },
    dark: { frame: 6, color: '#9933cc', name: 'Dark', sheet: 'element-symbols', fireRate: 0.9 },
    nature: { frame: 7, color: '#22aa22', name: 'Nature', sheet: 'element-symbols', fireRate: 1.0 },
    rock: { frame: 8, color: '#8b7355', name: 'Rock', sheet: 'element-symbols', fireRate: 0.7 },

    // Secondary Elements (Sheet 2)
    ice: { frame: 0, color: '#aaffff', name: 'Ice', sheet: 'element-symbols2', fireRate: 0.9 },
    lightning: { frame: 1, color: '#ffff44', name: 'Lightning', sheet: 'element-symbols2', fireRate: 1.3 },
    metal: { frame: 2, color: '#cccccc', name: 'Metal', sheet: 'element-symbols2', fireRate: 0.8 },
    poison: { frame: 3, color: '#44ff44', name: 'Poison', sheet: 'element-symbols2', fireRate: 1.0 },
    blood: { frame: 4, color: '#cc0000', name: 'Blood', sheet: 'element-symbols2', fireRate: 1.1 },
    smoke: { frame: 5, color: '#888888', name: 'Smoke', sheet: 'element-symbols2', fireRate: 1.2 },
    chaos: { frame: 6, color: '#ff00ff', name: 'Chaos', sheet: 'element-symbols2', fireRate: 1.4 },
    order: { frame: 7, color: '#ffffff', name: 'Order', sheet: 'element-symbols2', fireRate: 0.7 },

    // Tertiary Elements (Sheet 3)
    steam: { frame: 0, color: '#dddddd', name: 'Steam', sheet: 'element-symbols3', fireRate: 1.1 },
    lava: { frame: 1, color: '#ff6600', name: 'Lava', sheet: 'element-symbols3', fireRate: 0.6 },
    storm: { frame: 2, color: '#4466ff', name: 'Storm', sheet: 'element-symbols3', fireRate: 1.2 },
    crystal: { frame: 3, color: '#ff99ff', name: 'Crystal', sheet: 'element-symbols3', fireRate: 0.8 },
    shadow: { frame: 4, color: '#440044', name: 'Shadow', sheet: 'element-symbols3', fireRate: 1.0 },
    radiant: { frame: 5, color: '#ffff00', name: 'Radiant', sheet: 'element-symbols3', fireRate: 1.1 },
    void: { frame: 6, color: '#000044', name: 'Void', sheet: 'element-symbols3', fireRate: 0.5 },
    time: { frame: 7, color: '#9966ff', name: 'Time', sheet: 'element-symbols3', fireRate: 0.8 },
    cosmic: { frame: 8, color: '#6633ff', name: 'Cosmic', sheet: 'element-symbols3', fireRate: 0.9 },
    music: { frame: 9, color: '#ff69b4', name: 'Music', sheet: 'element-symbols3', fireRate: 1.5 }
} as const;

export type ElementConfig = typeof ELEMENT_CONFIG;

export const PRIMARY_ELEMENTS: readonly ElementKey[] = ['fire', 'water', 'earth', 'air', 'rock', 'poison'] as const;

export const ELEMENT_DESCRIPTIONS: Readonly<Record<ElementKey, string>> = {
    fire: "Burns enemies and leaves fire pools",
    water: "Slows enemies and creates healing orbs",
    earth: "Creates defensive barriers",
    air: "Knocks back enemies in an area",
    arcane: "Pure magical damage",
    light: "Damages undead and heals allies",
    dark: "Drains life from enemies",
    nature: "Entangles enemies with vines",
    rock: "Stuns enemies on impact",
    ice: "Freezes enemies solid",
    lightning: "Chains between enemies",
    metal: "High damage, piercing shots",
    poison: "Damages over time",
    blood: "Life steal effect",
    smoke: "Blinds enemies",
    chaos: "Random elemental effects",
    order: "Dispels enemy buffs",
    steam: "Area denial cloud",
    lava: "Extreme damage over time",
    storm: "Creates tornado projectiles",
    crystal: "Shatters into shards",
    shadow: "Phases through enemies",
    radiant: "Explosive light bursts",
    void: "Black holes that pull enemies",
    time: "Slows enemy movement",
    cosmic: "Meteors from above",
    music: "Confuses enemies"
} as const;

/**
 * Helper to get element data safely
 */
export function getElementData(element: ElementKey): IElementData {
    return ELEMENT_CONFIG[element];
}

/**
 * Helper to check if an element is primary
 */
export function isPrimaryElement(element: ElementKey): boolean {
    return PRIMARY_ELEMENTS.includes(element);
}

/**
 * Helper to get element description
 */
export function getElementDescription(element: ElementKey): string {
    return ELEMENT_DESCRIPTIONS[element];
}
