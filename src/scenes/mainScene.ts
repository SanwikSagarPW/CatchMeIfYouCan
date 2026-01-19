// --- FILE: scenes/mainScene.ts ---

import data from "../data";
import CatchTheCatGame from "../game";
import Cat from "../sprites/cat";
import Block from "../sprites/block";
// Note: ResetButton, UndoButton, StatusBar, CreditText imports removed as we use HTML UI now
import nearestSolver from "../solvers/nearestSolver";
import RawSVGFile from "../lib/RawSVGFile";

declare type NeighbourData = {
    i?: number,
    j?: number,
    x?: number,
    y?: number,
}

declare type RecordCoord = {
    cat: {i:number, j:number}[],
    wall: {i:number, j:number}[],
}

enum GameState {
    PLAYING = "playing",
    WIN = "win",
    LOSE = "lose",
}

export default class MainScene extends Phaser.Scene {
    public readonly w: number;
    public readonly h: number;
    public readonly r: number;
    public readonly initialWallCount: number;
    public readonly dx: number;
    public readonly dy: number;
    public game: CatchTheCatGame;
    private recordCoord: RecordCoord;
    private bgMusic: Phaser.Sound.BaseSound;
    private backButton: Phaser.GameObjects.Text;

    constructor(w: number, h: number, r: number, initialWallCount: number) {
        super({
            key: "MainScene",
        });
        this.w = w;
        this.h = h;
        this.r = r;
        this.initialWallCount = initialWallCount;
        this.dx = this.r * 2;
        this.dy = this.r * Math.sqrt(3);
    }

    // --- Accessors ---

    get blocks(): Block[][] {
        return this.data.get("blocks");
    }

    set blocks(value: Block[][]) {
        this.data.set("blocks", value);
    }

    get blocksData(): boolean[][] {
        let result: boolean[][] = [];
        this.blocks.forEach((column, i) => {
            result[i] = [];
            column.forEach((block, j) => {
                result[i][j] = block.isWall;
            });
        });
        return result;
    }

    get cat(): Cat {
        return this.data.get("cat");
    }

    set cat(value: Cat) {
        this.data.set("cat", value);
    }

    get state(): GameState {
        return this.data.get("state");
    }

    set state(value: GameState) {
        switch (value) {
            case GameState.PLAYING:
                break;
            case GameState.LOSE:
                this.setStatusText("The cat escaped! You lose.", "lose");
                break;
            case GameState.WIN:
                this.setStatusText("You blocked the cat! You Win!", "win");
                break;
            default:
                return;
        }
        this.data.set("state", value);
    }

    // --- Static Helpers ---

    static getNeighbours(i: number, j: number): NeighbourData[] {
        let left = {i: i - 1, j: j};
        let right = {i: i + 1, j: j};
        let top_left;
        let top_right;
        let bottom_left;
        let bottom_right;
        
        if ((j & 1) === 0) {
            top_left = {i: i - 1, j: j - 1};
            top_right = {i: i, j: j - 1};
            bottom_left = {i: i - 1, j: j + 1};
            bottom_right = {i: i, j: j + 1};
        } else {
            top_left = {i: i, j: j - 1};
            top_right = {i: i + 1, j: j - 1};
            bottom_left = {i: i, j: j + 1};
            bottom_right = {i: i + 1, j: j + 1};
        }
        let neighbours = [];
        neighbours[0] = left;
        neighbours[1] = top_left;
        neighbours[2] = top_right;
        neighbours[3] = right;
        neighbours[4] = bottom_right;
        neighbours[5] = bottom_left;
        return neighbours;
    }

    // --- Phaser Lifecycle ---

    preload(): void {
        let textureScale = this.r / data.catStepLength;
        for (let key in data.textures) {
            this.load.addFile(new RawSVGFile(this.load, key, data.textures[key], {scale: textureScale}));
        }
        
        // Load background music if available
        this.load.audio('bg-music', 'assets/bg-music.mp3');
    }

    create(): void {
        this.createAnimations();
        this.createBlocks();
        this.createCat();
        this.createBackButton();
        
        // We do NOT create internal UI buttons here anymore.
        // The index.ts file handles the HTML UI.
        
        // Show game UI when MainScene is active
        if (window['toggleGameUI']) {
            window['toggleGameUI'](true);
        }
        
        // Ensure input manager knows about the bounding box
        this.input.manager.updateBounds();

        this.reset();
        
        if (this.game.solver) {
            this.cat.solver = this.game.solver;
        }
        
        // Play background music if it exists
        this.playBackgroundMusic();
        
        // Fade in effect
        this.cameras.main.fadeIn(300, 0, 0, 0);

        // Update canvas bounds to fix input offset caused by CSS layout
        this.time.delayedCall(250, () => {
             this.scale.refresh();
        });

        // Add resize listener to handle device rotation or window resizing
        window.addEventListener('resize', () => {
            this.scale.refresh();
        });

        // --- ROBUST INPUT FIX ---
        // Global pointer listener to manually find closest block.
        // This overrides individual hit areas which may be misaligned due to CSS scaling or DPI issues.
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Validate pointer is within game bounds roughly
            if (pointer.x < 0 || pointer.y < 0 || pointer.x > this.scale.width || pointer.y > this.scale.height) return;

            let closestBlock: Block | null = null;
            // Allow clicking slightly outside the visual circle (radius * 1.3) for better touch feel
            let minDistance = this.r * 1.3; 

            // Iterate all blocks to find the closest one to the click
            for (let i = 0; i < this.w; i++) {
                for (let j = 0; j < this.h; j++) {
                    let block = this.blocks[i][j];
                    if (!block) continue;
                    
                    // Compare pointer World Coordinates to Block Visual Coordinates
                    let dist = Phaser.Math.Distance.Between(pointer.worldX, pointer.worldY, block.x, block.y);
                    
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestBlock = block;
                    }
                }
            }

            if (closestBlock) {
               this.playerClick(closestBlock.i, closestBlock.j);
            }
        });
    }

    // --- Game Logic ---

    getPosition(i: number, j: number): NeighbourData {
        return {
            x: this.r * 3 + ((j & 1) === 0 ? this.r : this.dx) + i * this.dx,
            y: this.r * 3 + this.r + j * this.dy,
        };
    }

    getBlock(i: number, j: number): Block | null {
        if (!(i >= 0 && i < this.w && j >= 0 && j < this.h)) {
            return null;
        }
        return this.blocks[i][j];
    }

    playerClick(i: number, j: number): boolean {
        if (this.cat.anims.isPlaying) {
            this.cat.anims.stop();
        }
        
        if (this.state !== GameState.PLAYING) {
            this.setStatusText("Game Over. Click Reset to play again.", "normal");
            return false;
        }
        
        let block = this.getBlock(i, j);
        if (!block) return false;

        if (block.isWall) {
            this.setStatusText("That is already a wall.", "normal");
            return false;
        }
        if (this.cat.i === i && this.cat.j === j) {
            this.setStatusText("You cannot click the cat!", "normal");
            return false;
        }

        // Apply Move
        block.isWall = true;
        
        // Save history for undo
        this.recordCoord.cat.push({i: this.cat.i, j:this.cat.j});
        this.recordCoord.wall.push({i, j});

        if (this.cat.isCaught()) {
            this.setStatusText("You blocked the cat! You Win!", "win");
            this.state = GameState.WIN;
            return false;
        }

        // this.setStatusText(`Clicked (${i}, ${j})`, "normal");
        
        // Cat Move
        let result = this.cat.step();
        if (!result) {
            this.setStatusText("The cat gave up! You Win!", "win");
            this.state = GameState.WIN;
        }
        return true;
    }

    reset() {
        this.cat.reset();
        this.resetBlocks();
        this.randomWall();

        this.recordCoord = {
            cat: [],
            wall: []
        };
        this.state = GameState.PLAYING;
        this.setStatusText("Click a dot to block the cat.", "normal");
    }

    undo() {
        if (this.recordCoord.cat.length) {
            if (this.state !== GameState.PLAYING) {
                // If undoing from a Win/Lose state, resume playing
                this.state = GameState.PLAYING;
            }
            
            const catCoord = this.recordCoord.cat.pop();
            const {i, j} = this.recordCoord.wall.pop();

            this.cat.undo(catCoord.i, catCoord.j);
            this.getBlock(i, j).isWall = false;
            
            this.setStatusText("Undo successful.", "normal");
        } else {
            this.setStatusText("No moves to undo.", "normal");
        }
    }

    /**
     * Helper to update the HTML UI found in index.ts
     */
    private setStatusText(message: string, type: 'normal'|'win'|'lose') {
        // We use the global function defined in index.ts
        if (window['updateStatusText']) {
            window['updateStatusText'](message, type);
        } else {
            console.log(message);
        }
    }

    // --- Object Creation ---

    private createAnimations(): void {
        data.animations.forEach(animation => {
            let frames: AnimationFrameConfig[] = [];
            animation.textures.forEach(texture => {
                frames.push({
                    key: texture,
                    frame: 0,
                });
            });
            this.anims.create({
                key: animation.name,
                frames: frames,
                frameRate: data.frameRate,
                repeat: animation.repeat,
            });
        });
    }

    private createBlocks(): void {
        let blocks = [];
        for (let i = 0; i < this.w; i++) {
            blocks[i] = [];
            for (let j = 0; j < this.h; j++) {
                let block = new Block(this, i, j, this.r * 0.9);
                blocks[i][j] = block;
                this.add.existing(block);
                // Input is now handled by the global scene listener for better robustness
                // block.on("player_click", this.playerClick.bind(this));
            }
        }
        this.blocks = blocks;
    }

    private createCat(): void {
        let cat = new Cat(this);
        cat.on("escaped", () => {
            this.state = GameState.LOSE;
        });
        cat.on("win", () => {
            this.state = GameState.WIN;
        });
        cat.solver = nearestSolver;
        this.cat = cat;
        this.add.existing(cat);
    }

    private resetBlocks() {
        this.blocks.forEach(blocks => {
            blocks.forEach(block => {
                block.isWall = false;
            });
        });
    }

    private randomWall() {
        const array = [];
        for (let j = 0; j < this.h; j++) {
            for (let i = 0; i < this.w; i++) {
                if (i !== this.cat.i || j !== this.cat.j) {
                    array.push(j * this.w + i);
                }
            }
        }
        for (let i = 0; i < array.length; i++) {
            if (i >= this.initialWallCount) {
                break;
            }
            // Shuffle
            const j = i + Math.floor(Math.random() * (array.length - i));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            
            let wallI = array[i] % this.w;
            let wallJ = Math.floor(array[i] / this.w);
            this.getBlock(wallI, wallJ).isWall = true;
        }
    }

    private createBackButton(): void {
        const { width } = this.cameras.main;
        
        this.backButton = this.add.text(width - 20, 20, '← Home', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#6c5ce7',
            fontStyle: 'bold',
            backgroundColor: '#ffffff',
            padding: { x: 12, y: 8 }
        });
        this.backButton.setOrigin(1, 0);
        this.backButton.setInteractive({ useHandCursor: true });
        this.backButton.setDepth(1000);
        
        // Hover effect
        this.backButton.on('pointerover', () => {
            this.backButton.setStyle({ color: '#5849be' });
        });
        
        this.backButton.on('pointerout', () => {
            this.backButton.setStyle({ color: '#6c5ce7' });
        });
        
        // Click to go back to home
        this.backButton.on('pointerdown', () => {
            // Hide game UI when leaving MainScene
            if (window['toggleGameUI']) {
                window['toggleGameUI'](false);
            }
            
            this.cameras.main.fadeOut(200, 0, 0, 0);
            this.time.delayedCall(200, () => {
                // Stop music when leaving
                if (this.bgMusic && this.bgMusic.isPlaying) {
                    this.bgMusic.stop();
                }
                this.scene.start('HomeScene');
            }, [], this);
        });
    }

    private playBackgroundMusic(): void {
        try {
            // Check if music exists and isn't already playing
            if (this.cache.audio.exists('bg-music')) {
                // Try to add the music (will reuse if already exists)
                this.bgMusic = this.sound.add('bg-music', {
                    loop: true,
                    volume: 0.3
                });
                
                // Only play if not already playing
                if (!this.bgMusic.isPlaying) {
                    this.bgMusic.play();
                }
            }
        } catch (error) {
            // Music file not added yet, silently ignore
            console.log('Background music not found.');
        }
    }
}