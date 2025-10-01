"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Register() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    fetch(process.env.NEXT_PUBLIC_URL + "/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Failed to register")
          throw new Error("Failed to register");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Registered:", data);
        toast.success("Registration successful!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Registration failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-6 rounded-lg shadow-2xl fixed top-1/2 left-1/2 -translate-1/2">
      <h1 className="text-4xl mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
<div className="flex flex-col">
  <label htmlFor="email" className="mb-1 font-bold italic">
    Email
  </label>
  <input
    id="email"
    name="email"
    type="email"
    placeholder="Enter your email"
    className="border p-2 rounded w-80"
    required
    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    title="Please enter a valid email address (e.g. user@example.com)"
  />
</div>

<div className="flex flex-col">
  <label htmlFor="password" className="mb-1 font-bold italic">
    Password
  </label>
  <input
    id="password"
    name="password"
    type="password"
    placeholder="Enter your password"
    className="border p-2 rounded w-80"
    required
    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
    title="Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
  />
</div>


        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <Link className="mt-4 block" href="/signup">
        New here? Sign Up
      </Link>
    </div>
  );
}
