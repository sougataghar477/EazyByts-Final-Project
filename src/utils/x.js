import db from "./db.js";
import fs from "fs";
async function run() {
  const collection = db.collection("events");

  const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

  // If data.json contains an array
  await collection.insertMany(data);

  console.log("Data inserted!");
  await client.close();
}

run().catch(console.error);
