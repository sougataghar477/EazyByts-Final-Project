"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPasswordVisible,setPasswordVisible] = useState(false);
  const router = useRouter();

  const validate = (email, password) => {
    const newErrors = {};

    // Email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address (e.g. user@example.com)";
    }

    // Password regex (at least 8 chars, upper, lower, number, special char)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ✅ true if valid
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!validate(email, password)) {
      setLoading(false);
      return;
    }

    fetch(process.env.NEXT_PUBLIC_URL + "/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Failed to register");
          throw new Error("Failed to register");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Registered:", data);
        toast.success("Registration successful!");
        e.target.reset();
        router.push("/login");
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
        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-bold italic">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            className={`border p-2 rounded w-80 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm w-80 mt-4">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 font-bold italic">
            Password
          </label>
          <div className="relative bg-amber-600">
          <input
            id="password"
            name="password"
            type={isPasswordVisible?"text":"password"}
            placeholder="Enter your password"
            className={`border p-2 rounded w-80 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          <span onClick={()=> setPasswordVisible(prev => !prev)} 
          className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 z-4">
            {isPasswordVisible?<FaRegEyeSlash />:<FaRegEye />}
          </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm w-80 mt-4">{errors.password}</p>}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <Link className="mt-4 block underline" href="/login">
        Already a member ? Login
      </Link>
    </div>
  );
}
