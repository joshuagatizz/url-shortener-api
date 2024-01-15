const db = require("../model/links");
const ShortenUrlResponse = require("../entity/shortenUrlResponse")
const RedirectLink = require("../entity/redirectLink")

const createNewShortenedLink = async (req, res) => {
  const {longUrl, key} = req.body
  const linkObject = await db.getRedirectById(key)
  if (linkObject) {
    res.status(400).json(new ShortenUrlResponse(400, [], ["duplicate key"]))
  } else {
    await db.createNewRedirect(new RedirectLink(key, longUrl))
    res.status(200).json(new ShortenUrlResponse(200))
  }
}

module.exports = {
  createNewShortenedLink
}