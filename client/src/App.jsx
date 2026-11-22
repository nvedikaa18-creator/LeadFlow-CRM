
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Target,
  Settings,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/leads";

const emptyLead = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Website",
  status: "New",
};

function App() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [form, setForm] = useState(emptyLead);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchLeads() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}?search=${encodeURIComponent(search)}&status=${encodeURIComponent(filter)}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch leads.");
      }

      const data = await response.json();
      setLeads(data);
      setError("");
    } catch (err) {
      setError("Cannot connect to server. Please check your backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [search, filter]);

  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;
  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;
  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  function openAddModal() {
    setEditingLead(null);
    setForm({ ...emptyLead });
    setModalOpen(true);
  }

  function openEditModal(lead) {
    setEditingLead(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      status: lead.status,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingLead(null);
    setForm({ ...emptyLead });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingLead ? `${API}/${editingLead._id}` : API;
      const method = editingLead ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save lead.");
      }

      closeModal();
      await fetchLeads();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lead.");
      }

      await fetchLeads();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusChange(id, status) {
    const lead = leads.find((item) => item._id === id);
    if (!lead) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...lead, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status.");
      }

      await fetchLeads();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Target size={22} />
          </div>
          <span>LeadFlow</span>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <a className="nav-item active" href="#">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>

          <a className="nav-item" href="#leads">
            <Users size={18} />
            <span>Leads</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <a className="nav-item" href="#">
            <Settings size={18} />
            <span>Settings</span>
          </a>

          <div className="profile">
            <div className="profile-avatar">V</div>
            <div className="profile-info">
              <strong>Vedika</strong>
              <span>Workspace Admin</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Dashboard
          </div>

          <div className="topbar-actions">
            <button className="icon-button">
              <Search size={18} />
            </button>

            <button className="icon-button notification-button">
              <Bell size={18} />
            </button>

            <div className="topbar-avatar">V</div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="page-heading">
            <div>
              <p className="greeting">YOUR OVERVIEW</p>
              <h1>Dashboard</h1>
              <p className="page-description">
                Track your leads and stay on top of your pipeline.
              </p>
            </div>

            <button className="add-lead-button" onClick={openAddModal}>
              <Plus size={18} />
              Add Lead
            </button>
          </div>

          <div className="welcome-panel">
            <div>
              <span className="welcome-tag">LEAD MANAGEMENT</span>
              <h2>Good things start with a connection.</h2>
              <p>
                Keep your prospects organized, build relationships, and turn
                opportunities into customers.
              </p>
            </div>

            <div className="welcome-graphic">
              <div className="graphic-circle circle-one"></div>
              <div className="graphic-circle circle-two"></div>
              <div className="graphic-target">
                <Target size={58} strokeWidth={1.3} />
              </div>
            </div>
          </div>

          <div className="section-heading">
            <h2>Overview</h2>
            <span>All leads</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Leads</div>
              <div className="stat-number">{totalLeads}</div>
              <div className="stat-note">All prospects</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">New Leads</div>
              <div className="stat-number">{newLeads}</div>
              <div className="stat-note">Recently added</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Qualified</div>
              <div className="stat-number">{qualifiedLeads}</div>
              <div className="stat-note">Potential customers</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Contacted</div>
              <div className="stat-number">{contactedLeads}</div>
              <div className="stat-note">Reached out</div>
            </div>
          </div>

          <div className="leads-section" id="leads">
            <div className="leads-header">
              <div>
                <h2>Recent Leads</h2>
                <p>Manage and track your prospects.</p>
              </div>

              <button className="view-all-button" onClick={fetchLeads}>
                Refresh
              </button>
            </div>

            <div className="lead-toolbar">
              <div className="lead-search">
                <Search size={16} />
                <input
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="status-filter"
              >
                <option value="All">All statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="table-placeholder">Loading leads...</div>
            ) : leads.length === 0 ? (
              <div className="table-placeholder">
                <Users size={22} />
                <p>No leads found.</p>
                <button className="add-lead-button" onClick={openAddModal}>
                  <Plus size={16} />
                  Add your first lead
                </button>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Email</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead._id}>
                        <td>
                          <strong>{lead.name}</strong>
                        </td>
                        <td>{lead.company}</td>
                        <td>{lead.email}</td>
                        <td>{lead.source}</td>
                        <td>
                          <select
                            className={`status-select status-${lead.status.toLowerCase()}`}
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead._id, e.target.value)
                            }
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-button"
                              title="Edit"
                              onClick={() => openEditModal(lead)}
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              className="action-button delete-button"
                              title="Delete"
                              onClick={() => handleDelete(lead._id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="lead-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLead ? "Edit Lead" : "Add New Lead"}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="lead-form">
              <label>
                Full Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </label>

              <label>
                Phone
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </label>

              <label>
                Company
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />
              </label>

              <label>
                Source
                <select
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                >
                  <option>Website</option>
                  <option>LinkedIn</option>
                  <option>Referral</option>
                  <option>Instagram</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Lost</option>
                </select>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="add-lead-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingLead
                    ? "Save Changes"
                    : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
