"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function BookedEvents() {
  const { data: session } = useSession();
  const [bookedEvents, setBookedEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    oldTickets: "",
    tickets: "",
  });

  const userId = session?.user?.id;

  // Fetch bookings
  useEffect(() => {
    if (!userId) return;

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/booking/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((r) => r.json())
      .then((d) => setBookedEvents(d));
  }, [userId]);

  // Open modal and populate form
  const openModal = (index) => {
    setSelectedIndex(index);
    const event = bookedEvents[index];
    setFormData({
      oldTickets: event.tickets || "",
      tickets: event.tickets || "",
    });
    setIsModalOpen(true);
  };

  // Handle input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle both update and delete
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedIndex === null) return;

    const action = e.nativeEvent.submitter.value; // "update" or "delete"
    const booking = bookedEvents[selectedIndex];

    if (action === "update") {
      const updatedTickets = ~~formData.tickets - ~~formData.oldTickets;
      const pricePerTicket = booking.price / booking.tickets;

      const res = await fetch("/api/booking/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: booking._id,
          name: booking.title,
          tickets: updatedTickets,
          oldTickets: formData.oldTickets,
          total: booking.price,
          price: pricePerTicket.toFixed(2),
          user_id: booking.user_id,
          event_id: booking.event_id,
        }),
      });

      const data = await res.json();
      if (data.url) router.push(data.url);

      // Update local state
      const updatedEvents = [...bookedEvents];
      updatedEvents[selectedIndex].tickets = formData.tickets;
      setBookedEvents(updatedEvents);
    }

    if (action === "delete") {
      if (!confirm("Are you sure you want to delete this booking?")) return;

      await fetch("/api/booking/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: booking._id }),
      }).then(r => r.json()
        .then(d =>{if(d.ok){
          toast.success(d.message)
        }
        else{
          toast.error(d.message)
        }
      })
    );

      // Remove from local state
      setBookedEvents((prev) => prev.filter((_, i) => i !== selectedIndex));
    }

    setIsModalOpen(false);
    setSelectedIndex(null);
  };

  return (
    <>
      <h1 className="font-black text-4xl mb-4">Booked Events</h1>
      <p>Click on a card to edit or delete a booking.</p>
      {bookedEvents.length > 0 ? (
        bookedEvents.map((event, index) => (
          <div
            key={event._id}
            className="shadow mt-4 rounded-2xl p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => openModal(index)}
          >
            <h1 className="text-4xl font-bold">{event.title}</h1>
            <p>
              <span className="font-bold">Category:</span> {event.category}
            </p>
            <p>
              <span className="font-bold">Date:</span>{" "}
              {event.date ? new Date(event.date).toLocaleString("en-US") : "N/A"}
            </p>
            <p>
              <span className="font-bold">Location:</span>{" "}
              {Object.values(event.location).join(",")}
            </p>
            <p>
              <span className="font-bold">Total:</span> ${event.price}
            </p>
            <p>
              <span className="font-bold">Tickets:</span> {event.tickets}
            </p>
          </div>
        ))
      ) : (
        <p>No Booked Events</p>
      )}

      {/* Modal */}
      {isModalOpen && (
         
          <div className="bg-white shadow p-6 rounded-2xl md:w-96 fixed top-1/2 left-1/2 -translate-1/2">
            <h2 className="text-2xl font-bold mb-4">Edit Booking</h2>
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="font-bold">Tickets</label>
                <input
                  type="number"
                  name="tickets"
                  min={formData.oldTickets}
                  value={formData.tickets}
                  onChange={handleFormChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  name="action"
                  value="delete"
                  className="px-4 py-2 rounded bg-red-500 text-white"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  name="action"
                  value="update"
                  className="px-4 py-2 rounded bg-blue-500 text-white"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        
      )}
    </>
  );
}
