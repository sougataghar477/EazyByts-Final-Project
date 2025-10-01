
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPasswordVisible,setPasswordVisible] = useState(false);
  //  Watch for session updates
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
    setLoading(false)
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
  if(loading){
    return <p>Loading...</p>
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
        <div className="relative">
        <input
          id="password"
          name="password"
          type={isPasswordVisible?"text":"password"}
          placeholder="Password"
          className="border p-2 rounded w-80"
          required
        />
        <span onClick={()=> setPasswordVisible(prev => !prev)} 
        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 z-4">
            {isPasswordVisible?<FaRegEyeSlash />:<FaRegEye />}
        </span>

        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <Link className="mt-4 block underline" href={"/register"}>
        New here? Sign Up
      </Link>
    </div>
  );
}
