export default class HomeScene extends Phaser.Scene {
    private titleText: Phaser.GameObjects.Text;
    private playButton: Phaser.GameObjects.Container;
    private howToPlayButton: Phaser.GameObjects.Container;
    private catEmoji: Phaser.GameObjects.Text;
    private particles: Phaser.GameObjects.Graphics[];
    private bgMusic: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: "HomeScene" });
    }

    preload(): void {
        // Load background music - user will add this file later
        this.load.audio('bg-music', 'assets/bg-music.mp3');
    }

    create(): void {
        const { width, height } = this.cameras.main;
        
        // Background gradient effect
        this.createBackgroundParticles();
        
        // Animated title with bounce effect
        this.createTitle(width, height);
        
        // Cute cat animation
        this.createCatAnimation(width, height);
        
        // Play button with hover effect
        this.createPlayButton(width, height);
        
        // How to Play button
        this.createHowToPlayButton(width, height);
        
        // Footer text
        this.createFooter(width, height);
        
        // Try to play background music (will fail gracefully if file doesn't exist yet)
        this.playBackgroundMusic();
    }

    private createBackgroundParticles(): void {
        this.particles = [];
        const { width, height } = this.cameras.main;
        
        // Create floating particles for ambient effect
        for (let i = 0; i < 15; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0x6c5ce7, 0.1);
            particle.fillCircle(0, 0, Math.random() * 20 + 5);
            particle.setPosition(
                Math.random() * width,
                Math.random() * height
            );
            
            this.particles.push(particle);
            
            // Animate particles floating
            this.tweens.add({
                targets: particle,
                y: particle.y + (Math.random() * 100 - 50),
                x: particle.x + (Math.random() * 100 - 50),
                alpha: Math.random() * 0.3 + 0.1,
                duration: Math.random() * 3000 + 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    private createTitle(width: number, height: number): void {
        // Main title
        this.titleText = this.add.text(width / 2, height * 0.25, 'CATCH THE CAT', {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: '48px',
            color: '#6c5ce7',
            stroke: '#ffffff',
            strokeThickness: 6,
            align: 'center',
            fontStyle: 'bold'
        });
        this.titleText.setOrigin(0.5);
        
        // Bounce animation for title
        this.tweens.add({
            targets: this.titleText,
            scale: { from: 1, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Subtitle
        const subtitle = this.add.text(width / 2, height * 0.32, 'Trap the Kitty Before It Escapes!', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#636e72',
            fontStyle: 'bold'
        });
        subtitle.setOrigin(0.5);
        
        // Fade in/out animation for subtitle
        this.tweens.add({
            targets: subtitle,
            alpha: { from: 0.7, to: 1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private createCatAnimation(width: number, height: number): void {
        // Cute cat emoji with bounce animation
        this.catEmoji = this.add.text(width / 2, height * 0.45, '🐱', {
            fontSize: '80px'
        });
        this.catEmoji.setOrigin(0.5);
        
        // Cat bounce animation
        this.tweens.add({
            targets: this.catEmoji,
            y: height * 0.45 - 20,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Bounce.easeOut'
        });
        
        // Cat rotation animation
        this.tweens.add({
            targets: this.catEmoji,
            angle: { from: -10, to: 10 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private createPlayButton(width: number, height: number): void {
        const buttonY = height * 0.62;
        
        // Button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x6c5ce7, 1);
        buttonBg.fillRoundedRect(-100, -25, 200, 50, 25);
        
        // Button text
        const buttonText = this.add.text(0, 0, 'PLAY', {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5);
        
        // Create container
        this.playButton = this.add.container(width / 2, buttonY, [buttonBg, buttonText]);
        this.playButton.setSize(200, 50);
        this.playButton.setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains);
        this.playButton.input.hitArea.setTo(-100, -25, 200, 50);
        this.playButton.input.cursor = 'pointer';
        
        // Hover effect
        this.playButton.on('pointerover', () => {
            this.tweens.add({
                targets: this.playButton,
                scale: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
            buttonBg.clear();
            buttonBg.fillStyle(0x5849be, 1);
            buttonBg.fillRoundedRect(-100, -25, 200, 50, 25);
        });
        
        this.playButton.on('pointerout', () => {
            this.tweens.add({
                targets: this.playButton,
                scale: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
            buttonBg.clear();
            buttonBg.fillStyle(0x6c5ce7, 1);
            buttonBg.fillRoundedRect(-100, -25, 200, 50, 25);
        });
        
        // Click to start game
        this.playButton.on('pointerdown', () => {
            this.tweens.add({
                targets: this.playButton,
                scale: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.cameras.main.fadeOut(300, 0, 0, 0);
                    this.time.delayedCall(300, () => {
                        this.scene.start('MainScene');
                    }, [], this);
                }
            });
        });
        
        // Pulse animation
        this.tweens.add({
            targets: this.playButton,
            scale: { from: 1, to: 1.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private createHowToPlayButton(width: number, height: number): void {
        const buttonY = height * 0.74;
        
        // Button background
        const buttonBg = this.add.graphics();
        buttonBg.lineStyle(3, 0x6c5ce7, 1);
        buttonBg.strokeRoundedRect(-120, -22, 240, 44, 22);
        
        // Button text
        const buttonText = this.add.text(0, 0, 'How to Play', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
            color: '#6c5ce7',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5);
        
        // Create container
        this.howToPlayButton = this.add.container(width / 2, buttonY, [buttonBg, buttonText]);
        this.howToPlayButton.setSize(240, 44);
        this.howToPlayButton.setInteractive(new Phaser.Geom.Rectangle(-120, -22, 240, 44), Phaser.Geom.Rectangle.Contains);
        this.howToPlayButton.input.hitArea.setTo(-120, -22, 240, 44);
        this.howToPlayButton.input.cursor = 'pointer';
        
        // Hover effect
        this.howToPlayButton.on('pointerover', () => {
            this.tweens.add({
                targets: this.howToPlayButton,
                scale: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
            buttonBg.clear();
            buttonBg.fillStyle(0x6c5ce7, 0.1);
            buttonBg.fillRoundedRect(-120, -22, 240, 44, 22);
            buttonBg.lineStyle(3, 0x6c5ce7, 1);
            buttonBg.strokeRoundedRect(-120, -22, 240, 44, 22);
        });
        
        this.howToPlayButton.on('pointerout', () => {
            this.tweens.add({
                targets: this.howToPlayButton,
                scale: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
            buttonBg.clear();
            buttonBg.lineStyle(3, 0x6c5ce7, 1);
            buttonBg.strokeRoundedRect(-120, -22, 240, 44, 22);
        });
        
        // Click to show instructions
        this.howToPlayButton.on('pointerdown', () => {
            this.tweens.add({
                targets: this.howToPlayButton,
                scale: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.cameras.main.fadeOut(200, 0, 0, 0);
                    this.time.delayedCall(200, () => {
                        this.scene.start('HowToPlayScene');
                    }, [], this);
                }
            });
        });
    }

    private createFooter(width: number, height: number): void {
        const footer = this.add.text(width / 2, height * 0.9, 'Strategy Puzzle Game', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#b2bec3',
            fontStyle: 'bold'
        });
        footer.setOrigin(0.5);
    }

    private playBackgroundMusic(): void {
        try {
            // Check if music exists and play it
            if (this.cache.audio.exists('bg-music')) {
                this.bgMusic = this.sound.add('bg-music', {
                    loop: true,
                    volume: 0.3
                });
                this.bgMusic.play();
            }
        } catch (error) {
            // Music file not added yet, silently ignore
            console.log('Background music not found. Add bg-music.mp3 to assets folder.');
        }
    }

    update(): void {
        // Any per-frame updates can go here
    }
}
