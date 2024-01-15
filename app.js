const express = require('express')
const app = express()
const shortenRouter = require("./routes/shorten")
const redirectRouter = require("./routes/redirect")

app.use(express.json())

app.use("/", redirectRouter)
app.use("/api/shorten", shortenRouter)

app.listen(3000)