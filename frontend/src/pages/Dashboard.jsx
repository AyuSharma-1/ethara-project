import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createProject,
  getDashboardStats,
  getOverdueTasks,
  getProjects,
  deleteProject,
} from "../api";

import StatCard from "../components/dashboard/StatCard";
import ProjectGroup from "../components/dashboard/ProjectGroup";
import CreateProjectForm from "../components/dashboard/CreateProjectForm";
import TeamMemberStats from "../components/dashboard/TeamMemberStats";

const Dashboard = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const notify = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, projectsRes, overdueRes] = await Promise.all([
        getDashboardStats(token),
        getProjects(token),
        getOverdueTasks(token),
      ]);
      setStats(statsRes.stats);
      setProjects(projectsRes.projects);
      setOverdueTasks(overdueRes.overdueTasks || []);
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [token]);

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    try {
      await createProject(token, projectForm);
      setProjectForm({ name: "", description: "" });
      setShowCreateForm(false);
      await loadData();
      notify("Project created");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const handleDeleteProject = async (event, projectId) => {
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(token, projectId);
      await loadData();
      notify("Project deleted");
    } catch (error) {
      notify(error.message, "error");
    }
  };

  const myProjects = projects.filter((p) => p.creator?._id === user?.id);
  const assignedProjects = projects.filter((p) => p.creator?._id !== user?.id);

  const statItems = [
    { label: "Total Tasks", value: stats?.totalTasks ?? 0 },
    { label: "To Do", value: stats?.tasksByStatus?.["To Do"] ?? 0 },
    { label: "In Progress", value: stats?.tasksByStatus?.["In Progress"] ?? 0 },
    { label: "Overdue", value: overdueTasks.length, highlight: overdueTasks.length > 0 },
  ];

  return (
    <main className="flex flex-1 overflow-hidden">
      {/* ── Left Sidebar: Projects ── */}
      <section className="flex w-72 flex-col border-r border-zinc-200 bg-white">
        {/* Header with create button */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">Projects</p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-900">{projects.length} active</p>
          </div>
          <button
            onClick={() => setShowCreateForm((v) => !v)}
            className="flex h-7 w-7 items-center justify-center border border-zinc-300 text-lg leading-none text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
            title="New project"
          >
            +
          </button>
        </div>

        {/* Inline create form */}
        {showCreateForm && (
          <CreateProjectForm
            form={projectForm}
            onChange={setProjectForm}
            onSubmit={handleProjectSubmit}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Project lists split by role */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="px-5 py-4 text-sm text-zinc-400">Loading…</p>
          ) : projects.length === 0 ? (
            <p className="px-5 py-4 text-sm text-zinc-400">No projects yet.</p>
          ) : (
            <>
              <ProjectGroup
                label="My Projects"
                projects={myProjects}
                userId={user?.id}
                onDelete={handleDeleteProject}
              />
              <ProjectGroup
                label="Assigned to Me"
                projects={assignedProjects}
                userId={user?.id}
                onDelete={handleDeleteProject}
              />
            </>
          )}
        </div>
      </section>

      {/* ── Right Pane: Stats ── */}
      <section className="flex flex-1 flex-col overflow-hidden bg-zinc-50">
        {/* Welcome bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-4">
          <p className="text-sm font-semibold text-zinc-900">
            Welcome back, <span className="text-zinc-600">{user?.username || "there"}</span>
          </p>
          {message && (
            <span className={`border px-3 py-1 text-xs ${messageType === "error" ? "border-red-200 bg-red-50 text-red-600" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>
              {message}
            </span>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border-b border-zinc-200 shadow-sm">
          {statItems.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>

        {/* Tasks by team member */}
        <div className="flex-1 overflow-hidden px-8 py-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-400">
            Tasks by team member
          </p>
          <TeamMemberStats tasksByUser={stats?.tasksByUser} />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
