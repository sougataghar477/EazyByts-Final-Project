"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export default function AdminEvent() {
  const { event: eventId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [event, setEvent] = useState();
  const [isAnyFieldChanged, setChange] = useState(false);

  //  Redirect if not logged in or not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else if (session.user.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  //  Fetch event
  useEffect(() => {
    if (!eventId) return;
    fetch(process.env.NEXT_PUBLIC_URL + "/api/events/" + eventId)
      .then((r) => r.json())
      .then((d) => setEvent(d));
  }, [eventId]);

  //  Generic change handler
  const handleChange = (e) => {
    setChange(true);
    const { name, value } = e.target;

    if (["venue", "city", "country"].includes(name)) {
      setEvent((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setEvent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const eventData = { ...event };
      delete eventData._id;

      const res = await fetch(
        process.env.NEXT_PUBLIC_URL + "/api/events/edit?" + eventId,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Event updated");
        setChange(false);
      } else {
        toast.error(data.error || "Failed to update event");
      }
    } catch (err) {
      toast.error("Error updating event: " + err.message);
    }
  };

  if (status === "loading" || !event) return <p>Loading...</p>;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Event Info</h1>
        <div className="md:grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={event?.title || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={event?.category || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={event?.date?.slice(0, 10) || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Available Seats</label>
            <input
              type="number"
              name="availableSeats"
              value={event?.availableSeats || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={event?.price || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Organizer</label>
            <input
              type="text"
              name="organizer"
              value={event?.organizer || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          {/* Location */}
          <fieldset className="border p-4 rounded-lg col-span-3 grid md:grid-cols-3 gap-4">
            <legend className="text-sm font-medium">Location</legend>

            <div className="mt-2">
              <label className="text-sm">Venue</label>
              <input
                type="text"
                name="venue"
                value={event?.location?.venue || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>

            <div className="mt-2">
              <label className="text-sm">City</label>
              <input
                type="text"
                name="city"
                value={event?.location?.city || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>

            <div className="mt-2">
              <label className="text-sm">Country</label>
              <input
                type="text"
                name="country"
                value={event?.location?.country || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1"
                required
              />
            </div>
          </fieldset>
        </div>

        <button
          className="mt-4 w-full disabled:opacity-50 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          disabled={!isAnyFieldChanged}
        >
          Edit Form
        </button>
      </form>
    </>
  );
}
