const { MongoClient } = require("mongodb");
const {
  MONGO_URI,
  MONGO_DB_NAME,
  MONGO_COLLECTION_NAME,
} = process.env

async function addIndexes(col) {
  await col.createIndex({ key: 1 }, { unique: true });

  console.log("[DB] Indexes ensured");
}

function db() {
  let collection = null

  async function getInstance() {
    if (collection) return collection

    const client = new MongoClient(MONGO_URI)
    await client.connect()

    collection = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME)
    addIndexes(collection).catch(console.error)

    return collection
  }
  
  return getInstance
}

module.exports = db()