# Catch The Cat - Production Build 🐱

[![Play Now](https://img.shields.io/badge/Play-Now-brightgreen?style=for-the-badge)](https://sanwiksagarpw.github.io/CatchMeIfYouCan/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

This folder contains the complete, ready-to-deploy version of the Catch The Cat game with integrated analytics tracking.

**Live Demo:** [https://sanwiksagarpw.github.io/CatchMeIfYouCan/](https://sanwiksagarpw.github.io/CatchMeIfYouCan/)

---

## 📦 Contents

- **index.html** - Main entry point for the game
- **catch-the-cat.js** - Complete compiled game code (1.15 MB)
- **phaser.min.js** - Phaser 3 game engine (862 KB)
- **js-analytics-bridge/** - Analytics manager for tracking game metrics
- **assets/** - Game assets (music and images)
- **404.html** - Custom 404 error page
- **.nojekyll** - Prevents Jekyll processing on GitHub Pages

---

## 🚀 GitHub Pages Deployment

### Method 1: Deploy this folder directly

1. **Push to GitHub:**
   ```bash
   cd final_build
   git init
   git add .
   git commit -m "Deploy Catch The Cat game"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/CatchMeIfYouCan.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings on GitHub
   - Navigate to **Pages** section
   - Under "Source", select branch: **main** and folder: **/ (root)**
   - Click **Save**
   - Your game will be live at: `https://YOUR_USERNAME.github.io/CatchMeIfYouCan/`

### Method 2: Deploy as GitHub Pages branch

1. **From parent directory:**
   ```bash
   # Create orphan gh-pages branch
   git checkout --orphan gh-pages
   
   # Remove all files from working directory
   git rm -rf .
   
   # Copy final_build contents
   cp -r final_build/* .
   
   # Commit and push
   git add .
   git commit -m "Deploy game to GitHub Pages"
   git push origin gh-pages
   ```

2. **Configure GitHub Pages:**
   - Repository Settings → Pages
   - Source: **gh-pages** branch
   - Save and wait for deployment

### Method 3: Using GitHub Actions (Automated)

Create `.github/workflows/deploy.yml` in your main branch:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./final_build
```

---

## 🎮 How to Play

- **Objective:** Trap the cat before it escapes to the edge
- Click on the dots to place blocks
- The cat moves one step after each of your clicks
- **Win:** Surround the cat completely
- **Lose:** Let the cat reach the edge

---

## 💻 Local Development

### Option 1: Open Directly
Simply open `index.html` in a web browser.

### Option 2: Local Web Server
For better compatibility (especially with audio):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

### Option 3: Using npm script
```bash
npm start
```

---

## 📊 Analytics Integration

The game includes an analytics manager that tracks:

- ✅ **Session Data**: Game ID, player session
- ✅ **Level Metrics**: Start time, completion status, time taken
- ✅ **Player Actions**: Each move/block placement
- ✅ **XP System**: Points awarded based on efficiency (fewer moves = more XP)

### Analytics Data Delivery

Analytics data is sent via multiple channels:
1. `window.ReactNativeWebView.postMessage()` - For React Native apps
2. `window.myJsAnalytics.trackGameSession()` - For custom integrations
3. `window.parent.postMessage()` - For iframe embedding
4. Console logging - Fallback for debugging

Data is also queued in localStorage if offline and sent when connection is restored.

---

## 🎵 Background Music

The game includes background music support. The music file is located at `assets/bg-music.mp3` and will play automatically when the game starts.

---

## 🛠️ Technical Details

- **Game Engine**: Phaser 3.16.1
- **Build System**: Webpack 4
- **Language**: TypeScript/JavaScript (ES5 compatible)
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: Fully responsive and touch-enabled

---

## 🎨 Features

- ✨ Modern animated home screen
- 📖 In-game "How to Play" tutorial
- 🎬 Smooth animations and transitions
- 📱 Responsive design for all devices
- ↩️ Undo/Reset functionality
- 🎵 Background music with loop
- 📊 Analytics tracking integration
- 🎯 Smart AI opponent with multiple difficulty solvers

---

## 📄 License

MIT License - Feel free to use and modify for your projects. See [LICENSE](./LICENSE) for details.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/SanwikSagarPW/CatchMeIfYouCan/issues)
- Check the [repository](https://github.com/SanwikSagarPW/CatchMeIfYouCan)

---

## 🌟 Show your support

Give a ⭐️ if you enjoyed this game!

---

**Built with ❤️ using Phaser 3**
