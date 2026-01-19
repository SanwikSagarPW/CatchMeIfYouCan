export default class HowToPlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "HowToPlayScene" });
    }

    create(): void {
        const { width, height } = this.cameras.main;
        
        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0xffffff, 1);
        bg.fillRect(0, 0, width, height);
        
        // Title
        const title = this.add.text(width / 2, 50, 'How to Play', {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: '42px',
            color: '#6c5ce7',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        
        // Instructions panel background
        const panelWidth = width * 0.85;
        const panelHeight = height * 0.62;
        const panelX = (width - panelWidth) / 2;
        const panelY = height * 0.16;
        
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0xf8f9fa, 1);
        panelBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);
        panelBg.lineStyle(3, 0x6c5ce7, 0.3);
        panelBg.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);
        
        // Instructions sections
        const sections = [
            {
                icon: '🎯',
                title: 'Objective',
                content: 'Trap the cat before it escapes to the edge!'
            },
            {
                icon: '🎮',
                title: 'How to Play',
                points: [
                    'Click on empty dots to block the cat\'s path',
                    'The cat moves after each of your clicks',
                    'Surround the cat completely to win',
                    'If the cat reaches the edge, you lose'
                ]
            },
            {
                icon: '💡',
                title: 'Tips',
                points: [
                    'Plan your moves carefully',
                    'Try to corner the cat early',
                    'Use the Undo button if you make a mistake'
                ]
            }
        ];
        
        let yOffset = panelY + 30;
        let animationDelay = 0;
        
        sections.forEach((section, sectionIndex) => {
            // Section header with icon
            const header = this.add.text(width / 2, yOffset, `${section.icon} ${section.title}`, {
                fontFamily: 'Arial Black, sans-serif',
                fontSize: '22px',
                color: '#6c5ce7',
                fontStyle: 'bold'
            });
            header.setOrigin(0.5, 0);
            header.setAlpha(0);
            this.tweens.add({
                targets: header,
                alpha: 1,
                duration: 300,
                delay: animationDelay,
                ease: 'Power2'
            });
            animationDelay += 100;
            
            yOffset += 35;
            
            // Content or bullet points
            if (section.content) {
                const content = this.add.text(width / 2, yOffset, section.content, {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '17px',
                    color: '#2d3436',
                    align: 'center',
                    wordWrap: { width: panelWidth * 0.85 }
                });
                content.setOrigin(0.5, 0);
                content.setAlpha(0);
                this.tweens.add({
                    targets: content,
                    alpha: 1,
                    duration: 300,
                    delay: animationDelay,
                    ease: 'Power2'
                });
                animationDelay += 80;
                yOffset += content.height + 20;
            } else if (section.points) {
                section.points.forEach((point, pointIndex) => {
                    const bullet = this.add.text(panelX + 40, yOffset, '•', {
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '20px',
                        color: '#6c5ce7',
                        fontStyle: 'bold'
                    });
                    bullet.setOrigin(0, 0);
                    bullet.setAlpha(0);
                    
                    const pointText = this.add.text(panelX + 65, yOffset, point, {
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        color: '#2d3436',
                        wordWrap: { width: panelWidth - 90 }
                    });
                    pointText.setOrigin(0, 0);
                    pointText.setAlpha(0);
                    
                    this.tweens.add({
                        targets: [bullet, pointText],
                        alpha: 1,
                        duration: 300,
                        delay: animationDelay,
                        ease: 'Power2'
                    });
                    animationDelay += 80;
                    
                    yOffset += Math.max(bullet.height, pointText.height) + 12;
                });
                yOffset += 15;
            }
        });
        
        // Back button
        this.createBackButton(width, height);
        
        // Fade in effect
        this.cameras.main.fadeIn(200, 0, 0, 0);
    }

    private createBackButton(width: number, height: number): void {
        const buttonY = height * 0.88;
        
        // Button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x6c5ce7, 1);
        buttonBg.fillRoundedRect(-80, -22, 160, 44, 22);
        
        // Button text
        const buttonText = this.add.text(0, 0, '← Back', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5);
        
        // Create container
        const backButton = this.add.container(width / 2, buttonY, [buttonBg, buttonText]);
        backButton.setSize(160, 44);
        backButton.setInteractive(new Phaser.Geom.Rectangle(-80, -22, 160, 44), Phaser.Geom.Rectangle.Contains);
        backButton.input.hitArea.setTo(-80, -22, 160, 44);
        backButton.input.cursor = 'pointer';
        
        // Hover effect
        backButton.on('pointerover', () => {
            this.tweens.add({
                targets: backButton,
                scale: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
            buttonBg.clear();
            buttonBg.fillStyle(0x5849be, 1);
            buttonBg.fillRoundedRect(-80, -22, 160, 44, 22);
        });
        
        backButton.on('pointerout', () => {
            this.tweens.add({
                targets: backButton,
                scale: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
            buttonBg.clear();
            buttonBg.fillStyle(0x6c5ce7, 1);
            buttonBg.fillRoundedRect(-80, -22, 160, 44, 22);
        });
        
        // Click to go back
        backButton.on('pointerdown', () => {
            this.tweens.add({
                targets: backButton,
                scale: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.cameras.main.fadeOut(200, 0, 0, 0);
                    this.time.delayedCall(200, () => {
                        this.scene.start('HomeScene');
                    }, [], this);
                }
            });
        });
    }
}
