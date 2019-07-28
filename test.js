'use strict'

const tape = require('tape')
const readCoordinateGrid = require('.')

/* eslint-disable quote-props */

const valid = [
	{
		grid: `
			. . . . . + . . . . .
			. . F . . + . . . . .
			. . . . . + . A . . .
			. . . . . + . . . . .
			+ + E + + B + + + + +
			. . . . . + . . . . .
			. . . . . + . C . . .
			. . D . . + . . . . .
			. . . . . + . . . . .
		`,
		options: {},
		points: {
			A: [2, 2],
			B: [0, 0],
			C: [2, -2],
			D: [-3, -3],
			E: [-3, 0],
			F: [-3, 3]
		}
	},
	{
		grid: `
			ㅡ ㅡ ㅡ ㅅ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ
			ㅡ ㅡ ㅡ 율 ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ
			ㅡ ㅡ ㅡ ㅅ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ
			ㅡ ㅡ ㅡ ㅅ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ 🇰🇷
			ㅡ ㅡ ㅡ ㅅ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ
			ㅡ ㅡ ㅡ ㅅ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ
			ㅡ ㅡ ㅡ ㅅ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ
			ㅅ ㅅ ㅅ ㅅ ㅅ ㅅ ㅅ ㅅ ㅅ 리 ㅅ ㅅ ㅅ ㅅ
			ㅡ ㅡ ㅡ ㅅ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ
			ㅡ ㅡ ㅡ ㅅ ㅡ 우 ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ
			스 ㅡ ㅡ ㅅ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ
			ㅡ ㅡ ㅡ ㅅ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ ㅡ
		`,
		options: {
			axisCellCharacter: 'ㅅ',
			normalCellCharacter: 'ㅡ'
		},
		points: {
			'율': [0, 6],
			'🇰🇷': [10, 4],
			'리': [6, 0],
			'우': [2, -2],
			'스': [-3, -3]
		}
	},
	{
		grid: `

			----------
			-a........
			-.b.......
			-..c......
			-....d....
		`,
		options: {
			axisCellCharacter: '-',
			transformCoordinates: ([x, y]) => ({ x: 2 * x, y: 2 * y })
		},
		points: {
			a: { x: 2, y: -2 },
			b: { x: 4, y: -4 },
			c: { x: 6, y: -6 },
			d: { x: 10, y: -8 }
		}
	}
]

const invalid = [
	`

	`,

	`
	. . . . . + . . . . .
	`,

	`
	. . . . + . . . + . .
	`,

	`
	. . . . + . . . + . .
	`,

	`
	. . . . + . . . + . .
	`,

	`
	. . . . . + . . . . .
	. . F . . + . . . . .
	. . . . . . . A . . .
	. . . . . + . . . . .
	+ + E + + B + + + + +
	. . . . . + . . . . .
	`,

	`
	. . . . . + . . . . .
	. . F . . + . . . . .

	. . . . . + . A . . .
	. . . . . + . . . . .
	+ + E + + B + + + + +
	. . . . . + . . . . .
	`,

	`
	. . . . . + . . . . .
	. . F . . + . . . .
	. . . . . + . A . . .
	. . . . . + . . . . .
	+ + E + + B + + + + +
	. . . . . + . . . . .
	`,

	`
	. . . . . + . . . . .
	. . F . . + . . . . .
	. . . . . + . A . . .
	. . . . . + . . . . .
	+ + E + + A + + + + +
	. . . . . + . . . . .
	`
]

const validWithGroups = `
	. . . . . + . . . . .
	. . C C . + . . . . .
	. . . . . + . A . . .
	. . . . . + . . . . .
	+ + B + + A + + + + +
	. . . . . + . . . . .
`

tape('ascii-art-coordinate-grid', t => {
	valid.forEach(({ grid, options, points }, index) => {
		const found = readCoordinateGrid(grid, options)
		t.deepEqual(found, points, `valid grid ${index}`)
	})

	invalid.forEach((grid, index) => {
		t.throws(() => readCoordinateGrid(grid), `invalid grid ${index}`)
	})

	t.throws(() => readCoordinateGrid(validWithGroups), 'invalid with groups')
	const resultWithGroups = readCoordinateGrid(validWithGroups, { groups: true })
	t.deepEqual([...resultWithGroups.A], [...new Set([[2, 2], [0, 0]])], 'valid with groups')
	t.deepEqual([...resultWithGroups.B], [...new Set([[-3, 0]])], 'valid with groups')
	t.deepEqual([...resultWithGroups.C], [...new Set([[-3, 3], [-2, 3]])], 'valid with groups')

	t.end()
})
