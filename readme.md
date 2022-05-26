# ascii-art-coordinate-grid

Read a 2D coordinate grid from an *ASCII-art-like* string.

When writing tests for modules that take some list of 2d coordinates as input (e.g. a polygon or an embedding of a graph), I often find it hard to make my the test's input data human readable. For example, a polygon ends up looking like this:

```js
const polygon = [
    [2, 2],
    [0, 0],
    [2, -2],
    [-3, -3],
    [-3, 0],
    [-3, 3]
]
```

As you can see, it's not really obvious how that polygon looks like or what properties it has (e.g. being concave). So, in order to improve readability, I created this module, which allows you to draw out your points on an *ASCII-art-like* coordinate grid instead:

```js
import readGrid from 'ascii-art-coordinate-grid'
const coordinateGrid = `
. . . . . + . . . . .
. . F . . + . . . . .
. . . . . + . A . . .
. . . . . + . . . . .
+ + E + + B + + + + +
. . . . . + . . . . .
. . . . . + . C . . .
. . D . . + . . . . .
. . . . . + . . . . .
`

const points = readGrid(coordinateGrid) // check the "usage" section for further explanations
const polygon = [points.A, points.B, points.C, points.D, points.E, points.F]
```

Now, `polygon` will contain the same numerical values as before, but the reader might have a much easier time understanding the data.

[![npm version](https://img.shields.io/npm/v/ascii-art-coordinate-grid.svg)](https://www.npmjs.com/package/ascii-art-coordinate-grid)
[![License](https://img.shields.io/github/license/juliuste/ascii-art-coordinate-grid.svg?style=flat)](license)
[![Contact me](https://img.shields.io/badge/contact-email-turquoise)](mailto:mail@juliustens.eu)

## Installation

```shell
npm install ascii-art-coordinate-grid
```

## Usage

**This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).**

```javascript
import readGrid from 'ascii-art-coordinate-grid'

const gridString = `
. . # . . . .
. . A . . . .
. . # . . . .
. . # . B . .
C # # # # # #
. . # . . . 🇪🇸
`
const options = {
    axisCellCharacter: '#', // defaults to `+`
    normalCellCharacter: '.', // defaults to `.`
    transformCoordinates: ([x, y]) => [x, y], // defaults to the identity function, is applied to all points
    groups: false // if you set this to true, you can use the same character more than once and the points object will contain Sets of coordinates per character instead of one coordinate pair per character
}

const points = readGrid(gridString, options)
// {
//     A: [0, 3],
//     B: [2, 1],
//     C: [-2, 0],
//     '🇪🇸': [4, -1]
// }

const polygon = [points.A, points.B, points.C, points['🇪🇸']]
```

Note that point names can be any non-whitespace *human perceived* characters, so even emoji `🇫🇷` or other combined characters like `나`.

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/juliuste/ascii-art-coordinate-grid/issues).
