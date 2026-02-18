import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import TeamTable from "./components/TeamTable";
import AddMemberModal from "./components/AddMemberModal";
import Dropdown from "./components/Dropdown";
import "./TeamManagement.css";

export default function App() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  
  // Filter State
  const [filterFunction, setFilterFunction] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  // Dropdown Options
  const FUNCTION_OPTIONS = [
    { label: "Marketing & Sales", value: "MARKETING_SALES" },
    { label: "Product", value: "PRODUCT" },
    { label: "Engineering", value: "ENGINEERING" },
    { label: "IT", value: "IT" },
  ];

  const ROLE_OPTIONS = [
    { label: "Admin", value: "ADMIN" },
    { label: "Contributor", value: "CONTRIBUTOR" },
  ];

  // Fetch from Spring Boot
  const fetchMembers = async () => {
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (filterFunction) params.append("function", filterFunction);
      if (filterRole) params.append("role", filterRole);

      const res = await fetch(`/api/team-members?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch members", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, filterFunction, filterRole]);

  const handleAddMember = async (newMember) => {
    try {
      const res = await fetch("/api/team-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchMembers();
        showToast("Member Added");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member", error);
    }
  };

  const handleDeleteMember = async (id) => {
    if(!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      const res = await fetch(`/api/team-members/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMembers();
        showToast("Member Deleted");
      }
    } catch (error) {
      console.error("Error deleting member", error);
    }
  };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3200);
  };

  return (
    <div className="team-management-body">
      <div className="tm-container">
        
        {/* Search */}
        <SearchBar value={query} onChange={setQuery} />

        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Your Team</h1>
            <p>Add new members, change roles or permissions, and view existing team members.</p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            Add Member
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <Dropdown 
            variant="filter"
            placeholder="Function"
            options={FUNCTION_OPTIONS}
            value={filterFunction}
            onChange={setFilterFunction}
          />
          <Dropdown 
            variant="filter"
            placeholder="Role"
            options={ROLE_OPTIONS}
            value={filterRole}
            onChange={setFilterRole}
          />
        </div>

        {/* Table */}
        <TeamTable members={members} onDelete={handleDeleteMember} />

      </div>

      {/* Modal */}
      <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddMember}
        functionOptions={FUNCTION_OPTIONS}
        roleOptions={ROLE_OPTIONS}
      />

      {/* Toast Popup with Icon */}
      <div className={`toast ${toast.show ? 'show' : ''}`} id="toast">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#23C3AB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span id="toastMsg">{toast.message}</span>
        <button className="toast-close" onClick={() => setToast({ show: false, message: "" })}>✕</button>
      </div>
    </div>
  );
}