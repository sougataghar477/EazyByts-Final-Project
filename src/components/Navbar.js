"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex gap-4 font-black italic shadow mb-8 p-4 rounded-lg">
        <Link href="/">Home</Link>
      {status === "authenticated" && session?.user?.role === "user" && (
        <>
          <span 
            onClick={() => signOut()} 
            className="cursor-pointer"
          >
            Log out
          </span>
          <Link href={"/contact"}>Contact</Link>
          <Link href={"/docs"}>Documentation</Link>
        </>
      )}
 

      {status === "authenticated" && session?.user?.role === "admin" && (
        <span 
          onClick={() => signOut()} 
          className="cursor-pointer"
        >
          Log out
        </span>
      )}

      {status === "unauthenticated" && (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
