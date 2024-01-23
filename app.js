const express = require('express')
const cors = require('cors')
const app = express()
const shortenRouter = require("./routes/shorten")
const redirectRouter = require("./routes/redirect")

app.use(express.json())
app.use(cors())

app.use("/", redirectRouter)
app.use("/api/shorten", shortenRouter)

module.exports = app