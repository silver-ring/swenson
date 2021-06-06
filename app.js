const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cros = require('cors')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cros())

const productsRouter = require('./routes/products')
app.use('/products', productsRouter)

module.exports = app
