import db from "@/utils/db";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    // get event id from query params
    const id = Object.keys(Object.fromEntries(req.nextUrl.searchParams))[0];

    if (!id) {
      return Response.json({ error: "Missing event ID" }, { status: 400 });
    }

    const collection = db.collection("events");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    return Response.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting event:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
