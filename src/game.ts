// --- FILE: src/game.ts ---
import "phaser";
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
        
        // Calculate canvas dimensions based on hex grid math
        let canvasWidth = Math.floor((6.5 + 2 * w) * r);
        let canvasHeight = Math.floor((5 + Math.sqrt(3) * h) * r);

        // Instantiate scene objects
        const mainSceneInstance = new MainScene(w, h, r, config.initialWallCount);
        const homeSceneInstance = new HomeScene();
        const howToPlaySceneInstance = new HowToPlayScene();
        
        // Use 'any' for the config object to bypass the "Namespace Phaser.Types has no member" error
        const phaserConfig: any = {
            width: canvasWidth,
            height: canvasHeight,
            type: Phaser.AUTO,
            parent: config.parent,
            backgroundColor: config.backgroundColor,
            // HomeScene must be index 0 to load first
            scene: [homeSceneInstance, howToPlaySceneInstance, mainSceneInstance],
            scale: {
                mode: 3, // Corresponds to Phaser.Scale.FIT
                autoCenter: 1, // Corresponds to Phaser.Scale.CENTER_BOTH or HORIZONTALLY
            },
            input: {
                activePointers: 1,
            }
        };

        super(phaserConfig);
        this.myConfig = config;
        this.mainScene = mainSceneInstance;
    }
}