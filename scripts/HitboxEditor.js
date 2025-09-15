// Hitbox Editor for Phaser 3 Game
// This tool allows visual editing of sprite hitboxes

class HitboxEditor {
    constructor(scene) {
        console.log('=== HITBOX EDITOR CONSTRUCTOR CALLED ===');
        this.scene = scene;
        this.enabled = false;
        this.currentSprite = null;
        this.graphics = null;
        this.handles = {};
        this.isDragging = false;
        this.hitboxData = {};
        this.lastUpdateTime = 0;
        this.updateThrottle = 16; // Limit updates to ~60fps
        
        // Colors
        this.colors = {
            hitbox: 0x00ff00,
            handles: 0xffff00,
            active: 0xff0000,
            text: '#ffffff'
        };
        
        // Initialize editor
        this.init();
    }
    
    createSliderControls() {
        // Create a DOM element for slider controls
        const sliderPanel = document.createElement('div');
        sliderPanel.id = 'hitbox-slider-panel';
        sliderPanel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 14px;
            display: none;
            z-index: 10000;
            min-width: 300px;
        `;
        
        sliderPanel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #00ff00;">Hitbox Controls</h3>
            
            <div style="margin-bottom: 10px;">
                <label>Width: <span id="hitbox-width-value">0</span></label><br>
                <input type="range" id="hitbox-width" min="5" max="500" value="50" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 10px;">
                <label>Height: <span id="hitbox-height-value">0</span></label><br>
                <input type="range" id="hitbox-height" min="5" max="500" value="50" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 10px;">
                <label>Offset X: <span id="hitbox-offsetx-value">0</span></label><br>
                <input type="range" id="hitbox-offsetx" min="-250" max="250" value="0" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 10px;">
                <label>Offset Y: <span id="hitbox-offsety-value">0</span></label><br>
                <input type="range" id="hitbox-offsety" min="-250" max="250" value="0" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 10px;">
                <label>Sprite Scale: <span id="sprite-scale-value">1.0</span></label><br>
                <input type="range" id="sprite-scale" min="10" max="500" value="100" style="width: 100%;">
            </div>
            
            <div style="margin-top: 15px;">
                <button id="hitbox-apply" style="padding: 5px 10px; margin-right: 5px;">Apply</button>
                <button id="hitbox-reset" style="padding: 5px 10px; margin-right: 5px;">Reset</button>
                <button id="hitbox-save" style="padding: 5px 10px;">Save All</button>
            </div>
        `;
        
        document.body.appendChild(sliderPanel);
        this.sliderPanel = sliderPanel;
        
        // Add event listeners
        const widthSlider = document.getElementById('hitbox-width');
        const heightSlider = document.getElementById('hitbox-height');
        const offsetXSlider = document.getElementById('hitbox-offsetx');
        const offsetYSlider = document.getElementById('hitbox-offsety');
        const scaleSlider = document.getElementById('sprite-scale');
        
        // Update value displays
        widthSlider.addEventListener('input', (e) => {
            document.getElementById('hitbox-width-value').textContent = e.target.value;
            this.updateHitboxFromSliders();
        });
        
        heightSlider.addEventListener('input', (e) => {
            document.getElementById('hitbox-height-value').textContent = e.target.value;
            this.updateHitboxFromSliders();
        });
        
        offsetXSlider.addEventListener('input', (e) => {
            document.getElementById('hitbox-offsetx-value').textContent = e.target.value;
            this.updateHitboxFromSliders();
        });
        
        offsetYSlider.addEventListener('input', (e) => {
            document.getElementById('hitbox-offsety-value').textContent = e.target.value;
            this.updateHitboxFromSliders();
        });
        
        scaleSlider.addEventListener('input', (e) => {
            const scaleValue = e.target.value / 100;
            document.getElementById('sprite-scale-value').textContent = scaleValue.toFixed(2);
            if (this.currentSprite) {
                this.currentSprite.setScale(scaleValue);
                this.updateDisplay();
            }
        });
        
        // Button handlers
        document.getElementById('hitbox-apply').addEventListener('click', () => {
            this.saveCurrentHitbox();
        });
        
        document.getElementById('hitbox-reset').addEventListener('click', () => {
            this.resetHitbox();
            this.updateSlidersFromSprite();
        });
        
        document.getElementById('hitbox-save').addEventListener('click', () => {
            this.exportAllData();
        });
    }
    
    updateHitboxFromSliders() {
        if (!this.currentSprite || !this.currentSprite.body) return;
        
        const width = parseInt(document.getElementById('hitbox-width').value);
        const height = parseInt(document.getElementById('hitbox-height').value);
        const offsetX = parseInt(document.getElementById('hitbox-offsetx').value);
        const offsetY = parseInt(document.getElementById('hitbox-offsety').value);
        
        this.currentSprite.body.setSize(width, height);
        this.currentSprite.body.setOffset(offsetX, offsetY);
        
        this.updateDisplay();
    }
    
    updateSlidersFromSprite() {
        if (!this.currentSprite || !this.currentSprite.body) return;
        
        const body = this.currentSprite.body;
        
        document.getElementById('hitbox-width').value = body.width;
        document.getElementById('hitbox-width-value').textContent = Math.round(body.width);
        
        document.getElementById('hitbox-height').value = body.height;
        document.getElementById('hitbox-height-value').textContent = Math.round(body.height);
        
        document.getElementById('hitbox-offsetx').value = body.offset.x;
        document.getElementById('hitbox-offsetx-value').textContent = Math.round(body.offset.x);
        
        document.getElementById('hitbox-offsety').value = body.offset.y;
        document.getElementById('hitbox-offsety-value').textContent = Math.round(body.offset.y);
        
        document.getElementById('sprite-scale').value = this.currentSprite.scaleX * 100;
        document.getElementById('sprite-scale-value').textContent = this.currentSprite.scaleX.toFixed(2);
    }
    
    init() {
        // Create graphics layer for hitbox visualization
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(1000); // Above everything
        
        // Create selection indicator
        this.selectionIndicator = this.scene.add.graphics();
        this.selectionIndicator.setDepth(999);
        
        // Create UI container
        this.ui = this.scene.add.container(0, 0);
        this.ui.setDepth(1001);
        this.ui.setScrollFactor(0);
        
        // Create info text
        this.infoText = this.scene.add.text(10, 10, '', {
            fontSize: '14px',
            color: this.colors.text,
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        });
        this.infoText.setDepth(1002);
        this.infoText.setScrollFactor(0);
        
        // Create save button
        this.saveButton = this.scene.add.text(10, 50, '[SAVE HITBOX]', {
            fontSize: '16px',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.saveButton.setDepth(1002);
        this.saveButton.setScrollFactor(0);
        this.saveButton.setInteractive({ useHandCursor: true });
        this.saveButton.on('pointerdown', () => this.saveCurrentHitbox());
        this.saveButton.setVisible(false);
        
        // Create copy button for easy code output
        this.copyButton = this.scene.add.text(150, 50, '[COPY CODE]', {
            fontSize: '16px',
            color: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.copyButton.setDepth(1002);
        this.copyButton.setScrollFactor(0);
        this.copyButton.setInteractive({ useHandCursor: true });
        this.copyButton.on('pointerdown', () => this.copyHitboxCode());
        this.copyButton.setVisible(false);
        
        // Create reset button to reset hitbox to center
        this.resetButton = this.scene.add.text(280, 50, '[RESET HITBOX]', {
            fontSize: '16px',
            color: '#ff6666',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.resetButton.setDepth(1002);
        this.resetButton.setScrollFactor(0);
        this.resetButton.setInteractive({ useHandCursor: true });
        this.resetButton.on('pointerdown', () => this.resetHitbox());
        this.resetButton.setVisible(false);
        
        // Create scale up button
        this.scaleUpButton = this.scene.add.text(420, 50, '[SCALE +]', {
            fontSize: '16px',
            color: '#44ff44',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.scaleUpButton.setDepth(1002);
        this.scaleUpButton.setScrollFactor(0);
        this.scaleUpButton.setInteractive({ useHandCursor: true });
        this.scaleUpButton.on('pointerdown', () => this.scaleSprite(1.1));
        this.scaleUpButton.setVisible(false);
        
        // Create scale down button
        this.scaleDownButton = this.scene.add.text(520, 50, '[SCALE -]', {
            fontSize: '16px',
            color: '#4444ff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.scaleDownButton.setDepth(1002);
        this.scaleDownButton.setScrollFactor(0);
        this.scaleDownButton.setInteractive({ useHandCursor: true });
        this.scaleDownButton.on('pointerdown', () => this.scaleSprite(0.9));
        this.scaleDownButton.setVisible(false);
        
        // Create HTML slider controls for precise adjustments
        this.createSliderControls();
        
        // Hide everything initially
        this.setVisible(false);
    }
    
    toggle() {
        this.enabled = !this.enabled;
        this.setVisible(this.enabled);
        
        if (this.enabled) {
            console.log('=== HITBOX EDITOR PAUSING GAME ===');
            // Use centralized pause system
            if (this.scene.pauseGame) {
                this.scene.pauseGame('hitboxEditor');
            } else {
                // Fallback if pauseGame doesn't exist
                this.scene.physics.pause();
                this.scene.time.paused = true;
            }
            
            // Load existing hitbox data
            this.loadHitboxData();
            
            // Load scale data
            this.loadScaleData();
            
            // Show slider panel
            if (this.sliderPanel) {
                this.sliderPanel.style.display = 'block';
            }
        } else {
            // Use centralized resume system
            if (this.scene.resumeGame) {
                this.scene.resumeGame('hitboxEditor');
            } else {
                // Fallback if resumeGame doesn't exist
                this.scene.physics.resume();
                this.scene.time.paused = false;
            }
            this.clearSelection();
            
            // Hide slider panel
            if (this.sliderPanel) {
                this.sliderPanel.style.display = 'none';
            }
        }
        
        return this.enabled;
    }
    
    setVisible(visible) {
        this.graphics.setVisible(visible);
        this.selectionIndicator.setVisible(visible);
        this.infoText.setVisible(visible);
        
        if (!visible) {
            this.saveButton.setVisible(false);
            this.copyButton.setVisible(false);
            this.resetButton.setVisible(false);
            this.scaleUpButton.setVisible(false);
            this.scaleDownButton.setVisible(false);
            this.hideHandles();
        }
    }
    
    selectSprite(sprite) {
        if (!this.enabled) return;
        
        this.clearSelection();
        this.currentSprite = sprite;
        
        // Apply saved hitbox data if available
        const enemyType = sprite.enemyType || sprite.texture.key;
        console.log(`Hitbox Editor: Selected sprite type: ${enemyType}`);
        const savedHitbox = this.hitboxData[enemyType];
        if (savedHitbox) {
            console.log(`Applying saved hitbox:`, savedHitbox);
            sprite.body.setSize(savedHitbox.width, savedHitbox.height);
            sprite.body.setOffset(savedHitbox.offsetX, savedHitbox.offsetY);
        } else {
            console.log(`No saved hitbox for ${enemyType}, using current body settings`);
        }
        
        // Apply saved scale data if available
        const savedScale = this.scaleData && this.scaleData[enemyType];
        if (savedScale) {
            console.log(`Applying saved scale:`, savedScale);
            sprite.setScale(savedScale.scaleX, savedScale.scaleY);
        } else {
            console.log(`No saved scale for ${enemyType}, using current scale`);
        }
        
        // Show all control buttons
        this.saveButton.setVisible(true);
        this.copyButton.setVisible(true);
        this.resetButton.setVisible(true);
        this.scaleUpButton.setVisible(true);
        this.scaleDownButton.setVisible(true);
        
        // Create resize handles
        this.createHandles();
        
        // Show handles
        this.showHandles();
        
        // Update display
        this.updateDisplay();
        
        // Update slider values to match selected sprite
        this.updateSlidersFromSprite();
        
        // Visual feedback for selection - just a brief flash instead of scale
        const originalTint = sprite.tintTopLeft;
        sprite.setTint(0xffff00);
        this.scene.time.delayedCall(100, () => {
            if (sprite.active) {
                sprite.clearTint();
                if (originalTint !== 0xffffff) {
                    sprite.setTint(originalTint);
                }
            }
        });
    }
    
    createHandles() {
        // Clear any existing handles first
        Object.values(this.handles).forEach(handle => {
            if (handle) handle.destroy();
        });
        this.handles = {};
        
        // Create 9 handles for resizing (4 corners + 4 edges + 1 center for moving)
        const positions = [
            'topLeft', 'topMiddle', 'topRight',
            'middleLeft', 'center', 'middleRight',
            'bottomLeft', 'bottomMiddle', 'bottomRight'
        ];
        
        positions.forEach(pos => {
            const handle = this.scene.add.circle(0, 0, 6, this.colors.handles);
            handle.setStrokeStyle(2, this.colors.active);
            handle.setDepth(1003);
            handle.setInteractive({ draggable: true });
            handle.setData('position', pos);
            
            // Add drag events
            handle.on('dragstart', (pointer) => {
                this.isDragging = true;
                handle.setData('isBeingDragged', true);
                handle.setFillStyle(this.colors.active);
                
                // Store initial hitbox state
                const body = this.currentSprite.body;
                const spriteX = this.currentSprite.x;
                const spriteY = this.currentSprite.y;
                
                // Calculate and store initial bounds
                const left = spriteX - this.currentSprite.displayOriginX + body.offset.x;
                const top = spriteY - this.currentSprite.displayOriginY + body.offset.y;
                const right = left + body.width;
                const bottom = top + body.height;
                
                this.dragStartBounds = { left, top, right, bottom };
                console.log('Drag start bounds:', this.dragStartBounds);
            });
            
            handle.on('drag', (pointer, dragX, dragY) => {
                // Phaser's dragX and dragY are the new positions
                handle.x = dragX;
                handle.y = dragY;
                
                // Update hitbox in real-time
                this.updateHitboxFromHandles();
            });
            
            handle.on('dragend', () => {
                this.isDragging = false;
                handle.setData('isBeingDragged', false);
                handle.setFillStyle(this.colors.handles);
                
                // Final update
                this.updateHitboxFromHandles();
                this.updateDisplay();
                
                // Clear stored bounds
                this.dragStartBounds = null;
                
                // Auto-save on drag end
                this.saveCurrentHitbox();
            });
            
            this.handles[pos] = handle;
        });
    }
    
    updateHandlePositions() {
        if (!this.currentSprite || !this.currentSprite.body) return;
        
        const body = this.currentSprite.body;
        // Match the calculation used in updateDisplay
        const x = this.currentSprite.x - this.currentSprite.displayOriginX + body.offset.x;
        const y = this.currentSprite.y - this.currentSprite.displayOriginY + body.offset.y;
        const w = body.width;
        const h = body.height;
        
        // Position handles
        this.handles.topLeft.setPosition(x, y);
        this.handles.topMiddle.setPosition(x + w/2, y);
        this.handles.topRight.setPosition(x + w, y);
        this.handles.middleLeft.setPosition(x, y + h/2);
        this.handles.center.setPosition(x + w/2, y + h/2);
        this.handles.middleRight.setPosition(x + w, y + h/2);
        this.handles.bottomLeft.setPosition(x, y + h);
        this.handles.bottomMiddle.setPosition(x + w/2, y + h);
        this.handles.bottomRight.setPosition(x + w, y + h);
        
        // Make center handle larger and different color
        if (this.handles.center) {
            this.handles.center.setRadius(8);
            this.handles.center.setFillStyle(0x00ffff);
        }
    }
    
    updateHandlesAfterDrag(draggedHandle, left, top, right, bottom) {
        // Only update handles that should move based on which handle was dragged
        const w = right - left;
        const h = bottom - top;
        
        switch (draggedHandle) {
            case 'topLeft':
                // When dragging top-left, update: top row and left column
                this.handles.topLeft.setPosition(left, top);
                this.handles.topMiddle.setPosition(left + w/2, top);
                this.handles.middleLeft.setPosition(left, top + h/2);
                this.handles.center.setPosition(left + w/2, top + h/2);
                this.handles.bottomLeft.setPosition(left, bottom);
                break;
            case 'topMiddle':
                // When dragging top-middle, update: top row
                this.handles.topLeft.setPosition(left, top);
                this.handles.topMiddle.setPosition(left + w/2, top);
                this.handles.topRight.setPosition(right, top);
                this.handles.center.setPosition(left + w/2, top + h/2);
                break;
            case 'topRight':
                // When dragging top-right, update: top row and right column
                this.handles.topMiddle.setPosition(left + w/2, top);
                this.handles.topRight.setPosition(right, top);
                this.handles.middleRight.setPosition(right, top + h/2);
                this.handles.center.setPosition(left + w/2, top + h/2);
                this.handles.bottomRight.setPosition(right, bottom);
                break;
            case 'middleLeft':
                // When dragging middle-left, update: left column
                this.handles.topLeft.setPosition(left, top);
                this.handles.middleLeft.setPosition(left, top + h/2);
                this.handles.bottomLeft.setPosition(left, bottom);
                this.handles.center.setPosition(left + w/2, top + h/2);
                break;
            case 'middleRight':
                // When dragging middle-right, update: right column
                this.handles.topRight.setPosition(right, top);
                this.handles.middleRight.setPosition(right, top + h/2);
                this.handles.bottomRight.setPosition(right, bottom);
                this.handles.center.setPosition(left + w/2, top + h/2);
                break;
            case 'bottomLeft':
                // When dragging bottom-left, update: bottom row and left column
                this.handles.middleLeft.setPosition(left, top + h/2);
                this.handles.bottomLeft.setPosition(left, bottom);
                this.handles.bottomMiddle.setPosition(left + w/2, bottom);
                this.handles.center.setPosition(left + w/2, top + h/2);
                break;
            case 'bottomMiddle':
                // When dragging bottom-middle, update: bottom row
                this.handles.bottomLeft.setPosition(left, bottom);
                this.handles.bottomMiddle.setPosition(left + w/2, bottom);
                this.handles.bottomRight.setPosition(right, bottom);
                this.handles.center.setPosition(left + w/2, top + h/2);
                break;
            case 'bottomRight':
                // When dragging bottom-right, update: bottom row and right column
                this.handles.bottomMiddle.setPosition(left + w/2, bottom);
                this.handles.bottomRight.setPosition(right, bottom);
                this.handles.middleRight.setPosition(right, top + h/2);
                this.handles.center.setPosition(left + w/2, top + h/2);
                break;
            case 'center':
                // When moving center, update all handles
                this.updateHandlePositions();
                break;
        }
    }
    
    updateHitboxFromHandles() {
        if (!this.currentSprite) return;
        
        // Throttle updates to prevent rapid changes
        const now = Date.now();
        if (now - this.lastUpdateTime < this.updateThrottle) {
            return;
        }
        this.lastUpdateTime = now;
        
        const draggedHandle = Object.entries(this.handles).find(([pos, handle]) => 
            handle.getData('isBeingDragged')
        );
        
        if (!draggedHandle) return;
        
        const [position, handle] = draggedHandle;
        const body = this.currentSprite.body;
        const spriteX = this.currentSprite.x;
        const spriteY = this.currentSprite.y;
        
        // Debug logging
        console.log('Before update:', {
            position,
            handlePos: { x: handle.x, y: handle.y },
            bodySize: { width: body.width, height: body.height },
            bodyOffset: { x: body.offset.x, y: body.offset.y }
        });
        
        // Use stored bounds from drag start if available, otherwise calculate current
        let left, top, right, bottom;
        if (this.dragStartBounds) {
            left = this.dragStartBounds.left;
            top = this.dragStartBounds.top;
            right = this.dragStartBounds.right;
            bottom = this.dragStartBounds.bottom;
        } else {
            // Fallback: calculate current bounds
            left = spriteX - this.currentSprite.displayOriginX + body.offset.x;
            top = spriteY - this.currentSprite.displayOriginY + body.offset.y;
            right = left + body.width;
            bottom = top + body.height;
        }
        
        // Update bounds based on which handle is being dragged
        switch (position) {
            case 'center':
                // Move the entire hitbox
                const centerX = handle.x;
                const centerY = handle.y;
                const halfWidth = body.width / 2;
                const halfHeight = body.height / 2;
                left = centerX - halfWidth;
                right = centerX + halfWidth;
                top = centerY - halfHeight;
                bottom = centerY + halfHeight;
                break;
            case 'topLeft':
                left = handle.x;
                top = handle.y;
                break;
            case 'topMiddle':
                top = handle.y;
                break;
            case 'topRight':
                right = handle.x;
                top = handle.y;
                break;
            case 'middleLeft':
                left = handle.x;
                break;
            case 'middleRight':
                right = handle.x;
                break;
            case 'bottomLeft':
                left = handle.x;
                bottom = handle.y;
                break;
            case 'bottomMiddle':
                bottom = handle.y;
                break;
            case 'bottomRight':
                right = handle.x;
                bottom = handle.y;
                break;
        }
        
        // Calculate new dimensions
        const width = Math.max(10, right - left); // Minimum width of 10
        const height = Math.max(10, bottom - top); // Minimum height of 10
        // Calculate offset relative to sprite's top-left corner
        const offsetX = left - (spriteX - this.currentSprite.displayOriginX);
        const offsetY = top - (spriteY - this.currentSprite.displayOriginY);
        
        // Debug logging
        if (position === 'center') {
            console.log('Moving hitbox:', {
                spritePos: { x: spriteX, y: spriteY },
                hitboxBounds: { left, top, right, bottom },
                newOffset: { x: offsetX, y: offsetY },
                size: { width, height }
            });
        }
        
        // Update the sprite's physics body
        this.currentSprite.body.setSize(width, height);
        this.currentSprite.body.setOffset(offsetX, offsetY);
        
        // Debug logging
        console.log('After update:', {
            newSize: { width, height },
            newOffset: { x: offsetX, y: offsetY },
            bounds: { left, top, right, bottom }
        });
        
        // Update only the handles that need to move based on which handle is being dragged
        this.updateHandlesAfterDrag(position, left, top, right, bottom);
        
        // Update display without updating handle positions since we just positioned them
        this.updateDisplay(true);
    }
    
    updateDisplay(skipHandleUpdate = false) {
        if (!this.enabled) return;
        
        // Clear previous graphics
        this.graphics.clear();
        this.selectionIndicator.clear();
        
        if (this.currentSprite && this.currentSprite.body) {
            const body = this.currentSprite.body;
            
            // Draw hitbox
            // In Phaser, the body position is relative to the sprite's top-left corner
            // The offset moves the body relative to that corner
            this.graphics.lineStyle(2, this.colors.hitbox, 1);
            const bodyX = this.currentSprite.x - this.currentSprite.displayOriginX + body.offset.x;
            const bodyY = this.currentSprite.y - this.currentSprite.displayOriginY + body.offset.y;
            this.graphics.strokeRect(
                bodyX,
                bodyY,
                body.width,
                body.height
            );
            
            // Draw sprite outline
            this.graphics.lineStyle(1, 0xffffff, 0.5);
            this.graphics.strokeRect(
                this.currentSprite.x - this.currentSprite.displayOriginX,
                this.currentSprite.y - this.currentSprite.displayOriginY,
                this.currentSprite.displayWidth,
                this.currentSprite.displayHeight
            );
            
            // Draw selection indicator
            this.selectionIndicator.lineStyle(3, 0xffff00, 0.5);
            const padding = 8;
            this.selectionIndicator.strokeRect(
                this.currentSprite.x - this.currentSprite.displayOriginX - padding,
                this.currentSprite.y - this.currentSprite.displayOriginY - padding,
                this.currentSprite.displayWidth + padding * 2,
                this.currentSprite.displayHeight + padding * 2
            );
            
            // Update handle positions
            if (!skipHandleUpdate) {
                this.updateHandlePositions();
            }
            
            // Update info text
            this.infoText.setText([
                `Sprite: ${this.currentSprite.texture.key}`,
                `Type: ${this.currentSprite.enemyType || 'unknown'}`,
                `Scale: ${this.currentSprite.scaleX.toFixed(2)} x ${this.currentSprite.scaleY.toFixed(2)}`,
                `Size: ${Math.round(body.width)} x ${Math.round(body.height)}`,
                `Offset: ${Math.round(body.offset.x)}, ${Math.round(body.offset.y)}`,
                `Position: ${Math.round(this.currentSprite.x)}, ${Math.round(this.currentSprite.y)}`,
                '',
                'Drag handles to resize hitbox',
                'Drag center to move hitbox',
                'Use SCALE buttons to resize sprite',
                'Press H to toggle editor'
            ]);
        } else {
            this.infoText.setText([
                'HITBOX EDITOR',
                '',
                'Click on an enemy to edit',
                'Press H to toggle editor'
            ]);
        }
    }
    
    saveCurrentHitbox() {
        if (!this.currentSprite || !this.currentSprite.body) return;
        
        const body = this.currentSprite.body;
        const data = {
            type: this.currentSprite.enemyType || this.currentSprite.texture.key,
            width: Math.round(body.width),
            height: Math.round(body.height),
            offsetX: Math.round(body.offset.x),
            offsetY: Math.round(body.offset.y)
        };
        
        // Store in memory
        this.hitboxData[data.type] = data;
        
        // Save to JSON file via server
        this.saveToJSON();
        
        // Show confirmation
        const confirmText = this.scene.add.text(
            this.saveButton.x,
            this.saveButton.y + 30,
            'Saved to hitboxes.json!',
            {
                fontSize: '14px',
                color: '#00ff00',
                backgroundColor: '#000000',
                padding: { x: 5, y: 5 }
            }
        );
        confirmText.setDepth(1002);
        confirmText.setScrollFactor(0);
        
        this.scene.time.delayedCall(2000, () => confirmText.destroy());
        
        console.log('Hitbox saved:', data);
    }
    
    saveToJSON() {
        // Since we're in a browser environment, we'll save to localStorage
        // In a real implementation, this would send to a server
        localStorage.setItem('hitboxData', JSON.stringify(this.hitboxData, null, 2));
        
        // Also save combined data with scale info
        const combinedData = {
            hitboxes: this.hitboxData,
            scales: this.scaleData || {}
        };
        
        // Also attempt to save via a simple server if available
        if (window.location.protocol !== 'file:') {
            fetch('/api/save-hitboxes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(combinedData, null, 2)
            }).catch(err => {
                console.log('Server save not available, using localStorage only');
            });
        }
    }
    
    loadHitboxData() {
        // Try to load from localStorage first
        const savedData = localStorage.getItem('hitboxData');
        if (savedData) {
            try {
                this.hitboxData = JSON.parse(savedData);
                console.log('Loaded hitbox data from localStorage:', this.hitboxData);
            } catch (e) {
                console.error('Failed to parse hitbox data:', e);
            }
        }
        
        // Also try to load from server if available
        if (window.location.protocol !== 'file:') {
            fetch('/api/load-hitboxes')
                .then(response => response.json())
                .then(data => {
                    this.hitboxData = { ...this.hitboxData, ...data };
                    console.log('Loaded hitbox data from server:', data);
                })
                .catch(err => {
                    console.log('Server load not available, using localStorage only');
                });
        }
    }
    
    copyHitboxCode() {
        if (!this.currentSprite || !this.currentSprite.body) return;
        
        const body = this.currentSprite.body;
        const code = `${this.currentSprite.enemyType || 'sprite'}.body.setSize(${Math.round(body.width)}, ${Math.round(body.height)});\n${this.currentSprite.enemyType || 'sprite'}.body.setOffset(${Math.round(body.offset.x)}, ${Math.round(body.offset.y)});`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(code).then(() => {
            // Show confirmation
            const confirmText = this.scene.add.text(
                this.copyButton.x,
                this.copyButton.y + 30,
                'Copied to clipboard!',
                {
                    fontSize: '14px',
                    color: '#ffff00',
                    backgroundColor: '#000000',
                    padding: { x: 5, y: 5 }
                }
            );
            confirmText.setDepth(1002);
            confirmText.setScrollFactor(0);
            
            this.scene.time.delayedCall(2000, () => confirmText.destroy());
        });
        
        console.log('Code copied:', code);
    }
    
    resetHitbox() {
        if (!this.currentSprite || !this.currentSprite.body) return;
        
        // Reset hitbox to a small size centered on the sprite
        const defaultSize = 20; // Small 20x20 hitbox
        const offsetX = (this.currentSprite.displayWidth - defaultSize) / 2;
        const offsetY = (this.currentSprite.displayHeight - defaultSize) / 2;
        
        // Apply the reset
        this.currentSprite.body.setSize(defaultSize, defaultSize);
        this.currentSprite.body.setOffset(offsetX, offsetY);
        
        // Update display
        this.updateDisplay();
        this.updateHandlePositions();
        
        // Auto-save the reset
        this.saveCurrentHitbox();
        
        // Show confirmation
        const confirmText = this.scene.add.text(
            this.resetButton.x,
            this.resetButton.y + 30,
            'Hitbox reset to center!',
            {
                fontSize: '14px',
                color: '#ff6666',
                backgroundColor: '#000000',
                padding: { x: 5, y: 5 }
            }
        );
        confirmText.setDepth(1002);
        confirmText.setScrollFactor(0);
        
        this.scene.time.delayedCall(1500, () => confirmText.destroy());
        
        console.log('Hitbox reset to center for', this.currentSprite.enemyType || this.currentSprite.texture.key);
    }
    
    scaleSprite(factor) {
        if (!this.currentSprite) return;
        
        // Calculate new scale
        const newScaleX = this.currentSprite.scaleX * factor;
        const newScaleY = this.currentSprite.scaleY * factor;
        
        // Limit scale to reasonable values (0.1 to 5.0)
        if (newScaleX < 0.1 || newScaleX > 5.0 || newScaleY < 0.1 || newScaleY > 5.0) {
            console.log('Scale limit reached');
            return;
        }
        
        // Store the scale data
        const enemyType = this.currentSprite.enemyType || this.currentSprite.texture.key;
        if (!this.scaleData) {
            this.scaleData = {};
        }
        this.scaleData[enemyType] = { scaleX: newScaleX, scaleY: newScaleY };
        
        // Apply the new scale
        this.currentSprite.setScale(newScaleX, newScaleY);
        
        // Update display
        this.updateDisplay();
        this.updateHandlePositions();
        
        // Save scale data to localStorage
        localStorage.setItem('spriteScaleData', JSON.stringify(this.scaleData));
        
        // Also save to server if available
        this.saveToJSON();
        
        // Show feedback
        const scaleText = factor > 1 ? 'Scale increased!' : 'Scale decreased!';
        const confirmText = this.scene.add.text(
            factor > 1 ? this.scaleUpButton.x : this.scaleDownButton.x,
            this.scaleUpButton.y + 30,
            scaleText,
            {
                fontSize: '14px',
                color: factor > 1 ? '#44ff44' : '#4444ff',
                backgroundColor: '#000000',
                padding: { x: 5, y: 5 }
            }
        );
        confirmText.setDepth(1002);
        confirmText.setScrollFactor(0);
        
        this.scene.time.delayedCall(1000, () => confirmText.destroy());
        
        console.log(`Scaled ${enemyType} to ${newScaleX.toFixed(2)}x${newScaleY.toFixed(2)}`);
    }
    
    clearSelection() {
        this.currentSprite = null;
        this.hideHandles();
        this.graphics.clear();
        this.saveButton.setVisible(false);
        this.copyButton.setVisible(false);
        this.resetButton.setVisible(false);
        this.scaleUpButton.setVisible(false);
        this.scaleDownButton.setVisible(false);
    }
    
    hideHandles() {
        Object.values(this.handles).forEach(handle => {
            if (handle) handle.setVisible(false);
        });
    }
    
    showHandles() {
        Object.values(this.handles).forEach(handle => {
            if (handle) handle.setVisible(true);
        });
    }
    
    loadScaleData() {
        const savedData = localStorage.getItem('spriteScaleData');
        if (savedData) {
            try {
                this.scaleData = JSON.parse(savedData);
                console.log('Loaded scale data:', this.scaleData);
            } catch (e) {
                console.error('Failed to parse scale data:', e);
                this.scaleData = {};
            }
        } else {
            this.scaleData = {};
        }
    }
    
    exportAllData() {
        console.log('=== HITBOX DATA EXPORT ===');
        console.log(JSON.stringify(this.hitboxData, null, 2));
        console.log('=== END EXPORT ===');
        
        console.log('=== SCALE DATA EXPORT ===');
        console.log(JSON.stringify(this.scaleData, null, 2));
        console.log('=== END EXPORT ===');
        
        // Save to proper format for game to use
        if (this.hitboxData) {
            localStorage.setItem('hitboxData', JSON.stringify(this.hitboxData));
        }
        if (this.scaleData) {
            localStorage.setItem('spriteScaleData', JSON.stringify(this.scaleData));
        }
        
        // Copy both to clipboard
        const exportData = {
            hitboxes: this.hitboxData,
            scales: this.scaleData
        };
        const dataStr = JSON.stringify(exportData, null, 2);
        navigator.clipboard.writeText(dataStr);
        
        console.log('Data saved to localStorage and copied to clipboard');
        
        return exportData;
    }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HitboxEditor;
}