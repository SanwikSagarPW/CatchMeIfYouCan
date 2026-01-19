# Catch The Cat

[Start Game](https://ganlvtech.github.io/phaser-catch-the-cat/)
[![Build Status](https://www.travis-ci.org/ganlvtech/phaser-catch-the-cat.svg?branch=master)](https://www.travis-ci.org/ganlvtech/phaser-catch-the-cat)

## 🎮 Features

* **Modern Home Screen** - Animated title, cute cat emoji, and smooth transitions
* **How to Play Tutorial** - In-game instructions panel
* **Background Music** - Looping background music support (add your own!)
* **Responsive Design** - Beautiful gradient UI that works on all devices
* **Smooth Animations** - Bounce effects, fade transitions, and hover states

## 🎵 Adding Background Music

To add background music to your game:
1. Find or create a background music file (MP3 format recommended)
2. Name it `bg-music.mp3`
3. Place it in the `assets/` folder
4. The game will automatically load and play the music

Recommended: Use a soft, playful tune that loops well for a puzzle game.

## How to Play

* Click on the dots to surround the cat.
* You click once, the cat moves once.
* The game ends when you surround the cat (win), or the cat reaches the edge and escapes (lose).

## Deployment

First, include the game framework `phaser.min.js`

```html
<script src="phaser.min.js"></script>
```

Then include the game code `catch-the-cat.js`

```html
<script src="catch-the-cat.js"></script>
```

Then create a game canvas in the specified div and start the game

```html
<div id="catch-the-cat"></div>
<script>
    window.game = new CatchTheCatGame({
        w: 11,
        h: 11,
        r: 20,
        initialWallCount: 8,
        backgroundColor: 0xeeeeee,
        parent: 'catch-the-cat',
        statusBarAlign: 'center',
        credit: 'github.com/ganlvtech'
    });
</script>
```

Parameter list:

| Parameter | Value | Description              |
| :-------: | :---: | :----------------------- |
| w         | `11`  | Number of horizontal cells |
| h         | `11`  | Number of vertical cells   |
| r         | `20`  | Circle radius in pixels    |

Optional parameters:

| Parameter       | Value                  | Description                                     |
| :-------------: | :--------------------- | :---------------------------------------------- |
| backgroundColor | `0xeeeeee`             | Background color                                |
| parent          | `catch-the-cat`        | ID or DOM object of the parent element         |
| statusBarAlign  | `center`               | Status bar alignment: `left` or `center`        |
| credit          | `github.com/ganlvtech` | Credit text in the bottom right corner          |

## Writing Your Own Algorithmg Your Own Algorithm

Refer to the examples provided in `src/solvers/` to write your algorithm, and replace it using the following code.

```js
window.game.solver = yourSolver;
```

The return value of this solver indicates which direction the cat should move. If the cat hits a wall, the player wins.

| Value | Description      |
| :---- | :--------------- |
| -1    | Cat surrenders   |
| 0     | Left             |
| 1     | Top-left         |
| 2     | Top-right        |
| 3     | Right            |
| 4     | Bottom-right     |
| 5     | Bottom-left      |

The cat is at the asterisk position, and the numbers represent each direction

```plain
 1 2
0 * 3
 5 4
```

For exampler example

```js
window.game.solver = function (blocksIsWall, i, j) {
    return 0;
};
```

This means: keep moving left until hitting a wall.

## Notes

* The game concept and cat images are from [www.gamedesign.jp](https://www.gamedesign.jp/flash/chatnoir/chatnoir.html). The original game is called Chat Noir, and this is just a JavaScript rewrite.

## License

MIT License