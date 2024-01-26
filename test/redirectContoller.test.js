const request = require("supertest")
const { MongoClient } = require("mongodb")
const app = require("../app")
const {describe, it, beforeAll, afterAll, expect} = require("@jest/globals")
const {MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION_NAME} = process.env
const db = new MongoClient(MONGO_URI).db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME)

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

beforeAll(done => {
  db.insertMany([dbDataWithHttps, dbDataWithoutHttps])
    .then(() => done())
})

afterAll(done => {
  db.deleteMany({})
    .then(() => done())
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