"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait until session is loaded
    if (!session || session?.user?.role !== "admin") {
      router.push("/login"); // redirect to home (or /login)
    }
  }, [session, status, router]);

  return (
    <>
      <h1 className="text-4xl font-black mb-4">Admin</h1>
        <div className="grid grid-cols-3 gap-4">
            <Link className="shadow p-4 rounded-lg font-black" href={"/admin/bookings"}>Bookings</Link>
            <Link className="shadow p-4 rounded-lg font-black" href={"/admin/events"}>Events</Link>
            <Link className="shadow p-4 rounded-lg font-black" href={"/admin/users"}>Users</Link>
        </div>

    </>
  );
}
