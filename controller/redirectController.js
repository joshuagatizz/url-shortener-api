const db = require("../model/links");
const Response = require("../entity/response")
const redirectByKey = async (req, res) => {
  const linkObject = await db.getRedirectByKey(req.params.key)

  if (linkObject && linkObject.redirect) {
    let r = linkObject.redirect
    if (!r.startsWith("http")) {
      r = `https://${r}`
    }
    res.status(200).json(new Response(200, {"longUrl": r}))
  } else {
    res.status(404).json(new Response(404, [], ["long url not found"]))
  }
}

module.exports = {
  redirectByKey
}