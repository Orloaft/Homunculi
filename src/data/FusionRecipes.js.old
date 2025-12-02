// Element fusion combinations
export const FUSION_RECIPES = {
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
};

// Helper function to get fusion result
export function getFusionResult(element1, element2) {
    const key1 = `${element1}+${element2}`;
    const key2 = `${element2}+${element1}`;
    return FUSION_RECIPES[key1] || FUSION_RECIPES[key2] || null;
}

// Get all possible fusion results for an element
export function getPossibleFusions(element) {
    const fusions = [];
    for (const [recipe, result] of Object.entries(FUSION_RECIPES)) {
        const [elem1, elem2] = recipe.split('+');
        if (elem1 === element || elem2 === element) {
            const otherElement = elem1 === element ? elem2 : elem1;
            if (!fusions.some(f => f.element === otherElement)) {
                fusions.push({ element: otherElement, result });
            }
        }
    }
    return fusions;
}