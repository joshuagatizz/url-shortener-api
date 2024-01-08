const express = require('express')
const app = express()
const linkRouter = require("./routes/links")

app.use("/api/link", linkRouter)

app.listen(3000)