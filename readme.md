# ascii-art-coordinate-grid

Read a 2D coordinate grid from an *ASCII-art-like* string.

When writing tests for modules that take some list of 2d coordinates as input (e.g. a polygon or an embedding of a graph), I often find it hard to make my input human readable. My data mostly looks somewhat like this:

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

As you can see, it's pretty hard to tell how this polygon looks like, and it gets even more complicated when you have multiple inputs. This is why I created this small module, which allows you to do the following instead:

```js
const readGrid = require('ascii-art-coordinate-grid')
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

const points = readGrid(coordinateGrid)
const polygon = [points.A, points.B, points.C, points.D, points.E, points.F]
```

See [#usage](#usage) for more details.

[![npm version](https://img.shields.io/npm/v/ascii-art-coordinate-grid.svg)](https://www.npmjs.com/package/ascii-art-coordinate-grid)
[![Build Status](https://travis-ci.org/juliuste/ascii-art-coordinate-grid.svg?branch=master)](https://travis-ci.org/juliuste/ascii-art-coordinate-grid)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/ascii-art-coordinate-grid.svg)](https://greenkeeper.io/)
[![license](https://img.shields.io/github/license/juliuste/ascii-art-coordinate-grid.svg?style=flat)](license)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation

```shell
npm install ascii-art-coordinate-grid
```

## Usage

```javascript
const readGrid = require('ascii-art-coordinate-grid')

const gridString = `
. . # . . . .
. . A . . . .
. . # . . . .
. . # . B . .
C # # # # # #
. . # . . . 🇪🇸
`
const options = {
    axisCellCharacter: '#' // defaults to `+`
    normalCellCharacter: '.' // defaults to `.`
    transformCoordinates: ([x, y]) => [x, y] // defaults to the identity function, is applied to all points
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
