const request = require("supertest")
const { MongoMemoryServer } = require("mongodb-memory-server")
const {describe, it, beforeAll, afterAll, expect, afterEach} = require("@jest/globals")

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

let app
let mongod

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGO_URI = mongod.getUri()
  process.env.MONGO_DB_NAME = "url_shortener_test"
  process.env.MONGO_COLLECTION_NAME = "links_test"
  app = require("../app")
})

afterEach( async () => {
  const db = await require("../model/db")();
  await db.deleteMany({});
})

afterAll(async () => {
  const db = await require("../model/db")();
  await db.deleteMany({});
  await mongod.stop();
})

describe("POST /api/shorten", () => {
  it("should successfully create a new shortened url", async () => {
    const db = await require("../model/db")();
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
    const db = await require("../model/db")();
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