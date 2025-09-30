import Stripe from "stripe";
import db from "@/utils/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const userId = req.nextUrl.searchParams.get("user_id");
  const eventId = req.nextUrl.searchParams.get("event_id");
  const tickets = parseInt(req.nextUrl.searchParams.get("tickets"));
  const totalPrice = parseInt(req.nextUrl.searchParams.get("total"));
  const updatedBookingFlag = parseInt(req.nextUrl.searchParams.get("updatedBookingFlag")); // 0 = new, 1 = update

  if (!sessionId || !userId || !eventId) {
    return new Response(
      JSON.stringify({
        error: "Missing required query parameters",
        message: "Please provide session_id, user_id, and event_id",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "payment_intent.charges"],
    });

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({
          error: "Payment not completed",
          message: "Your payment has not been completed yet.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const pi = session.payment_intent;
    const charge = pi?.charges?.data?.[0];

    // Prepare booking document
    const bookingData = {
      user_id: userId,
      event_id: eventId,
      tickets:tickets,
      price: (session.amount_total / 100)+~~totalPrice, // convert cents to dollars
      paymentIntentId: pi?.id,
      chargeId: charge?.id,
      balanceTxnId: charge?.balance_transaction,
      updatedAt: new Date(),
    };

    const collection = db.collection("bookings");
    let response;

    if (updatedBookingFlag === 1) {
      // Update existing booking
      const updateResult = await collection.updateOne(
        { user_id: userId, event_id: eventId },
        { $set: bookingData },
      );

      response = {
        ok: true,
        message: "Booking successfully updated in the database.",
        modifiedCount: updateResult.modifiedCount,
        upsertedId: updateResult.upsertedId || null,
      };
    } else {
      // Insert new booking
      bookingData.createdAt = new Date();
      const insertResult = await collection.insertOne(bookingData);
      response = {
        ok: true,
        message: "Booking successfully confirmed and stored in the database.",
        bookingId: insertResult.insertedId,
      };
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Stripe or DB error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Something went wrong while processing your booking.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
