import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Checkout body:", body);

    // Stripe expects an array of line items
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name:body.name,
          },
          unit_amount: body.price * 100, // Convert to cents
        },
        quantity: body.tickets,
      },
    ];

    // Create checkout session
    const successParams = new URLSearchParams({
      user_id: body.user_id,
      event_id: body.event_id,
      tickets: body.tickets,
      updatedBookingFlag:0
    }).toString();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}&${successParams}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });
    // Respond with the session ID
    return new Response(JSON.stringify({ url: session.url}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
