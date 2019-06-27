'use strict'

const tape = require('tape')

const readCoordinateGrid = require('.')

tape('ascii-art-coordinate-grid', t => {
	t.ok(readCoordinateGrid)
})
