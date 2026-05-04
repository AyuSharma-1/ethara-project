import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createTask,
  getProjectTasks,
  getProjectById,
  updateTaskStatus,
  addProjectMember,
  removeProjectMember,
  searchUsers,
  deleteProject,
  updateProject,
  deleteTask,
  updateTask,
} from "../api";

import CreateTaskForm from "../components/project/CreateTaskForm";
import MembersSection from "../components/project/MembersSection";
import TaskTable from "../components/project/TaskTable";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  // ── Data state ──
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  // ── UI state ──
  const [activePanel, setActivePanel] = useState("tasks"); // "tasks" | "create" | "members"
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectForm, setEditProjectForm] = useState({ name: "", description: "" });

  // ── Form state ──
  const [taskForm, setTaskForm] = useState({
    title: "", description: "", dueDate: "", priority: "medium", assignee: "",
  });
  const [memberForm, setMemberForm] = useState({
    email: "", searchResults: [], searching: false,
  });

  // ── Edit task state ──
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskForm, setEditTaskForm] = useState({
    title: "", description: "", dueDate: "", priority: "medium", assignee: "",
  });

  // ── Derived values ──
  const isAdmin = project && user && project.creator._id === user.id;

  const assigneeOptions = project
    ? [...(project.members || []), project.creator]
        .filter(Boolean)
        .reduce((unique, member) => {
          const key = member?._id?.toString?.();
          if (!unique.some((i) => i?._id?.toString?.() === key)) unique.push(member);
          return unique;
        }, [])
    : [];

  // ── Helpers ──
  const notify = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  // ── Data fetching ──
  const loadProject = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { project: currentProject } = await getProjectById(token, projectId);
      if (!currentProject) { navigate("/dashboard"); return; }
      setProject(currentProject);
      const { tasks: fetchedTasks } = await getProjectTasks(token, projectId);
      setTasks(fetchedTasks || []);
    } catch (error) {
      if (error.message.includes("Access denied") || error.message.includes("not a member")) {
        navigate("/dashboard");
      } else {
        notify(error.message, "error");
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, token, navigate]);

  useEffect(() => { loadProject(); }, [loadProject]);

  // ── Project handlers ──
  const handleDeleteProject = async () => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(token, projectId);
      navigate("/dashboard");
    } catch (error) { notify(error.message, "error"); }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await updateProject(token, projectId, editProjectForm);
      setIsEditingProject(false);
      await loadProject();
      notify("Project updated");
    } catch (error) { notify(error.message, "error"); }
  };

  // ── Task handlers ──
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask(token, projectId, {
        title: taskForm.title,
        description: taskForm.description,
        dueDate: taskForm.dueDate || undefined,
        priority: taskForm.priority,
        assignee: taskForm.assignee || undefined,
      });
      setTaskForm({ title: "", description: "", dueDate: "", priority: "medium", assignee: "" });
      await loadProject();
      notify("Task created");
      setActivePanel("tasks");
    } catch (error) { notify(error.message, "error"); }
  };

  const handleStatusChange = async (taskId, nextStatus) => {
    try { await updateTaskStatus(token, taskId, nextStatus); await loadProject(); }
    catch (error) { notify(error.message, "error"); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try { await deleteTask(token, taskId); await loadProject(); notify("Task deleted"); }
    catch (error) { notify(error.message, "error"); }
  };

  const handleSaveEditTask = async (e, taskId) => {
    e.preventDefault();
    try {
      await updateTask(token, taskId, editTaskForm);
      setEditingTaskId(null);
      await loadProject();
      notify("Task updated");
    } catch (error) { notify(error.message, "error"); }
  };

  const handleStartEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditTaskForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      priority: task.priority,
      assignee: task.assignee?._id || task.assignee || "",
    });
  };

  // ── Member handlers ──
  const handleAddMember = async (userId) => {
    try {
      await addProjectMember(token, projectId, userId);
      setMemberForm({ email: "", searchResults: [], searching: false });
      await loadProject();
      notify("Member added");
    } catch (error) { notify(error.message, "error"); }
  };

  const handleRemoveMember = async (userId) => {
    try { await removeProjectMember(token, projectId, userId); await loadProject(); notify("Member removed"); }
    catch (error) { notify(error.message, "error"); }
  };

  const handleSearchUsers = async (email) => {
    if (!email.trim()) { setMemberForm((p) => ({ ...p, searchResults: [] })); return; }
    setMemberForm((p) => ({ ...p, searching: true }));
    try {
      const { users } = await searchUsers(token, email);
      setMemberForm((p) => ({ ...p, searchResults: users, searching: false }));
    } catch { setMemberForm((p) => ({ ...p, searching: false })); }
  };

  // ── Loading screen ──
  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center overflow-hidden">
        <p className="text-sm text-zinc-400">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 overflow-hidden">
      {/* ── Left Sidebar ── */}
      <aside className="flex w-72 flex-col overflow-hidden border-r border-zinc-200 bg-white">

        {/* Project name + edit/delete */}
        <div className="border-b border-zinc-200 px-5 py-4">
          {isEditingProject ? (
            <form onSubmit={handleUpdateProject} className="space-y-2">
              <input
                value={editProjectForm.name}
                onChange={(e) => setEditProjectForm({ ...editProjectForm, name: e.target.value })}
                className="w-full border border-zinc-300 bg-white px-2 py-1.5 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-900"
                required
              />
              <textarea
                value={editProjectForm.description}
                onChange={(e) => setEditProjectForm({ ...editProjectForm, description: e.target.value })}
                className="w-full resize-none border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-600 outline-none focus:border-zinc-900"
                rows={2}
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-zinc-900 px-2 py-1 text-xs font-semibold text-white hover:bg-zinc-700">Save</button>
                <button type="button" onClick={() => setIsEditingProject(false)} className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-900">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <Link to="/dashboard" className="mb-2 block text-xs text-zinc-400 hover:text-zinc-700">
                ← Back
              </Link>
              <p className="truncate font-bold text-zinc-900">{project?.name}</p>
              {project?.description && (
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{project.description}</p>
              )}
              {isAdmin && (
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => { setIsEditingProject(true); setEditProjectForm({ name: project.name, description: project.description || "" }); }}
                    className="text-xs text-zinc-400 underline hover:text-zinc-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="text-xs text-zinc-400 underline hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Members */}
        <MembersSection
          project={project}
          isAdmin={isAdmin}
          memberForm={memberForm}
          onMemberFormChange={setMemberForm}
          onSearchUsers={handleSearchUsers}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          activePanel={activePanel}
          onToggleManage={() => setActivePanel(activePanel === "members" ? "tasks" : "members")}
        />

        {/* Tab switcher — Tasks | New Task (admin only) */}
        <div className="flex border-b border-zinc-200">
          <button
            onClick={() => setActivePanel("tasks")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activePanel === "tasks" ? "bg-indigo-600 text-white shadow-inner" : "text-zinc-500 hover:bg-zinc-50 hover:text-indigo-600"}`}
          >
            Tasks
          </button>
          {isAdmin && (
            <button
              onClick={() => setActivePanel("create")}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activePanel === "create" ? "bg-indigo-600 text-white shadow-inner" : "text-zinc-500 hover:bg-zinc-50 hover:text-indigo-600"}`}
            >
              New Task
            </button>
          )}
        </div>

        {/* Create task form (admin only, when tab active) */}
        {activePanel === "create" && isAdmin && (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <CreateTaskForm
              form={taskForm}
              onChange={setTaskForm}
              onSubmit={handleCreateTask}
              assigneeOptions={assigneeOptions}
            />
          </div>
        )}

        {/* Task count */}
        {activePanel === "tasks" && (
          <div className="flex-shrink-0 px-5 py-3">
            <p className="text-xs text-zinc-400">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
            </p>
          </div>
        )}
      </aside>

      {/* ── Main task area ── */}
      <section className="flex flex-1 flex-col overflow-hidden bg-zinc-50">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
          <p className="text-sm font-semibold text-zinc-900">{project?.name}</p>
          {message && (
            <span className={`border px-3 py-1 text-xs ${messageType === "error" ? "border-red-200 bg-red-50 text-red-600" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>
              {message}
            </span>
          )}
        </div>

        {/* Task table */}
        <div className="flex-1 overflow-y-auto">
          <TaskTable
            tasks={tasks}
            isAdmin={isAdmin}
            currentUserId={user?.id}
            editingTaskId={editingTaskId}
            editTaskForm={editTaskForm}
            onEditFormChange={setEditTaskForm}
            onSaveEdit={handleSaveEditTask}
            onCancelEdit={() => setEditingTaskId(null)}
            onStartEdit={handleStartEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            assigneeOptions={assigneeOptions}
          />
        </div>
      </section>
    </main>
  );
};

export default ProjectDetail;
