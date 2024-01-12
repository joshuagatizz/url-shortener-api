const express = require("express")
const { MongoClient } = require("mongodb")
const router = express.Router()

const {
  MONGO_URI,
  MONGO_DB_NAME,
  MONGO_COLLECTION_NAME,
} = process.env
const db = new MongoClient(`${MONGO_URI}`)
  .db(`${MONGO_DB_NAME}`).collection(`${MONGO_COLLECTION_NAME}`)

class Response {
  constructor(status, data = [], errors = []) {
    this.status = status
    this.data = data
    this.errors = errors
  }
}

router.post("/", async (req, res) => {
  res.send({})
})

router.get("/:key", async (req, res) => {
  const key = req.params.key
  const linkObject = await db.findOne({ "key": key })
  if (linkObject && linkObject.redirect) {
    const r = linkObject.redirect
    if (r.startsWith("https") || r.startsWith("http")) {
      res.redirect(r)
    } else {
      res.redirect(`https://${r}`)
    }
  } else {
    res.status(404).json(new Response(404, [], ["the original url for this id is not found."]));
  }
})

module.exports = router