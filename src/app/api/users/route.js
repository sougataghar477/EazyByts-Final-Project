import db from "@/utils/db";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const collection =await db.collection("users");
  const users =await collection.find().toArray();

  return Response.json(users);
}
