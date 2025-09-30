"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function NewEvent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if user not logged in OR not an admin
  useEffect(() => {
    if (status === "loading") return; // wait until session is fetched

    if (!session || session.user.role !== "admin") {
      router.replace("/"); // redirect to home (or /login)
    }
  }, [session, status, router]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const newEvent = {
      title: formData.get("title"),
      category: formData.get("category"),
      date: formData.get("date"),
      availableSeats: Number(formData.get("availableSeats")),
      price: Number(formData.get("price")),
      organizer: formData.get("organizer"),
      location: {
        venue: formData.get("venue"),
        city: formData.get("city"),
        country: formData.get("country"),
      },
    };

    fetch(process.env.NEXT_PUBLIC_URL + "/api/events/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((r) => r.json())
      .then((d) => toast.success(d.message))
      .catch((err) => toast.error(err?.message|| "Error"));
  };

  // Show loading state until we know the session
  if (status === "loading") {
    return <p>Checking permissions...</p>;
  }

  // If user is not admin, don’t render the form (will redirect anyway)
  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white shadow-lg rounded-2xl space-y-6"
    >
      <h2 className="text-xl font-bold">Create New Event</h2>

      {/* Main fields in 3-column grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Available Seats */}
        <div>
          <label className="block text-sm font-medium">Available Seats</label>
          <input
            type="number"
            name="availableSeats"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium">Price ($)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Organizer */}
        <div>
          <label className="block text-sm font-medium">Organizer</label>
          <input
            type="text"
            name="organizer"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>
      </div>

      {/* Location (full width, then 3-col grid inside) */}
      <fieldset className="border p-4 rounded-lg">
        <legend className="text-sm font-medium">Location</legend>

        <div className="grid md:grid-cols-3 gap-4 mt-2">
          <div>
            <label className="block text-sm">Venue</label>
            <input
              type="text"
              name="venue"
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm">City</label>
            <input
              type="text"
              name="city"
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm">Country</label>
            <input
              type="text"
              name="country"
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>
        </div>
      </fieldset>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Create Event
      </button>
    </form>
  );
}
