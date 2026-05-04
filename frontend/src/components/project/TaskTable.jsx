const PRIORITY_COLORS = {
  low: "text-emerald-600 bg-emerald-50 border-emerald-100",
  medium: "text-amber-600 bg-amber-50 border-amber-100",
  high: "text-rose-600 bg-rose-50 border-rose-100",
};

const STATUS_STYLE = {
  Done: "bg-emerald-500 text-white border-emerald-500",
  "In Progress": "bg-indigo-500 text-white border-indigo-500",
  "To Do": "bg-zinc-100 text-zinc-600 border-zinc-200",
};

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-violet-500", "bg-sky-500",
  "bg-emerald-500", "bg-amber-500", "bg-rose-500",
];

const getAvatarColor = (id = "") => {
  if (!id) return AVATAR_COLORS[0];
  const strId = id.toString();
  const index = strId.charCodeAt(strId.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

/** Inline edit row — expands across all columns */
const TaskEditRow = ({ task, form, onChange, onSave, onCancel, assigneeOptions, canReassign }) => (
  <tr className="border-b border-indigo-100 bg-indigo-50/30">
    <td colSpan={6} className="px-4 py-4">
      <form onSubmit={(e) => onSave(e, task._id)} className="space-y-4 rounded-xl bg-white p-4 shadow-sm border border-indigo-100">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 items-end">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">Title</label>
            <input
              value={form.title}
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => onChange({ ...form, priority: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => onChange({ ...form, dueDate: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">Assignee</label>
            <select
              value={form.assignee}
              onChange={(e) => onChange({ ...form, assignee: e.target.value })}
              disabled={!canReassign}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 disabled:bg-zinc-50 disabled:text-zinc-400"
            >
              <option value="">Unassigned</option>
              {assigneeOptions.map((m) => (
                <option key={m._id ?? m} value={m._id ?? m}>
                  {m.username ?? m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            placeholder="Add details about this task..."
            rows={2}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 placeholder:text-zinc-400"
          />
        </div>
      </form>
    </td>
  </tr>
);

/** Normal (read-only) task row */
const TaskViewRow = ({ task, isAdmin, currentUserId, onStartEdit, onDelete, onStatusChange }) => {
  const isAssignee = task.assignee?._id === currentUserId || task.assignee === currentUserId;

  return (
  <tr className="group border-b border-zinc-100 bg-white transition-all hover:bg-indigo-50/40">
    {/* Title + description */}
    <td className="px-4 py-4">
      <p className="truncate text-base font-bold text-zinc-900 group-hover:text-indigo-900">{task.title}</p>
      {task.description && (
        <p className="mt-1 truncate text-sm text-zinc-500 leading-tight">{task.description}</p>
      )}
    </td>

    {/* Status badge */}
    <td className="px-4 py-4 text-center">
      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${STATUS_STYLE[task.status] || STATUS_STYLE["To Do"]}`}>
        {task.status}
      </span>
    </td>

    {/* Priority */}
    <td className="px-4 py-4 text-center">
      <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-bold uppercase tracking-tighter ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}>
        {task.priority}
      </span>
    </td>

    {/* Due date */}
    <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium text-zinc-500">
      {task.dueDate ? (
        <div className="flex items-center justify-center gap-1.5">
          <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      ) : <span className="text-zinc-300">No date</span>}
    </td>

    {/* Assignee */}
    <td className="whitespace-nowrap px-4 py-4">
      {task.assignee ? (
        <div className="flex items-center justify-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${getAvatarColor(task.assignee?._id)}`}>
            {task.assignee.username?.charAt(0) || "?"}
          </div>
          <span className="text-sm font-medium text-zinc-600 truncate max-w-[100px]">{task.assignee.username}</span>
        </div>
      ) : (
        <div className="flex justify-center">
          <span className="rounded-full bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-400 border border-zinc-100">Unassigned</span>
        </div>
      )}
    </td>

    {/* Actions */}
    <td className="px-4 py-4">
      <div className="flex items-center justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        {isAssignee && task.status === "To Do" && (
          <button
            onClick={() => onStatusChange(task._id, "In Progress")}
            className="whitespace-nowrap rounded-lg bg-white border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-600 shadow-sm transition hover:bg-indigo-600 hover:text-white"
          >
            Start
          </button>
        )}
        {isAssignee && task.status !== "Done" && (
          <button
            onClick={() => onStatusChange(task._id, "Done")}
            className="whitespace-nowrap rounded-lg bg-white border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-600 shadow-sm transition hover:bg-emerald-600 hover:text-white"
          >
            Done
          </button>
        )}
        {isAdmin && (
          <div className="flex gap-1 ml-1 border-l border-zinc-200 pl-2">
            <button
              onClick={() => onStartEdit(task)}
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-indigo-100 hover:text-indigo-600"
              title="Edit task"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-rose-100 hover:text-rose-600"
              title="Delete task"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </td>
  </tr>
  );
};

/** Full task table with sticky header */
const TaskTable = ({
  tasks,
  isAdmin,
  currentUserId,
  editingTaskId,
  editTaskForm,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onStatusChange,
  assigneeOptions,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-300">
             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
             </svg>
          </div>
          <p className="text-sm font-medium text-zinc-900">No tasks yet</p>
          <p className="text-xs text-zinc-400">Click "New Task" in the sidebar to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-zinc-50/80 backdrop-blur-sm">
          <tr className="border-b border-zinc-200">
            <th className="w-[35%] px-4 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-400">Task Details</th>
            <th className="w-[12%] px-4 py-4 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">Status</th>
            <th className="w-[10%] px-4 py-4 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">Priority</th>
            <th className="w-[14%] px-4 py-4 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">Due Date</th>
            <th className="w-[14%] px-4 py-4 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">Assignee</th>
            <th className="w-[15%] px-4 py-4 text-right text-xs font-bold uppercase tracking-widest text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) =>
            editingTaskId === task._id ? (
              <TaskEditRow
                key={task._id}
                task={task}
                form={editTaskForm}
                onChange={onEditFormChange}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
                assigneeOptions={assigneeOptions}
                canReassign={isAdmin}
              />
            ) : (
              <TaskViewRow
                key={task._id}
                task={task}
                isAdmin={isAdmin}
                currentUserId={currentUserId}
                onStartEdit={onStartEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
