const CreateTaskForm = ({ form, onChange, onSubmit, assigneeOptions }) => (
  <form onSubmit={onSubmit} className="space-y-4 py-2">
    <div className="flex items-center gap-2 mb-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
        +
      </span>
      <p className="text-xs font-bold uppercase tracking-widest text-indigo-900">
        New Task
      </p>
    </div>

    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        Title
      </label>
      <input
        value={form.title}
        onChange={(e) => onChange({ ...form, title: e.target.value })}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-zinc-400"
        placeholder="What needs to be done?"
        required
      />
    </div>

    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        Description
      </label>
      <textarea
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 placeholder:text-zinc-400"
        placeholder="Add details (optional)"
        rows={3}
      />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Due Date
        </label>
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => onChange({ ...form, dueDate: e.target.value })}
          className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-2 text-xs text-zinc-900 outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Priority
        </label>
        <select
          value={form.priority}
          onChange={(e) => onChange({ ...form, priority: e.target.value })}
          className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-2 text-xs text-zinc-900 outline-none focus:border-indigo-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>

    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        Assignee
      </label>
      <select
        value={form.assignee}
        onChange={(e) => onChange({ ...form, assignee: e.target.value })}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500"
      >
        <option value="">Unassigned</option>
        {assigneeOptions.map((m) => (
          <option key={m._id ?? m} value={m._id ?? m}>
            {m.username ?? m}
          </option>
        ))}
      </select>
    </div>

    <button
      type="submit"
      className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"
    >
      Create Task
    </button>
  </form>
);

export default CreateTaskForm;
