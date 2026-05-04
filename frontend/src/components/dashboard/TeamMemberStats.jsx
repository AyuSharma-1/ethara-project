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

const TeamMemberStats = ({ tasksByUser }) => {
  const entries = tasksByUser ? Object.values(tasksByUser) : [];

  if (entries.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-white">
        <p className="text-sm text-zinc-400">No task assignments yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(({ user, taskCount }) => (
        <div
          key={user.email}
          className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold uppercase text-white shadow-sm ${getAvatarColor(user._id)}`}>
              {user.username.charAt(0)}
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-900 group-hover:text-indigo-700 transition-colors">
                {user.username}
              </p>
              <p className="text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-indigo-600">
              {taskCount}
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Tasks
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMemberStats;
