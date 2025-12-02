/**
 * Element fusion combinations and recipes
 * Defines how elements combine to create new elements
 */

import type { ElementKey } from './ElementConfig';

/**
 * Fusion recipe key format: "element1+element2"
 */
export type FusionRecipeKey = string;

/**
 * Possible fusion result for an element
 */
export interface IPossibleFusion {
    readonly element: ElementKey;
    readonly result: ElementKey;
}

/**
 * All fusion recipes mapping combinations to results
 * Bidirectional - both "fire+water" and "water+fire" produce "steam"
 */
export const FUSION_RECIPES: Readonly<Record<FusionRecipeKey, ElementKey>> = {
    // Basic combinations
    'fire+water': 'steam',
    'water+fire': 'steam',
    'fire+earth': 'lava',
    'earth+fire': 'lava',
    'water+air': 'storm',
    'air+water': 'storm',
    'earth+air': 'nature',
    'air+earth': 'nature',
    'fire+air': 'smoke',
    'air+fire': 'smoke',
    'water+earth': 'nature',
    'earth+water': 'nature',

    // Advanced combinations
    'water+ice': 'crystal',
    'ice+water': 'crystal',
    'fire+lightning': 'chaos',
    'lightning+fire': 'chaos',
    'earth+metal': 'order',
    'metal+earth': 'order',
    'light+dark': 'void',
    'dark+light': 'void',
    'storm+chaos': 'cosmic',
    'chaos+storm': 'cosmic',
    'nature+light': 'radiant',
    'light+nature': 'radiant',
    'dark+void': 'shadow',
    'void+dark': 'shadow',
    'air+lightning': 'storm',
    'lightning+air': 'storm',
    'earth+rock': 'metal',
    'rock+earth': 'metal',
    'water+poison': 'blood',
    'poison+water': 'blood',
    'order+chaos': 'time',
    'chaos+order': 'time',
    'radiant+void': 'cosmic',
    'void+radiant': 'cosmic',
    'time+cosmic': 'music',
    'cosmic+time': 'music'
} as const;

/**
 * Get fusion result for two elements
 * Checks both possible orderings (element1+element2 and element2+element1)
 *
 * @param element1 - First element
 * @param element2 - Second element
 * @returns The resulting element, or null if no fusion exists
 */
export function getFusionResult(element1: ElementKey, element2: ElementKey): ElementKey | null {
    const key1: FusionRecipeKey = `${element1}+${element2}`;
    const key2: FusionRecipeKey = `${element2}+${element1}`;
    return FUSION_RECIPES[key1] || FUSION_RECIPES[key2] || null;
}

/**
 * Get all possible fusion combinations for a given element
 * Returns array of elements that can combine with the given element and their results
 *
 * @param element - The element to find fusions for
 * @returns Array of possible fusions with other elements
 */
export function getPossibleFusions(element: ElementKey): IPossibleFusion[] {
    const fusions: IPossibleFusion[] = [];

    for (const [recipe, result] of Object.entries(FUSION_RECIPES)) {
        const [elem1, elem2] = recipe.split('+') as [string, string];

        if (elem1 === element || elem2 === element) {
            const otherElement = (elem1 === element ? elem2 : elem1) as ElementKey;

            // Avoid duplicates (since recipes are bidirectional)
            if (!fusions.some(f => f.element === otherElement)) {
                fusions.push({ element: otherElement, result });
            }
        }
    }

    return fusions;
}

/**
 * Check if two elements can be fused
 *
 * @param element1 - First element
 * @param element2 - Second element
 * @returns True if fusion is possible
 */
export function canFuse(element1: ElementKey, element2: ElementKey): boolean {
    return getFusionResult(element1, element2) !== null;
}

/**
 * Get all unique fusion results (all elements that can be created through fusion)
 *
 * @returns Array of all possible fusion result elements
 */
export function getAllFusionResults(): ElementKey[] {
    const results = new Set<ElementKey>();

    for (const result of Object.values(FUSION_RECIPES)) {
        results.add(result);
    }

    return Array.from(results);
}

/**
 * Get count of recipes that produce a specific element
 *
 * @param element - The resulting element
 * @returns Number of different recipes that produce this element
 */
export function getRecipeCount(element: ElementKey): number {
    let count = 0;

    for (const result of Object.values(FUSION_RECIPES)) {
        if (result === element) {
            count++;
        }
    }

    // Divide by 2 since recipes are bidirectional
    return Math.floor(count / 2);
}
