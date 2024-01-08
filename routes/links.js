const express = require("express")
const router = express.Router()

router.post("/", (req, res) => {
  res.send({})
})

router.get("/:key", (req, res) => {
  res.send(req.params.key)
})

module.exports = router