"use client";
import { useSession } from "next-auth/react";
import { useEffect,useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Admin from "@/components/Admin";
import User from "@/components/User";
export default function Dashboard() {
  const { data: session, status } = useSession();
  console.log(session);
  const role = session?.user?.role;
  const router = useRouter();
  const toastShown = useRef(false);
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
}, []);

  if (status === "loading") {
    return <p>Loading....</p>;
  }
  if (!session) return <>
    <h1 className="text-4xl font-black">Welcome to Event Management Website</h1>
    <Link className="underline block mt-4" href={"/login"}>Please go to Login page if you are are registered</Link>
    <Link className="underline block mt-4" href={"/register"}>Or Register if you have not already</Link>
  </>;
  if(role==="admin"){
    return <Admin/>
  }
  else{
    return <User/>
  }
 
}
