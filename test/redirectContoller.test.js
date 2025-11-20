const request = require("supertest")
const { MongoMemoryServer } = require("mongodb-memory-server")
const {describe, it, beforeAll, afterAll, expect} = require("@jest/globals")

const dbDataWithHttps = {
  "key":"test",
  "redirect":"https://google.com"
}
const dbDataWithoutHttps = {
  "key":"test2",
  "redirect":"google.com"
}
const key1 = "test"
const key2 = "test2"

let app
let mongod

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGO_URI = mongod.getUri()
  process.env.MONGO_DB_NAME = "url_shortener_test"
  process.env.MONGO_COLLECTION_NAME = "links_test"
  app = require("../app")

  const db = await require("../model/db")();
  await db.insertMany([dbDataWithHttps, dbDataWithoutHttps])
})

afterAll(async () => {
  const db = await require("../model/db")();
  await db.deleteMany({});
  await mongod.stop();
})

describe("GET /:key", () => {
  describe("redirect url with https", () => {
    it("should successfully return the long url", () => {
      return request(app)
        .get("/api/redirect/" + key1)
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(async response => {
          expect(response.body.status).toBe(200)
          expect(response.body.data.longUrl).toBe(dbDataWithHttps.redirect)
        })
    })
  })
  describe("redirect url without https", () => {
    it("should successfully return the long url with added https", () => {
      return request(app)
        .get("/api/redirect/" + key2)
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(async response => {
          expect(response.body.status).toBe(200)
          expect(response.body.data.longUrl).toBe("https://" + dbDataWithoutHttps.redirect)
        })
    })
  })

  it("should redirect to the not found page due to invalid key", () => {
    return request(app)
      .get("/api/redirect/" + "random-key")
      .expect(404)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then(response => {
        expect(response.body.status).toBe(404)
        expect(response.body.errors).toContainEqual("long url not found")
      })
  })
})