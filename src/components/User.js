"use client";
import { useSession } from "next-auth/react";
import { useEffect,useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
export default function Dashboard() {
  const { data: session, status } = useSession();
  console.log(session)
  const router = useRouter();
  const toastShown = useRef(false);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
useEffect(() => {
    if (sessionStorage.getItem("dashboardToastShown")) return;
    sessionStorage.setItem("dashboardToastShown", "true");
  const fetchEvents = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/events?fromDashboard=1");
      const data = await res.json();

      if (data?.events?.length > 0 && session?.user?.role==="user") {
        toast(
          () => (
            <Link href="/events/upcoming">
              Click to view upcoming Events within a week
            </Link>
          ),
          { autoClose: 5000 } // optional
        );
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  fetchEvents();
}, [session?.user?.role]);

  if (status === "loading") {
    return <p>Loading....</p>;
  }
  if (!session) return ;


  return (
    <>
      <h1 className="font-black text-4xl mb-4">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Link className="p-4 shadow rounded-lg font-bold" href={"/events"}>Events</Link>
        <Link className="p-4 shadow rounded-lg font-bold" href={"/events/upcoming"}>Upcoming Events(within 1 week)</Link>
        <Link className="p-4 shadow rounded-lg font-bold" href={"/events/booked"}>Booked Events</Link>
      </div>
    </>
  );
}
