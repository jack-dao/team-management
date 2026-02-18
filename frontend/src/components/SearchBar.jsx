import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-[480px]">
      <div className="flex items-center border-[1.5px] border-[#7F818F] rounded-[40px] py-[16px] pl-[25px] pr-[20px] gap-[12px] bg-transparent">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by Name or Email Address"
          className="flex-1 bg-transparent border-0 p-0 m-0 appearance-none outline-none focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none text-[14px] text-[#040820] placeholder:text-[#7F818F] placeholder:font-bold"
        />
        <Search className="shrink-0" size={18} strokeWidth={2} color="#7F818F" />
      </div>
    </div>
  );
}
