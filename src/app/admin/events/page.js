"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export default function Events() {
  const [events, setEvents] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  //   Redirect if not logged in or not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else if (session.user.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  //   Fetch events
  useEffect(() => {
    if (!session || session.user.role !== "admin") return;

    fetch(process.env.NEXT_PUBLIC_URL + "/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data?.events || []);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <>
      <h1 className="text-4xl mb-4 font-black">
        <Link href={"/"}>Admin</Link>
        <>{"> Events" }</>
      </h1>
      <Link className="inline-block bg-sky-500 w-40 py-2 text-white rounded-md text-center" href={"/admin/events/new"}>Add New Event</Link>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {events.map((event) => (
          <EventCard key={event._id} setEvents={setEvents} event={event} />
        ))}
      </div>
    </>
  );
}
