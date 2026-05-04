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

const MembersSection = ({
  project,
  isAdmin,
  memberForm,
  onMemberFormChange,
  onSearchUsers,
  onAddMember,
  onRemoveMember,
  activePanel,
  onToggleManage,
}) => {
  const allMembers = [
    ...(project?.members || []),
    project?.creator,
  ].filter(Boolean).reduce((unique, m) => {
    if (!unique.some((i) => (i?._id || i) === (m?._id || m))) unique.push(m);
    return unique;
  }, []);

  return (
    <div className="border-b border-zinc-200 px-5 py-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            Team Members
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={onToggleManage}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            {activePanel === "members" ? "Done" : "Manage"}
          </button>
        )}
      </div>

      {/* Member chips */}
      <div className="flex flex-wrap gap-2">
        {allMembers.map((member) => (
          <div
            key={member?._id || member}
            className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white pl-1 pr-2.5 py-0.5 shadow-sm transition hover:border-indigo-200"
          >
            <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold uppercase text-white ${getAvatarColor(member?._id)}`}>
              {member?.username?.charAt(0) || "?"}
            </div>
            <span className="text-sm font-medium text-zinc-700">
              {member?.username || "Unknown"}
            </span>
            {isAdmin && member?._id !== project?.creator?._id && (
              <button
                onClick={() => onRemoveMember(member._id)}
                className="ml-1 text-sm text-zinc-300 transition hover:text-red-500"
                title="Remove member"
              >
                ✕
              </button>
            )}
            {member?._id === project?.creator?._id && (
              <span className="text-xs font-bold uppercase tracking-tight text-indigo-400 ml-1">Admin</span>
            )}
          </div>
        ))}
      </div>

      {/* Add member search — admin only */}
      {activePanel === "members" && isAdmin && (
        <div className="mt-5 space-y-3 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
          <div className="relative">
            <input
              value={memberForm.email}
              onChange={(e) => {
                onMemberFormChange({ ...memberForm, email: e.target.value });
                onSearchUsers(e.target.value);
              }}
              placeholder="Find by email..."
              className="w-full rounded-md border border-indigo-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-zinc-400"
            />
          </div>
          
          {memberForm.searching && (
            <div className="flex items-center gap-2 px-1">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              <p className="text-[10px] text-indigo-500 font-medium">Searching...</p>
            </div>
          )}

          <div className="space-y-1">
            {memberForm.searchResults.map((u) => (
              <div key={u._id} className="flex items-center justify-between rounded bg-white p-2 border border-zinc-100 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-zinc-900">{u.username}</p>
                  <p className="text-[10px] text-zinc-500">{u.email}</p>
                </div>
                <button
                  onClick={() => onAddMember(u._id)}
                  className="rounded bg-indigo-600 px-3 py-1 text-[10px] font-bold text-white transition hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersSection;
