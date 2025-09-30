"use client";
import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function SuccessPage() {
  const [status, setStatus] = useState(""); // final message
  const [loading, setLoading] = useState(true); // loading flag
  const [isError, setIsError] = useState(false);
  const params = useSearchParams();
   
  const queryString = new URLSearchParams(params.entries()).toString();

  useEffect(() => {
    if (!queryString) return;

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/confirm?${queryString}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message || "Your booking has been successful");
          setStatus(data.message || "Your booking has been successful");
          setIsError(false);
        } else {
          toast.error(data.message || data.error || "Booking failed");
          setStatus(data.message || data.error || "Booking failed");
          setIsError(true);
        }
      })
      .catch(() => {
        toast.error("Error verifying payment")
        setStatus("Error verifying payment");
        setIsError(true);
      })
      .finally(() => setLoading(false));
  }, [queryString]);

  if (loading) return <div>
    <h1 className="text-4xl font-bold">Loading...</h1>
    <p>Checking payment...</p>
  </div>;

  return (
    <>
      {isError ? (
        <>
          <h1 className="text-4xl font-bold text-red-500">Error</h1>
          <p>{status}</p>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold">Success</h1>
          <p>{status}</p>
        </>
      )}
    </>
  );
}
