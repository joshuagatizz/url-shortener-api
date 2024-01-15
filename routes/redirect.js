const express = require("express")
const {redirectById} = require("../controller/redirectController")
const router = express.Router()

router.get("/:key", redirectById)

module.exports = router