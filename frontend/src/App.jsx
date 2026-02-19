import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import TeamTable from "./components/TeamTable";
import AddMemberModal from "./components/AddMemberModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import Dropdown from "./components/Dropdown";
import "./TeamManagement.css";

export default function App() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  
  // Filter State
  const [filterFunction, setFilterFunction] = useState("");
  const [filterRole, setFilterRole] = useState("");

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "" });

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

  // --- HANDLERS ---

  // Open "Add" Modal
  const openAddModal = () => {
    setMemberToEdit(null); // Clear edit data
    setIsFormModalOpen(true);
  };

  // Open "Edit" Modal (Triggered from Table)
  const openEditModal = (member) => {
    setMemberToEdit(member);
    setIsFormModalOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSaveMember = async (formData) => {
    try {
      let res;
      if (memberToEdit) {
        // UPDATE
        res = await fetch(`/api/team-members/${memberToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // CREATE
        res = await fetch("/api/team-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        setIsFormModalOpen(false);
        fetchMembers();
        showToast(memberToEdit ? "Member Updated" : "New Member Added");
      } else {
        const err = await res.json();
        alert(err.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving member", error);
    }
  };

  // Open "Delete" Modal (Triggered from Table)
  const confirmDelete = (id) => {
    const member = members.find(m => m.id === id);
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  // Handle Actual Delete
  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      const res = await fetch(`/api/team-members/${memberToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setIsDeleteModalOpen(false);
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
        
        <SearchBar value={query} onChange={setQuery} />

        <div className="page-header">
          <div>
            <h1>Your Team</h1>
            <p>Add new members, change roles or permissions, and view existing team members.</p>
          </div>
          <button className="btn-primary" onClick={openAddModal}>
            Add Member
          </button>
        </div>

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

        {/* Pass handlers to Table */}
        <TeamTable 
          members={members} 
          onDelete={confirmDelete} 
          onEdit={openEditModal} 
        />

      </div>

      {/* Reused Modal for Add & Edit */}
      <AddMemberModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        onSave={handleSaveMember} 
        memberToEdit={memberToEdit} 
        functionOptions={FUNCTION_OPTIONS}
        roleOptions={ROLE_OPTIONS}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMember}
        memberName={memberToDelete?.fullName}
      />

      {/* Notifications Toast */}
      <div className={`toast ${toast.show ? 'show' : ''}`} id="toast">
        <span id="toastMsg">{toast.message}</span>
        <button className="toast-close" onClick={() => setToast({ show: false, message: "" })}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F9FAFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}