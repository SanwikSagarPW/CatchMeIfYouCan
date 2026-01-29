// --- FILE: src/index.ts ---

/// <reference path="./phaser.d.ts"/>

import CatchTheCatGame from "./game";

/**
 * ------------------------------------------------------------------
 * 1. CSS STYLES
 * ------------------------------------------------------------------
 */
const style = document.createElement('style');
style.innerHTML = `
    :root {
        --primary: #6c5ce7;
        --primary-dark: #5849be;
        --bg-gradient: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
        --card-bg: rgba(255, 255, 255, 0.95);
        --text-body: #2d3436;
    }

    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

    body {
        margin: 0; padding: 0;
        background: var(--bg-gradient);
        font-family: 'Nunito', sans-serif;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        min-height: 100vh; overflow: hidden;
    }

    #game-card {
        background: var(--card-bg);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        display: flex; flex-direction: column;
        align-items: center;
        width: 95%; max-width: 500px;
        padding: 24px;
        position: relative;
    }

    /* Header, Controls, Footer - Hidden by default (display: none) */
    .header, .controls, .footer, #status-display { display: none; }
    
    /* Active classes to show elements */
    .header.active, .controls.active, .footer.active, #status-display.active { display: block; }
    .controls.active { display: flex; gap: 16px; width: 100%; }

    .header { text-align: center; margin-bottom: 16px; }
    h1 { margin: 0; font-size: 2.2rem; color: var(--primary-dark); text-transform: uppercase; }
    p.subtitle { margin: 8px 0 0; color: #636e72; font-weight: 700; }

    #status-display {
        background: #f1f2f6; color: var(--text-body);
        padding: 12px 20px; border-radius: 12px;
        font-weight: 700; text-align: center; width: 100%;
        margin-bottom: 20px;
    }
    #status-display.win { background: #dff9fb; color: #009485; }
    #status-display.lose { background: #fab1a0; color: #b33939; }

    #phaser-game {
        border-radius: 16px; overflow: hidden;
        width: 100%; display: block; margin-bottom: 0;
        border: 2px solid #dfe6e9;
        line-height: 0;
    }
    
    #phaser-game canvas { display: block; max-width: 100%; height: auto; }

    .btn {
        flex: 1; border: none; padding: 16px;
        border-radius: 14px; font-weight: 800; cursor: pointer;
        text-transform: uppercase;
    }
    .btn-undo { background: white; color: var(--primary); border: 2px solid var(--primary); }
    .btn-reset { background: var(--primary); color: white; }
    
    .footer { margin-top: 20px; color: #b2bec3; font-size: 0.8rem; font-weight: 600; }
`;
document.head.appendChild(style);

// --- DOM STRUCTURE ---
const wrapper = document.createElement('div');
wrapper.id = 'game-card';
wrapper.innerHTML = `
    <div class="header">
        <h1>Catch The Cat</h1>
        <p class="subtitle">Trap the kitty before it escapes!</p>
    </div>
    <div id="status-display">Click a dot to start...</div>
    <div id="phaser-game"></div>
    <div class="controls">
        <button id="btn-undo" class="btn btn-undo">Undo</button>
        <button id="btn-reset" class="btn btn-reset">Reset</button>
    </div>
    <div class="footer">Strategy Puzzle Game</div>
`;
document.body.innerHTML = '';
document.body.appendChild(wrapper);

// --- GLOBAL HELPERS ---
window['updateStatusText'] = (text: string, type: 'normal'|'win'|'lose' = 'normal') => {
    const el = document.getElementById('status-display');
    if (el) {
        el.innerText = text;
        el.className = 'active'; 
        if (type !== 'normal') el.classList.add(type);
    }
};

window['toggleGameUI'] = (show: boolean) => {
    const header = document.querySelector('.header');
    const controls = document.querySelector('.controls');
    const status = document.getElementById('status-display');
    const footer = document.querySelector('.footer');
    
    const method = show ? 'add' : 'remove';
    header?.classList[method]('active');
    controls?.classList[method]('active');
    status?.classList[method]('active');
    footer?.classList[method]('active');
};

// --- INIT GAME ---
const game = new CatchTheCatGame({
    w: 11, h: 11, r: 20, initialWallCount: 8,
    parent: "phaser-game",
});

// --- BUTTONS ---
document.getElementById('btn-undo')?.addEventListener('click', () => {
    // Only undo if MainScene is active
    if (game.scene.isActive('MainScene')) {
        game.mainScene.undo();
    }
});

document.getElementById('btn-reset')?.addEventListener('click', () => {
    if (game.scene.isActive('MainScene')) {
        game.mainScene.reset();
    }
});