const db = require("../model/links");
const Response = require("../entity/response")
const RedirectLink = require("../entity/redirectLink")

const createNewShortenedLink = async (req, res) => {
  const { longUrl, key } = req.body;
  const errors = [];
  if (!key || !longUrl) {
    errors.push("there is an empty field");
  }
  const linkObject = await db.getRedirectByKey(key);
  if (linkObject) {
    errors.push("duplicate key");
  }
  if (errors.length > 0) {
    res.status(400).json(new Response(400, [], errors));
  } else {
    await db.createNewRedirect(new RedirectLink(key, longUrl));
    res.status(200).json(new Response(200));
  }
}

module.exports = {
  createNewShortenedLink
}