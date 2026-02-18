import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import TeamTable from "./components/TeamTable";
import AddMemberModal from "./components/AddMemberModal";
import "./TeamManagement.css";

export default function App() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  // Fetch from Spring Boot
  const fetchMembers = async (search = "") => {
    try {
      const url = search 
        ? `/api/team-members?q=${search}` 
        : "/api/team-members";
      const res = await fetch(url);
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
      fetchMembers(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleAddMember = async (newMember) => {
    try {
      const res = await fetch("/api/team-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchMembers(query);
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
        fetchMembers(query);
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
          <button className="filter-btn">
            Function
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <button className="filter-btn">
            Role
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>

        {/* Table */}
        <TeamTable members={members} onDelete={handleDeleteMember} />

      </div>

      {/* Modal */}
      <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddMember} 
      />

      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''}`} id="toast">
        <span id="toastMsg">{toast.message}</span>
        <button className="toast-close" onClick={() => setToast({ show: false, message: "" })}>✕</button>
      </div>
    </div>
  );
}