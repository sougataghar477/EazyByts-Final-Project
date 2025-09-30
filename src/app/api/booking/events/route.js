import db from "@/utils/db";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const body = await req.json();
  let bookedEvents = [];  
  const bookingsCollection = await db.collection("bookings");
  const bookingsbyUser = await bookingsCollection
    .find({ user_id: body.user_id })
    .toArray();
  console.log(bookingsbyUser);  
  const eventsCollection = await db.collection("events");

  await Promise.all(
    bookingsbyUser.map(async (booking) => {
      const singleEvent = await eventsCollection.findOne({
        _id: new ObjectId(booking.event_id)
      });
      let bookedEvent= { ...singleEvent, ...booking };
      bookedEvents.push(bookedEvent);
    })
  );

  return Response.json(bookedEvents);
}
