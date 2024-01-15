const express = require("express")
const {redirectByKey} = require("../controller/redirectController")
const router = express.Router()

router.get("/:key", redirectByKey)

module.exports = router