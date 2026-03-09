# 🚀 Quick Deployment Guide

## Deploy to GitHub Pages in 3 Steps

### Step 1: Push to GitHub

```bash
cd final_build
git init
git add .
git commit -m "Initial commit: Catch The Cat game"
git branch -M main
git remote add origin https://github.com/SanwikSagarPW/CatchMeIfYouCan.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/SanwikSagarPW/CatchMeIfYouCan`
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 3: Access Your Game

Your game will be live at:
```
https://sanwiksagarpw.github.io/CatchMeIfYouCan/
```

⏱️ Note: Deployment takes 2-5 minutes. Check the **Actions** tab to see deployment progress.

---

## Alternative: Deploy from Parent Repository

If you want to keep your source code separate from the deployed version:

```bash
# From the parent directory (not final_build)
git subtree push --prefix final_build origin gh-pages
```

Then configure GitHub Pages to use the `gh-pages` branch.

---

## Troubleshooting

### Game doesn't load?
- Check browser console for errors (F12)
- Verify all files are uploaded
- Make sure `.nojekyll` file exists

### Assets not loading?
- Verify paths are relative (./assets/...)
- Check CORS settings if hosting elsewhere
- Ensure file names match exactly (case-sensitive)

### Analytics not working?
- Check `js-analytics-bridge/` folder is uploaded
- Open browser console to see analytics logs
- Verify AnalyticsManager is loaded before game

---

## Need Help?

- 📧 Open an issue: https://github.com/SanwikSagarPW/CatchMeIfYouCan/issues
- 📖 Read the full README: [README.md](./README.md)
- 🌐 Check deployment status: https://github.com/SanwikSagarPW/CatchMeIfYouCan/deployments
