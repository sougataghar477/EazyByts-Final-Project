"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const values = {
    category: ["Technology", "Music", "Business", "Art", "Sports"],
    location: ["USA", "India", "France", "Germany"],
  };

  // Update URL only when key and value are selected
  useEffect(() => {
    if (key && value) {
      router.push(`?${key}=${value}`);
    } else if (!key) {
      router.push("?");
    }
  }, [key, value, router]);

  const handleKeyChange = (e) => {
    setKey(e.target.value);
    setValue(""); // reset value when key changes
  };

  const handleValueChange = (e) => setValue(e.target.value);

  return (
    <>
      <select className="mb-4 mr-4 font-semibold" value={key} onChange={handleKeyChange}>
        <option value="">Filter by options below</option>
        <option value="category">Filter by Category</option>
        <option value="location">Filter by Location</option>
      </select>

      {key && (
        <select className="mb-4 font-semibold" value={value} onChange={handleValueChange}>
          <option value="">Select {key}</option>
          {values[key].map((v, i) => (
            <option key={i} value={v}>
              {v}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
