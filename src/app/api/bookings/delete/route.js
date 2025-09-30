import db from "@/utils/db";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const collection = await db.collection("bookings");

    const result = await collection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    console.log("Hello",result)

    // ✅ Explicit 200 status
    return Response.json(
      { success: true},
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting booking:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
