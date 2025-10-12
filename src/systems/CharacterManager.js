export class CharacterManager {
    constructor() {
        this.selectedCharacters = {
            p1: null,
            p2: null
        };
        this.availableCharacters = ['wizard', 'orb', 'grim'];
    }
    selectCharacter(player, characterKey) {
        if (!this.availableCharacters.includes(characterKey)) {
            console.error(`Invalid character key: ${characterKey}`);
            return false;
        }
        // Check if character is already selected by the other player
        const otherPlayer = player === 'p1' ? 'p2' : 'p1';
        if (this.selectedCharacters[otherPlayer] === characterKey) {
            return false;
        }
        this.selectedCharacters[player] = characterKey;
        return true;
    }
    getSelectedCharacter(player) {
        return this.selectedCharacters[player];
    }
    getAvailableCharacters(excludeSelected = false) {
        if (!excludeSelected) {
            return [...this.availableCharacters];
        }
        return this.availableCharacters.filter(char => 
            char !== this.selectedCharacters.p1 && 
            char !== this.selectedCharacters.p2
        );
    }
    getAvailableForPlayer(player) {
        const otherPlayer = player === 'p1' ? 'p2' : 'p1';
        const otherCharacter = this.selectedCharacters[otherPlayer];
        if (!otherCharacter) {
            return [...this.availableCharacters];
        }
        return this.availableCharacters.filter(char => char !== otherCharacter);
    }
    reset() {
        this.selectedCharacters.p1 = null;
        this.selectedCharacters.p2 = null;
    }
    isCharacterAvailable(characterKey) {
        return this.selectedCharacters.p1 !== characterKey && 
               this.selectedCharacters.p2 !== characterKey;
    }
}
// Create singleton instance
export const characterManager = new CharacterManager();