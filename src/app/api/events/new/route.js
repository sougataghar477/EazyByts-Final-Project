import db from "@/utils/db";

export async function POST(req) {
  try {
    const body = await req.json();

    // Basic validation (you can expand this)
    if (!body.title || !body.category || !body.date) {
      return Response.json(
        { error: "Missing required fields: title, category, or date" },
        { status: 400 }
      );
    }

    const collection = db.collection("events");

    const event = await collection.insertOne(body);

    return Response.json(
      {
        success: true,
        message: "Event created successfully",
        eventId: event?.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting event:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create event. Please try again later.",
      },
      { status: 500 }
    );
  }
}
