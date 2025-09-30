"use client";
import { useSession } from "next-auth/react";
import { useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Event() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState({});
  const { data: session } = useSession();   
  const [isModalOpen,setModalOpen] = useState(false);
const handleSubmit = async (e) => {
  e.preventDefault();

  // Get the form data
  const formData = new FormData(e.target);

  // Convert to a plain object
  const data = {
  ...Object.fromEntries(formData.entries()),
  tickets: ~~(formData.get("tickets")), 
  phone: ~~(formData.get("phone")), 
  price: event.price,
  user_id: session.user.id,
  event_id: event._id,
};
  console.log("Booking form data:", data);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
 

    const result = await res.json();
    console.log("Booking response:", result);
    router.push(result.url)
  } catch (err) {
    console.error("Error submitting booking:", err);
    toast.error("Booking failed. Please try again.");
  }
};

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_URL + "/api/events/" + params.event)
      .then((r) => r.json())
      .then((d) => setEvent(d));
  }, [params]);

  console.log(params.event);

  return (
    <>
      {!session ? (
        <dialog open={isModalOpen} className="p-6 rounded-md shadow-2xl fixed top-1/2 left-1/2 -translate-1/2 w-80 md:w-96">
          <span onClick={() => setModalOpen(false)} className="cursor-pointer absolute flex items-center justify-center right-4 top-2 text-2xl w-8 h-8 rounded-full hover:bg-gray-100 transition">&times;</span>
          <p>You must be logged in</p>
        </dialog>
      ) : (
        <dialog open={isModalOpen} className="p-6 rounded-md shadow-2xl fixed top-1/2 left-1/2 -translate-1/2 w-80 md:w-96">
          <span onClick={() => setModalOpen(false)} className="cursor-pointer absolute flex items-center justify-center right-4 top-2 text-2xl w-8 h-8 rounded-full hover:bg-gray-100 transition">&times;</span>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            {/* Name */}
            <label className="flex flex-col">
              <span className="font-semibold">Name</span>
              <input
                type="text"
                name="name"
                className="border rounded-md px-3 py-2"
                required
              />
            </label>

            {/* Email */}
            <label className="flex flex-col">
              <span className="font-semibold">Email</span>
              <input
                type="email"
                name="email"
                className="border rounded-md px-3 py-2"
                required
              />
            </label>

            {/* Phone */}
            <label className="flex flex-col">
              <span className="font-semibold">Phone</span>
              <input
                type="tel"
                name="phone"
                className="border rounded-md px-3 py-2"
                placeholder="+91 98765 43210"
              />
            </label>

            {/* Number of Tickets */}
            <label className="flex flex-col">
              <span className="font-semibold">Number of Tickets</span>
              <input
                type="number"
                name="tickets"
                className="border rounded-md px-3 py-2"
                min="1"
                max="10"
                required
              />
            </label>

            {/* Special Requests */}
            <label className="flex flex-col">
              <span className="font-semibold">Special Requests</span>
              <textarea
                name="notes"
                className="border rounded-md px-3 py-2"
                rows="3"
              />
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="bg-black text-white py-2 rounded-md mt-2"
            >
              Book Ticket(s)
            </button>
          </form>
        </dialog>
      )}

      <h1 className="text-4xl mt-4">{event?.title}</h1>
      <p className="font-bold mt-4">
        Date: <time>{event.date}</time>
      </p>
      <p className="font-bold mt-4">
        Venue:{" "}
        <span>{Object.values(event?.location || {}).join(", ")}</span>
      </p>
      <p className="font-bold mt-4">
        Price:{" "}
        <span>${event?.price}</span>
      </p>
      <p className="font-bold mt-4">
        Seats:{" "}
        <span>{event?.availableSeats}</span>
      </p>
      <button onClick={()=> setModalOpen(true)} className="bg-black mt-4 w-40 py-2 text-white rounded-md">
        Book Ticket(s)
      </button>
      <img
        className="w-full rounded-lg mt-4"
        src="https://images.unsplash.com/photo-1464047736614-af63643285bf?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
    </>
  );
}
