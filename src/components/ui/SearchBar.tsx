"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search Bets...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="px-6">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B3B3B3]"
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="
            w-full h-10 pl-10 pr-4
            bg-[#2B2B2F] rounded-[6px]
            text-[12px] text-white placeholder:text-[#B3B3B3]
            border-none outline-none
            focus:ring-1 focus:ring-sb-orange/50
          "
        />
      </div>
    </div>
  );
}
