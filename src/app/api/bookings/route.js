import Stripe from "stripe";
import db from "@/utils/db";

export async function GET() {

  try {
 
    const collection = db.collection("bookings");
    const bookings = await collection.find().toArray();

    return new Response(
      JSON.stringify(bookings),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Stripe or DB error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: "Something went wrong while processing your booking." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
