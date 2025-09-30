// db.js
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URL);

await client.connect(); // top-level await is allowed in Node >= 14 with ESM

const db = client.db("events-database");

export default db;
