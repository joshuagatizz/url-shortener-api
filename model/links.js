const { MongoClient } = require("mongodb");
const {
  MONGO_URI,
  MONGO_DB_NAME,
  MONGO_COLLECTION_NAME,
} = process.env

const createDbConnection = async () => {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    return client.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

const getRedirectById = async (key) => {
  const db = await createDbConnection();
  return await db.findOne({ "key": key })
}

const createNewRedirect = async (redirectLink) => {
  const db = await createDbConnection();
  return await db.insertOne(redirectLink)
}

module.exports = {
  getRedirectById,
  createNewRedirect
}