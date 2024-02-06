const { MongoClient } = require("mongodb");
const {
  MONGO_URI,
  MONGO_DB_NAME,
  MONGO_COLLECTION_NAME,
} = process.env

function db() {
  let db = null;

  async function dbConnect() {
    const _db = new MongoClient(MONGO_URI)
    try {
      await _db.connect()
      return _db.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME)
    } catch (e) {
      return e;
    }
  }

  async function getInstance() {
    try {
      if (db != null) {
        return db;
      } else {
        db = await dbConnect();
        return db;
      }
    } catch (e) {
      return e;
    }
  }

  return getInstance
}

module.exports = db()