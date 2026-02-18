import { useState } from "react";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [q, setQ] = useState("");

  return (
    <div className="min-h-screen bg-white p-10">
      <SearchBar value={q} onChange={setQ} />
      <div className="mt-6 text-[14px] text-[#040820]">q is {q}</div>
    </div>
  );
}
