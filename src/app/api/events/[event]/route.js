import db from "@/utils/db";
import { ObjectId } from "mongodb";

export async function GET(req) {
  // Extract ID from the URL
  
 const id = req.nextUrl.pathname.split('/').pop();
  const collection = db.collection("events");

  // Convert string ID to ObjectId
  const event = await collection.findOne({ _id: new ObjectId(id) });

  if (!event) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  // return Response.json({ ...event });
  return Response.json({...event})
}
