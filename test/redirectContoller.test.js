const request = require("supertest")
const { MongoClient } = require("mongodb")
const app = require("../app")
const {describe, it, beforeAll, afterAll, expect} = require("@jest/globals")
const {response} = require("express");
const {MONGO_URI, MONGO_DB_NAME, MONGO_COLLECTION_NAME} = process.env
const db = new MongoClient(MONGO_URI).db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME)
const fs = require("fs")

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
    it("should successfully redirect to the correct url", () => {
      return request(app)
        .get("/" + key1)
        .expect(302)
        .expect("Location", dbDataWithHttps.redirect)
    })
  })
  describe("redirect url without https", () => {
    it("should successfully redirect to the correct url", () => {
      return request(app)
        .get("/" + key2)
        .expect(302)
        .expect("Location", "https://" + dbDataWithoutHttps.redirect)
    })
  })

  it("should redirect to the not found page due to invalid key", () => {
    return request(app)
      .get("/" + "random-key")
      .expect(404)
      .then(response => {
        const expectedHTML = fs.readFileSync("./public/notFound.html", "utf-8")
        expect(response.text).toEqual(expectedHTML)
      })
  })
})