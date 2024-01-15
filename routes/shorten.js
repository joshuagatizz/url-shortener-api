const express = require("express")
const router = express.Router()
const {createNewShortenedLink} = require("../controller/shortenController");

router.post("/", createNewShortenedLink)

module.exports = router