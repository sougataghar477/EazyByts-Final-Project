import db from "@/utils/db";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body)
    let id =Object.keys(Object.fromEntries(req.nextUrl.searchParams))[0];
    console.log(id)
    if (!id) {
      return Response.json({ error: "Missing event ID" }, { status: 400 });
    }

    const collection = db.collection("events");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },   // filter
      { $set: body }               // update
    );

    return Response.json({ success: true, result });
  } catch (error) {
    console.error("Error updating event:", error);
    return Response.json({ error  }, { status: 500 });
  }
}
