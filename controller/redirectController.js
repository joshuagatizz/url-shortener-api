const db = require("../model/links");
const path = require("path");
const redirectById = async (req, res) => {
  const linkObject = await db.getRedirectById(req.params.key)
  if (linkObject && linkObject.redirect) {
    const r = linkObject.redirect
    if (r.startsWith("https") || r.startsWith("http")) {
      res.redirect(r)
    } else {
      res.redirect(`https://${r}`)
    }
  } else {
    res.sendFile(path.join(__dirname, "..", "public", "notFound.html"))
  }
}

module.exports = {
  redirectById
}