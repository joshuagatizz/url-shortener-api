const request = require("supertest")
const { MongoClient } = require("mongodb")
const app = require("../app")
const {describe, it, afterEach, expect} = require("@jest/globals")
const {MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION_NAME} = process.env
const db = new MongoClient(MONGO_URI).db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME)

const data = {
  "key":"test",
  "longUrl":"https://google.com"
}
const dataWithEmptyLongUrl = {
  "key":"test",
  "longUrl":""
}
const dbDataDuplicateKey = {
  "key":"test",
  "redirect":"https://facebook.com"
}

afterEach( done => {
  db.deleteMany({})
    .then(() => done())
})

describe("POST /api/shorten", () => {
  it("should successfully create a new shortened url",  () => {
    return request(app)
      .post("/api/shorten")
      .set("Content-Type", "application/json; charset=utf-8")
      .send(JSON.stringify(data))
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then(async response => {
        expect(response.body.status).toBe(200)

        const r = await db.find({}).toArray()
        expect(r.length).toBe(1)
        expect(r[0].key).toBe(data.key)
        expect(r[0].redirect).toBe(data.longUrl)
      })
  })

  it("should fail creating new shortened url due to duplicate data and an empty field", async () => {
    await db.insertOne(dbDataDuplicateKey)
    return request(app)
      .post("/api/shorten")
      .set("Content-Type", "application/json; charset=utf-8")
      .send(JSON.stringify(dataWithEmptyLongUrl))
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then(async response => {
        expect(response.body.status).toBe(400)
        expect(response.body.errors).toContainEqual("duplicate key")
        expect(response.body.errors).toContainEqual("there is an empty field")

        const r = await db.find({}).toArray()
        expect(r.length).toBe(1)
        expect(r[0].redirect).toBe(dbDataDuplicateKey.redirect)
      })
  })
})