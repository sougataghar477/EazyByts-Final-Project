"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function Success() {
  const [status, setStatus] = useState(""); // final message
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // useSearchParams must be called at the top level of a client component
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    // Convert to query string
    const queryString = new URLSearchParams(searchParams.entries()).toString();
    if (!queryString) return;

    const fetchConfirmation = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/confirm?${queryString}`);
        const data = await res.json();

        if (data.ok) {
          toast.success(data.message || "Your booking has been successful");
          setStatus(data.message || "Your booking has been successful");
          setIsError(false);
        } else {
          toast.error(data.message || data.error || "Booking failed");
          setStatus(data.message || data.error || "Booking failed");
          setIsError(true);
        }
      } catch (err) {
        toast.error("Error verifying payment");
        setStatus("Error verifying payment");
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmation();
  }, [searchParams]); // use the hook value as dependency

  if (loading)
    return (
      <div>
        <h1 className="text-4xl font-bold">Loading...</h1>
        <p>Checking payment...</p>
      </div>
    );

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
