import { Suspense } from "react";
import SuccessPage from "@/components/SuccessPage";

export default function Success() {
  return (
    <Suspense fallback={<p>Loading confirmation...</p>}>
      <SuccessPage />
    </Suspense>
  );
}