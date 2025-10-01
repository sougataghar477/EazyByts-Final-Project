"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const path = usePathname();
  const underline = "underline underline-offset-4 decoration-4";
  console.log(path);
  return (
    <nav className="flex gap-4 font-black italic shadow mb-8 p-4 rounded-lg">
        <Link className={`${path==="/"?underline:""}`} href="/">Home</Link>
      {status === "authenticated" && session?.user?.role === "user" && (
        <>
          <span 
            onClick={() => signOut()} 
            className="cursor-pointer"
          >
            Log out
          </span>
          <Link className={`${path==="/contact"?underline:""}`} href={"/contact"}>Contact</Link>
          <Link className={`${path==="/docs"?underline:""}`} href={"/docs"}>Documentation</Link>
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
          <Link className={`${path==="/login"?underline:""}`} href="/login">Login</Link>
          <Link className={`${path==="/register"?underline:""}`} href="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
