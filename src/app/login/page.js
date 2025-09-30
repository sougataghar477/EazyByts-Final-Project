"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔑 Watch for session updates
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [session, status, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
      setError("Invalid email or password");
      setLoading(false);
    }
    // ⚡️ no redirect here — we let useEffect handle it
  }

  return (
    <div className="p-6 rounded-lg shadow-2xl fixed top-1/2 left-1/2 -translate-1/2">
      <h1 className="text-4xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-80"
          required
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-80"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <Link className="mt-4 block" href={"/register"}>
        New here? Sign Up
      </Link>
    </div>
  );
}
