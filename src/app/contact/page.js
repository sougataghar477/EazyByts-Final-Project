"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";

export default function Contact() {
  const [question, setQuestion] = useState(""); // renamed from email
  const [status, setStatus] = useState(""); // track current status (idle, sending, success, error)
  const [message, setMessage] = useState(""); // message to show user (feedback)
  const { data: session,status:isStatus } = useSession();
  console.log(session?.user);
  const isSending = status === "sending"; // helper to disable button when sending
  const router = useRouter();
  useEffect(()=>{
    if(isStatus==="unauthenticated" && session?.user?.role!=="user"){
        router.push("/login")
    }
  },[router,isStatus,session])
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    setMessage("");

    // check if question is empty
    if (!question.trim()) {
      setStatus("error");
      setMessage("Please enter your question.");
      return;
    }

    try {
      setStatus("sending");

      // send question to backend API
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question,email:session?.user.email }),
      });

      const data = await res.json();

      // if backend says success
      if (data.success !== false) {
        setStatus("success");
        setMessage(data.message);
        toast.success(data.message)
        setQuestion(""); // clear field
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err)
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="font-medium">Ask A Question</p>

      {/* input field for question */}
      <textarea
        name="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border w-full rounded-lg p-2 mt-2"
        placeholder="Type your question here..."
        required
      />

      {/* submit button */}
      <button
        className="block mt-4 rounded-lg cursor-pointer bg-green-700 px-4 py-2 text-white disabled:bg-green-400 disabled:cursor-auto"
        type="submit"
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send Question"}
      </button>

      {/* show message if exists */}
      {message && (
        <p
          className={`mt-3 ${
            status === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
