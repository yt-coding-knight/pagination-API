import express from "express"
import connectDb, { getDb } from "./db.js"

const app = express()

function pagination(nameCollection) {
  return async (req, res, next) => {
    const limit = +req.query.limit
    const page = +req.query.page
    const result = {}

    const skip = (page - 1) * limit

    const db = getDb()
    const collection = db.collection(nameCollection)
    const count = await collection.estimatedDocumentCount()

    result.first = {
      page: 1,
      limit,
    }

    if (limit * page < count) {
      result.next = {
        page: page + 1,
        limit,
      }
    }

    if (page > 1) {
      result.prev = {
        page: page - 1,
        limit,
      }
    }

    result.last = {
      page: Math.ceil(count / limit),
      limit,
    }

    try {
      result.result = await collection.find().limit(limit).skip(skip).toArray()
      req.result = result
      next()
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
}

app.get("/products", pagination("products"), (req, res) => {
  const result = req.result

  res.status(200).json(result)
})

app.listen(3000, () => {
  console.log("server running")
  connectDb()
})
