'use strict'

const GraphemeSplitter = require('grapheme-splitter')
const splitLines = require('split-lines')
const merge = require('lodash/merge')
const isFunction = require('lodash/isFunction')
const trim = require('lodash/trim')
const replace = require('lodash/replace')
const range = require('lodash/range')
const flatMap = require('lodash/flatMap')
const reduce = require('lodash/reduce')

const graphemeSplitter = new GraphemeSplitter()
const getCharacters = string => graphemeSplitter.splitGraphemes(string)

const removeWhitespace = string => replace(string, /\s/g, '')

const isValidCellCharacter = character => {
	const hasNoWhitespace = removeWhitespace(character) === character
	const isExactlyOneCharacter = getCharacters(character).length === 1
	return hasNoWhitespace && isExactlyOneCharacter
}

const defaults = {
	axisCellCharacter: '+',
	normalCellCharacter: '.',
	transformCoordinates: ([x, y]) => [x, y],
	groups: false
}

const readCoordinateGrid = (gridString, opt = {}) => {
	// validate user input
	const options = merge({}, defaults, opt)
	if (!isValidCellCharacter(options.axisCellCharacter)) throw new Error(`invalid opt.axisCellCharacter: must be a single, non-whitespace character`)
	if (!isValidCellCharacter(options.normalCellCharacter)) throw new Error(`invalid opt.normalCellCharacter: must be a single, non-whitespace character`)
	if (options.axisCellCharacter === options.normalCellCharacter) throw new Error(`opt.axisCellCharacter and opt.normalCellCharacter cannot be identical`)
	if (!isFunction(options.transformCoordinates)) throw new Error(`invalid opt.transformCoordinates: must be a function`)
	if (typeof options.groups !== 'boolean') throw new Error(`invalid opt.groups: must be a boolean`)

	const rows = splitLines(trim(gridString))
		.map(removeWhitespace)
		.map(getCharacters)

	if (rows.length === 0) throw new Error(`invalid grid: must have at least one row`)
	if (rows[0].length === 0) throw new Error(`invalid grid: must have at least one column`)
	if (!rows.every(row => row.length === rows[0].length)) throw new Error(`invalid grid: all rows must have the same length`)

	const xAxisRowIndices = range(rows.length).filter(index => rows[index].filter(character => character === options.axisCellCharacter).length >= 2)
	if (xAxisRowIndices.length !== 1) throw new Error(`invalid grid: must have exactly one x-axis`)
	const [xAxisRowIndex] = xAxisRowIndices

	const yAxisColumnIndices = range(rows[0].length).filter(index => rows.filter(row => row[index] === options.axisCellCharacter).length >= 2)
	if (yAxisColumnIndices.length !== 1) throw new Error(`invalid grid: must have exactly one y-axis`)
	const [yAxisColumnIndex] = yAxisColumnIndices

	const grid = flatMap(range(rows.length), yIndex => range(rows[0].length).map(xIndex => [xIndex, yIndex]))
	return reduce(grid, (sum, [xIndex, yIndex]) => {
		const character = rows[yIndex][xIndex]
		const isOnAxis = (yIndex === xAxisRowIndex) || (xIndex === yAxisColumnIndex)
		if (isOnAxis && character === options.normalCellCharacter) throw new Error('invalid grid: normal cell character found on axis')

		if ([options.normalCellCharacter, options.axisCellCharacter].includes(character)) return sum
		const x = xIndex - yAxisColumnIndex
		const y = xAxisRowIndex - yIndex

		if (options.groups) {
			if (!sum[character]) sum[character] = new Set()
			sum[character].add(options.transformCoordinates([x, y]))
		} else {
			if (sum[character]) throw new Error('invalid grid: all characters must be unique')
			sum[character] = options.transformCoordinates([x, y])
		}
		return sum
	}, {})
}

module.exports = readCoordinateGrid
