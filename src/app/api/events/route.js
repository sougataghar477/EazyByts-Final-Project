import db from "@/utils/db";

export async function GET(req) {
  try {
    const url = req.nextUrl; // URL object
    const category = url.searchParams.get("category");
    const location = url.searchParams.get("location");
    const fromDashboard = parseInt(url.searchParams.get("fromDashboard"));
    const collection = db.collection("events");

    // ✅ case: filter by category + location
    if (category && location) {
      const events = await collection
        .find({ category, "location.country": location })
        .toArray();
      return Response.json({ events });
    }

    // ✅ case: filter by category only
    if (category) {
      const events = await collection.find({ category }).toArray();
      return Response.json({ events });
    }

    // ✅ case: filter by location only
    if (location) {
      const events = await collection
        .find({ "location.country": location })
        .toArray();
      return Response.json({ events });
    }

    // ✅ case: fromDashboard = 1 → only events within a week
    if (fromDashboard === 1) {
      const now = new Date();
      const oneWeekLater = new Date();
      oneWeekLater.setDate(now.getDate() + 7);

      const allEvents = await collection.find({}).toArray();

      const eventsWithinOneWeek = allEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= oneWeekLater;
      });

      return Response.json({ events: eventsWithinOneWeek });
    }

    // ✅ default: return all events
    const events = await collection.find({}).toArray();
    return Response.json({ events });

  } catch (error) {
    console.error(error);
    return Response.json(
      { events: [], error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
