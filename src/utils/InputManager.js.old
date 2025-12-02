// Unified input handling for keyboard and gamepad
export class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.gamepad = null;
        this.gamepadButtonStates = [];
        this.gamepadIndex = 0;
        // Keyboard controls
        this.cursors = null;
        this.wasd = null;
        this.spaceKey = null;
        this.escKey = null;
        this.pKey = null;
        this.iKey = null;
        this.setupKeyboard();
        this.setupGamepad();
    }
    setupKeyboard() {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.wasd = this.scene.input.keyboard.addKeys('W,S,A,D');
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.escKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.pKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.iKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    }
    setupGamepad() {
        // Initialize gamepad states
        this.gamepadButtonStates = new Array(20).fill(false);
        // Check for gamepad on scene start
        if (this.scene.input.gamepad.total > 0) {
            this.gamepad = this.scene.input.gamepad.getPad(this.gamepadIndex);
        }
        // Listen for gamepad connection
        this.scene.input.gamepad.on('connected', (pad) => {
            if (!this.gamepad) {
                this.gamepad = pad;
                this.gamepadIndex = pad.index;
            }
        });
        // Listen for gamepad disconnection
        this.scene.input.gamepad.on('disconnected', (pad) => {
            if (this.gamepad && this.gamepad.index === pad.index) {
                this.gamepad = null;
            }
        });
    }
    update() {
        // Update gamepad button states for edge detection
        if (this.gamepad) {
            this.gamepad.buttons.forEach((button, index) => {
                this.gamepadButtonStates[index] = button.pressed;
            });
        }
    }
    // Movement input
    getMovement() {
        const movement = { x: 0, y: 0 };
        // Keyboard input
        if (this.cursors.left.isDown || this.wasd.A.isDown) movement.x -= 1;
        if (this.cursors.right.isDown || this.wasd.D.isDown) movement.x += 1;
        if (this.cursors.up.isDown || this.wasd.W.isDown) movement.y -= 1;
        if (this.cursors.down.isDown || this.wasd.S.isDown) movement.y += 1;
        // Gamepad input
        if (this.gamepad) {
            // D-pad
            if (this.gamepad.buttons[14].pressed) movement.x -= 1; // Left
            if (this.gamepad.buttons[15].pressed) movement.x += 1; // Right
            if (this.gamepad.buttons[12].pressed) movement.y -= 1; // Up
            if (this.gamepad.buttons[13].pressed) movement.y += 1; // Down
            // Left stick
            if (Math.abs(this.gamepad.leftStick.x) > 0.2) {
                movement.x += this.gamepad.leftStick.x;
            }
            if (Math.abs(this.gamepad.leftStick.y) > 0.2) {
                movement.y += this.gamepad.leftStick.y;
            }
        }
        // Normalize diagonal movement
        if (movement.x !== 0 && movement.y !== 0) {
            const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
            movement.x /= length;
            movement.y /= length;
        }
        return movement;
    }
    // Button press detection
    isButtonJustPressed(button) {
        switch (button) {
            case 'pause':
                return Phaser.Input.Keyboard.JustDown(this.pKey) ||
                       (this.gamepad && this.gamepad.buttons[9].pressed && !this.gamepadButtonStates[9]);
            case 'confirm':
                return Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
                       (this.gamepad && this.gamepad.buttons[0].pressed && !this.gamepadButtonStates[0]);
            case 'cancel':
                return Phaser.Input.Keyboard.JustDown(this.escKey) ||
                       (this.gamepad && this.gamepad.buttons[1].pressed && !this.gamepadButtonStates[1]);
            case 'menu':
                return Phaser.Input.Keyboard.JustDown(this.iKey) ||
                       (this.gamepad && this.gamepad.buttons[8].pressed && !this.gamepadButtonStates[8]);
            default:
                return false;
        }
    }
    // Get aim direction for shooting
    getAimDirection() {
        if (this.gamepad) {
            // Right stick aiming
            const stickX = this.gamepad.rightStick.x;
            const stickY = this.gamepad.rightStick.y;
            if (Math.abs(stickX) > 0.2 || Math.abs(stickY) > 0.2) {
                return Math.atan2(stickY, stickX);
            }
        }
        // Default: aim in movement direction or last direction
        return null;
    }
    // Check if specific gamepad button is pressed
    isGamepadButtonPressed(buttonIndex) {
        return this.gamepad && this.gamepad.buttons[buttonIndex] && this.gamepad.buttons[buttonIndex].pressed;
    }
    // Get previous button state for edge detection
    wasGamepadButtonPressed(buttonIndex) {
        return this.gamepadButtonStates[buttonIndex];
    }
}