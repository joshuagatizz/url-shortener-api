const dbConnection = require("./db")

const getRedirectByKey = async (key) => {
  const db = await dbConnection.getInstance()
  return await db.findOne({ "key": key })
}

const createNewRedirect = async (redirectLink) => {
  const db = await dbConnection.getInstance();
  return await db.insertOne(redirectLink)
}

module.exports = {
  getRedirectByKey,
  createNewRedirect
}