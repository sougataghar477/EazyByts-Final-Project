import db from "@/utils/db";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const body = await req.json(); // get the body from the DELETE request
    const { booking_id } = body;

    if (!booking_id) {
      return new Response(
        JSON.stringify({ message: "Missing booking_id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const collection = db.collection("bookings");

    // Find and delete the booking
    const result = await collection.findOneAndDelete({ _id: new ObjectId(booking_id) });

    return new Response(
      JSON.stringify({ ok: true, message: "Booking deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error deleting booking:", err);
    return new Response(
      JSON.stringify({ok:false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
