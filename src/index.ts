// --- FILE: index.ts ---

/// <reference path="./phaser.d.ts"/>

import CatchTheCatGame from "./game";

/**
 * ------------------------------------------------------------------
 * 1. CSS STYLES
 * Modern gradient theme, card layout, and responsive adjustments.
 * ------------------------------------------------------------------
 */
const style = document.createElement('style');
style.innerHTML = `
    :root {
        --primary: #6c5ce7;       /* Purple */
        --primary-dark: #5849be;
        --secondary: #00cec9;     /* Teal */
        --accent: #fd79a8;        /* Pink */
        --text-body: #2d3436;
        --bg-gradient: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
        --card-bg: rgba(255, 255, 255, 0.95);
    }

    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

    body {
        margin: 0;
        padding: 0;
        background: var(--bg-gradient);
        font-family: 'Nunito', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        overflow: hidden; /* Prevent scrolling on mobile */
    }

    /* The Main Game Card */
    #game-card {
        background: var(--card-bg);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 95%;
        max-width: 500px;
        padding: 24px;
        position: relative;
        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Header */
    .header { text-align: center; margin-bottom: 16px; }
    h1 { 
        margin: 0; 
        font-size: 2.2rem; 
        color: var(--primary-dark); 
        font-weight: 900; 
        text-transform: uppercase; 
        letter-spacing: 1px;
        line-height: 1;
    }
    p.subtitle { margin: 8px 0 0; color: #636e72; font-weight: 700; font-size: 1rem; }

    /* Status Bar (Win/Lose messages) */
    #status-display {
        background: #f1f2f6;
        color: var(--text-body);
        padding: 12px 20px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 1rem;
        margin-bottom: 20px;
        text-align: center;
        width: 100%;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        display: none; /* Hidden by default on home screen */
    }
    
    #status-display.active { display: block; }
    #status-display.win { background: #dff9fb; color: #009485; border-color: #00cec9; }
    #status-display.lose { background: #fab1a0; color: #b33939; border-color: #ff7675; }

    /* Phaser Container */
    #phaser-game {
        border-radius: 16px;
        overflow: hidden;
        width: 100%;
        display: block; /* Changed from flex to block to avoid offset calculation issues */
        margin-bottom: 24px;
        position: relative;
        /* Subtle border to frame the grid */
        border: 2px solid #dfe6e9;
        /* Enforce Aspect Ratio wrapper if needed, but let's stick to simple block for now */
        line-height: 0; /* Remove gap below canvas */
    }
    
    #phaser-game canvas {
        display: block;
        margin: 0 auto; /* CSS Centering backup */
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        max-width: 100%; /* Ensure it never overflows width */
        height: auto; /* Maintain aspect ratio */
    }

    /* Buttons */
    .controls {
        display: none; /* Hidden by default on home screen */
        gap: 16px;
        width: 100%;
    }
    
    .controls.active { display: flex; }

    .btn {
        flex: 1;
        border: none;
        padding: 16px;
        border-radius: 14px;
        font-family: 'Nunito', sans-serif;
        font-weight: 800;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.1s, box-shadow 0.2s;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn:active { transform: scale(0.96); }

    .btn-undo { 
        background: white; 
        color: var(--primary); 
        border: 2px solid var(--primary); 
    }
    .btn-undo:hover { background: #f8f9fa; }

    .btn-reset { 
        background: var(--primary); 
        color: white; 
        box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
    }
    .btn-reset:hover { background: var(--primary-dark); }

    .footer { margin-top: 20px; color: #b2bec3; font-size: 0.8rem; font-weight: 600; display: none; }
    .footer.active { display: block; }

    @keyframes slideUp {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Inject Google Fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Fix Mobile Viewport
let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
if (!meta) {
    meta = document.createElement('meta');
    meta.name = "viewport";
    document.head.appendChild(meta);
}
meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");


/**
 * ------------------------------------------------------------------
 * 2. DOM STRUCTURE
 * ------------------------------------------------------------------
 */
const wrapper = document.createElement('div');
wrapper.id = 'game-card';
wrapper.innerHTML = `
    <div class="header" style="display: none;">
        <h1>Catch The Cat</h1>
        <p class="subtitle">Trap the kitty before it escapes!</p>
    </div>
    
    <div id="status-display">Click a dot to start...</div>
    
    <div id="phaser-game"></div>
    
    <div class="controls">
        <button id="btn-undo" class="btn btn-undo">Undo</button>
        <button id="btn-reset" class="btn btn-reset">Reset Game</button>
    </div>

    <div class="footer">
        Strategy Puzzle Game
    </div>
`;

// Clear body to remove old canvas if hot-reloading
document.body.innerHTML = '';
document.body.appendChild(wrapper);


/**
 * ------------------------------------------------------------------
 * 3. GLOBAL HELPER
 * Allows the Game Scene to update the HTML text
 * ------------------------------------------------------------------
 */
window['updateStatusText'] = (text: string, type: 'normal'|'win'|'lose' = 'normal') => {
    const el = document.getElementById('status-display');
    if (el) {
        el.innerText = text;
        el.className = 'active'; // Show status display
        if (type !== 'normal') el.classList.add(type);
    }
};

/**
 * Helper to show/hide game UI elements
 */
window['toggleGameUI'] = (show: boolean) => {
    const header = document.querySelector('.header') as HTMLElement;
    const controls = document.querySelector('.controls') as HTMLElement;
    const statusDisplay = document.getElementById('status-display') as HTMLElement;
    const footer = document.querySelector('.footer') as HTMLElement;
    
    if (show) {
        if (header) header.style.display = 'block';
        if (controls) controls.classList.add('active');
        if (statusDisplay) statusDisplay.classList.add('active');
        if (footer) footer.classList.add('active');
    } else {
        if (header) header.style.display = 'none';
        if (controls) controls.classList.remove('active');
        if (statusDisplay) statusDisplay.classList.remove('active');
        if (footer) footer.classList.remove('active');
    }
};


/**
 * ------------------------------------------------------------------
 * 4. GAME INIT
 * ------------------------------------------------------------------
 */
const gameConfig = {
    w: 11,
    h: 11,
    r: 20,
    initialWallCount: 8,
    backgroundColor: 0xffffff,
    parent: "phaser-game",
};

const game = new CatchTheCatGame(gameConfig);

// Connect HTML Buttons to Game Logic
const undoBtn = document.getElementById('btn-undo');
const resetBtn = document.getElementById('btn-reset');

if (undoBtn) {
    undoBtn.onclick = () => {
        if (game.mainScene) game.mainScene.undo();
    };
}

if (resetBtn) {
    resetBtn.onclick = () => {
        if (game.mainScene) game.mainScene.reset();
    };
}