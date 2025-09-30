import db from "@/utils/db";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    console.log("id",id)
    if (!id) {
      return Response.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const collection = await db.collection("bookings");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: body }, // ✅ update with whatever fields are sent
      { returnDocument: "after" } // returns updated doc
    );

    return Response.json(
      { success: true, booking: result },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating booking:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
