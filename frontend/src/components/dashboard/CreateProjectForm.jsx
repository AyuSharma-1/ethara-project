const CreateProjectForm = ({ form, onChange, onSubmit, onCancel }) => (
  <form
    onSubmit={onSubmit}
    className="space-y-4 border-b border-indigo-100 bg-indigo-50/30 px-5 py-6"
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
        +
      </span>
      <p className="text-xs font-bold uppercase tracking-widest text-indigo-900">
        New Project
      </p>
    </div>

    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-indigo-400">Project Name</label>
      <input
        value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })}
        placeholder="e.g. Website Redesign"
        className="w-full rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-zinc-400"
        required
      />
    </div>

    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-indigo-400">Description</label>
      <textarea
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        placeholder="What's this project about?"
        className="w-full resize-none rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-zinc-400"
        rows={3}
      />
    </div>

    <div className="flex gap-2 pt-2">
      <button
        type="submit"
        className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
      >
        Create Project
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50"
      >
        Cancel
      </button>
    </div>
  </form>
);

export default CreateProjectForm;
