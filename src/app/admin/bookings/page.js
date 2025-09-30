"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Bookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ tickets: "", price: "" });
  const [isOpen, setIsOpen] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (status === "loading") return; // still checking session
    if (!session?.user) {
      router.push("/login"); // not logged in
    } else if (session.user.role !== "admin") {
      router.push("/"); // logged in but not admin
    }
  }, [session, status, router]);

  // Fetch bookings
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    }
    if (session?.user?.role === "admin") {
      fetchBookings();
    }
  }, [session]);

  // Delete booking
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_URL + "/api/bookings/delete?id=" + id,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data.success) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        toast.success("Booking deleted successfully");
      } else {
        toast.error("Failed to delete booking");
      }
    } catch (err) {
      toast.error("Error deleting booking");
    }
  };

  // Open edit modal
  const openEdit = (booking) => {
    setEditing(booking);
    setForm({ tickets: booking.tickets, price: booking.price });
    setIsOpen(true);
  };

  // Save edit
  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_URL + "/api/bookings/update?id=" + editing._id,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === editing._id ? { ...b, ...form } : b))
        );
        setIsOpen(false);
        setEditing(null);
        toast.success("Booking updated successfully");
      } else {
        toast.error(data.error || "Failed to update booking");
      }
    } catch (err) {
      console.error("Error updating booking:", err);
      toast.error("Error updating booking");
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1 className="text-4xl mb-4 font-black">
        <Link href={"/"}>Admin</Link>
        <>{"> Bookings" }</>
      </h1>
      {bookings.map((booking) => (
        <div
          key={booking?._id}
          className="shadow rounded-xl p-4 flex justify-between items-center mb-2"
        >
          <div>
            <p>
              <span className="font-bold">Booking ID:</span> {booking?._id}
            </p>
            <p>
              <span className="font-bold">User ID:</span> {booking?.user_id}
            </p>
            <p>
              <span className="font-bold">Event ID:</span> {booking?.event_id}
            </p>
            <p>
              <span className="font-bold">Created At:</span>{" "}
              {new Date(booking?.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-bold">Price:</span> {booking?.price}
            </p>
            <p>
              <span className="font-bold">Tickets:</span> {booking?.tickets}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => openEdit(booking)}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(booking._id)}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Edit Dialog */}
      {isOpen && (
        <dialog
          open
          className="rounded-lg p-6 w-96 fixed top-1/2 left-1/2 -translate-1/2 shadow"
        >
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Edit Booking</h2>

            <label>
              Tickets:
              <input
                type="number"
                value={form.tickets}
                onChange={(e) =>
                  setForm({ ...form, tickets: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
            </label>

            <label>
              Price:
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1 rounded border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}
