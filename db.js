import { MongoClient } from "mongodb"

const client = new MongoClient(
  "mongodb://root:root@localhost:27017/?authMechanism=DEFAULT",
)

let db

async function connectDb() {
  try {
    await client.connect()
    db = client.db("test")
  } catch (error) {
    throw error
  }
}

export function getDb() {
  if (!db) throw "connection failed"
  return db
}

export default connectDb
