import Stripe from "stripe";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const body = await req.json();

    // Prepare line items
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: body.name,
          },
          unit_amount: body.price * 100, // Convert to cents
        },
        quantity: body.tickets,
      },
    ];

    // Create success params for URL
    const successParams = new URLSearchParams({
      user_id: body.user_id,
      event_id: body.event_id,
      total:body.total,
      tickets:body.oldTickets+body.tickets,
      updatedBookingFlag:1
    }).toString();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}&${successParams}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Stripe checkout error:", error);

    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
