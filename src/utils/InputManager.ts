/**
 * Unified input handling for keyboard and gamepad
 * Manages keyboard and gamepad input with proper button state tracking
 */

/**
 * Movement vector with normalized coordinates
 */
export interface IMovement {
    readonly x: number;
    readonly y: number;
}

/**
 * Button types for input detection
 */
export type ButtonType = 'pause' | 'confirm' | 'cancel' | 'menu';

/**
 * Keyboard input keys interface
 */
interface IKeyboardKeys {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: {
        W: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };
    spaceKey: Phaser.Input.Keyboard.Key;
    escKey: Phaser.Input.Keyboard.Key;
    pKey: Phaser.Input.Keyboard.Key;
    iKey: Phaser.Input.Keyboard.Key;
}

/**
 * Unified input manager for keyboard and gamepad
 */
export class InputManager {
    private scene: Phaser.Scene;
    private gamepad: Phaser.Input.Gamepad.Gamepad | null;
    private gamepadButtonStates: boolean[];
    private gamepadIndex: number;

    // Keyboard controls
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd: {
        W: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };
    private spaceKey: Phaser.Input.Keyboard.Key;
    private escKey: Phaser.Input.Keyboard.Key;
    private pKey: Phaser.Input.Keyboard.Key;
    private iKey: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.gamepad = null;
        this.gamepadButtonStates = [];
        this.gamepadIndex = 0;

        this.setupKeyboard();
        this.setupGamepad();
    }

    /**
     * Set up keyboard input handlers
     */
    private setupKeyboard(): void {
        this.cursors = this.scene.input.keyboard!.createCursorKeys();
        this.wasd = this.scene.input.keyboard!.addKeys('W,S,A,D') as any;
        this.spaceKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.escKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.pKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.iKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    }

    /**
     * Set up gamepad input handlers
     */
    private setupGamepad(): void {
        // Initialize gamepad states
        this.gamepadButtonStates = new Array(20).fill(false);

        // Check for gamepad on scene start
        if (this.scene.input.gamepad!.total > 0) {
            this.gamepad = this.scene.input.gamepad!.getPad(this.gamepadIndex);
        }

        // Listen for gamepad connection
        this.scene.input.gamepad!.on('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
            if (!this.gamepad) {
                this.gamepad = pad;
                this.gamepadIndex = pad.index;
            }
        });

        // Listen for gamepad disconnection
        this.scene.input.gamepad!.on('disconnected', (pad: Phaser.Input.Gamepad.Gamepad) => {
            if (this.gamepad && this.gamepad.index === pad.index) {
                this.gamepad = null;
            }
        });
    }

    /**
     * Update input state - call this every frame
     */
    public update(): void {
        // Update gamepad button states for edge detection
        if (this.gamepad) {
            this.gamepad.buttons.forEach((button, index) => {
                this.gamepadButtonStates[index] = button.pressed;
            });
        }
    }

    /**
     * Get normalized movement vector from input
     *
     * @returns Movement vector with x and y components (-1 to 1)
     */
    public getMovement(): IMovement {
        const movement = { x: 0, y: 0 };

        // Keyboard input
        if (this.cursors.left.isDown || this.wasd.A.isDown) movement.x -= 1;
        if (this.cursors.right.isDown || this.wasd.D.isDown) movement.x += 1;
        if (this.cursors.up.isDown || this.wasd.W.isDown) movement.y -= 1;
        if (this.cursors.down.isDown || this.wasd.S.isDown) movement.y += 1;

        // Gamepad input
        if (this.gamepad) {
            // D-pad
            if (this.gamepad.buttons[14]?.pressed) movement.x -= 1; // Left
            if (this.gamepad.buttons[15]?.pressed) movement.x += 1; // Right
            if (this.gamepad.buttons[12]?.pressed) movement.y -= 1; // Up
            if (this.gamepad.buttons[13]?.pressed) movement.y += 1; // Down

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

    /**
     * Check if a button was just pressed (edge detection)
     *
     * @param button - Button type to check
     * @returns True if button was just pressed this frame
     */
    public isButtonJustPressed(button: ButtonType): boolean {
        switch (button) {
            case 'pause':
                return (
                    Phaser.Input.Keyboard.JustDown(this.pKey) ||
                    (this.gamepad !== null &&
                        this.gamepad.buttons[9]?.pressed &&
                        !this.gamepadButtonStates[9])
                );

            case 'confirm':
                return (
                    Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
                    (this.gamepad !== null &&
                        this.gamepad.buttons[0]?.pressed &&
                        !this.gamepadButtonStates[0])
                );

            case 'cancel':
                return (
                    Phaser.Input.Keyboard.JustDown(this.escKey) ||
                    (this.gamepad !== null &&
                        this.gamepad.buttons[1]?.pressed &&
                        !this.gamepadButtonStates[1])
                );

            case 'menu':
                return (
                    Phaser.Input.Keyboard.JustDown(this.iKey) ||
                    (this.gamepad !== null &&
                        this.gamepad.buttons[8]?.pressed &&
                        !this.gamepadButtonStates[8])
                );

            default:
                return false;
        }
    }

    /**
     * Get aim direction from right stick
     *
     * @returns Angle in radians, or null if no aim input
     */
    public getAimDirection(): number | null {
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

    /**
     * Check if specific gamepad button is currently pressed
     *
     * @param buttonIndex - Button index to check
     * @returns True if button is pressed
     */
    public isGamepadButtonPressed(buttonIndex: number): boolean {
        return (
            this.gamepad !== null &&
            this.gamepad.buttons[buttonIndex] !== undefined &&
            this.gamepad.buttons[buttonIndex].pressed
        );
    }

    /**
     * Get previous button state for edge detection
     *
     * @param buttonIndex - Button index to check
     * @returns True if button was pressed in previous frame
     */
    public wasGamepadButtonPressed(buttonIndex: number): boolean {
        return this.gamepadButtonStates[buttonIndex] || false;
    }

    /**
     * Check if gamepad is connected
     *
     * @returns True if gamepad is connected
     */
    public isGamepadConnected(): boolean {
        return this.gamepad !== null;
    }

    /**
     * Get current gamepad instance
     *
     * @returns Gamepad instance or null
     */
    public getGamepad(): Phaser.Input.Gamepad.Gamepad | null {
        return this.gamepad;
    }
}
