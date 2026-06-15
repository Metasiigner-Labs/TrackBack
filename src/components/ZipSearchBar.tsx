"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface ZipSearchBarProps {
  defaultValue?: string;
  size?: "default" | "large";
}

export default function ZipSearchBar({
  defaultValue = "",
  size = "default",
}: ZipSearchBarProps) {
  const router = useRouter();
  const [zip, setZip] = useState(defaultValue);
  const isLarge = size === "large";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = zip.trim();
    if (trimmed.length >= 5) {
      router.push(`/find?zip=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex flex-col gap-3 sm:flex-row ${
          isLarge ? "sm:gap-4" : "sm:gap-2"
        }`}
      >
        <label htmlFor="zip-search" className="sr-only">
          Zip code
        </label>
        <input
          id="zip-search"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{5}"
          maxLength={5}
          placeholder="Enter your zip code"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          className={`flex-1 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
            isLarge ? "px-5 py-4 text-lg" : "px-4 py-3 text-base"
          }`}
        />
        <button
          type="submit"
          disabled={zip.length < 5}
          className={`rounded-lg bg-gradient-to-r from-red-600 to-blue-600 font-semibold text-white transition hover:from-red-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-40 ${
            isLarge ? "px-8 py-4 text-lg" : "px-6 py-3 text-base"
          }`}
        >
          Find Your Representatives
        </button>
      </div>
    </form>
  );
}