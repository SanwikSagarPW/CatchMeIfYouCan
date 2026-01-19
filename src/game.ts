// --- FILE: game.ts ---

import MainScene from "./scenes/mainScene";
import HomeScene from "./scenes/homeScene";
import HowToPlayScene from "./scenes/howToPlayScene";

export declare type CatchTheCatGameConfig = {
    w: number,
    h: number,
    r: number,
    initialWallCount: number,
    backgroundColor?: string | number;
    parent?: HTMLElement | string;
    statusBarAlign?: string;
    credit?: string;
};

export default class CatchTheCatGame extends Phaser.Game {
    public readonly mainScene: MainScene;
    public readonly myConfig: CatchTheCatGameConfig;

    constructor(config: CatchTheCatGameConfig) {
        if (!config.credit) config.credit = "";
        if (!config.backgroundColor) config.backgroundColor = 0xffffff;
        if (!config.initialWallCount) config.initialWallCount = 8;
        
        let w = config.w;
        let h = config.h;
        let r = config.r;
        
        // --- CANVAS CALCULATIONS ---
        // Width: (6.5 hexes padding) + (2 * width)
        let canvasWidth = Math.floor((6.5 + 2 * w) * r);
        
        // Height: Reduced padding from original since UI is now HTML
        // (5 hexes padding) + (sqrt(3) * height)
        let canvasHeight = Math.floor((5 + Math.sqrt(3) * h) * r);

        let scene = new MainScene(w, h, r, config.initialWallCount);
        let homeScene = new HomeScene();
        let howToPlayScene = new HowToPlayScene();
        
        const gameConfig: any = {
            width: canvasWidth,
            height: canvasHeight,
            type: Phaser.AUTO,
            parent: config.parent,
            backgroundColor: config.backgroundColor,
            scene: [homeScene, howToPlayScene, scene],
            scale: {
                mode: 1, // FIT
                autoCenter: 2, // CENTER_BOTH
                width: canvasWidth,
                height: canvasHeight
            },
            input: {
                activePointers: 1
            }
        };

        super(gameConfig);
        this.myConfig = config;
        this.mainScene = scene;
    }

    private _solver;

    get solver() {
        return this._solver;
    }

    set solver(value) {
        this._solver = value;
        try {
            this.mainScene.cat.solver = value;
        } finally {
        }
    }
}