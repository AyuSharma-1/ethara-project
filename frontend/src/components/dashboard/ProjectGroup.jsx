import { Link } from "react-router-dom";

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

const ProjectGroup = ({ label, projects, userId, onDelete }) => {
  if (projects.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-5 py-3">
        <span className={`h-2 w-2 rounded-full ${label === "My Projects" ? "bg-indigo-500" : "bg-amber-500"}`} />
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </p>
        <span className="ml-auto text-sm text-zinc-400">{projects.length}</span>
      </div>
      {projects.map((project) => (
        <Link
          key={project._id}
          to={`/projects/${project._id}`}
          className="group flex items-center justify-between border-b border-zinc-100 px-5 py-3 transition hover:bg-indigo-50"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-sm font-bold uppercase text-white ${getAvatarColor(project._id)}`}>
              {project.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-medium text-zinc-900 group-hover:text-indigo-700">
                {project.name}
              </p>
              {project.description && (
                <p className="mt-0.5 truncate text-sm text-zinc-400">{project.description}</p>
              )}
            </div>
          </div>
          {project.creator?._id === userId && (
            <button
              onClick={(e) => onDelete(e, project._id)}
              className="ml-2 flex-shrink-0 rounded px-1.5 py-0.5 text-xs text-zinc-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
              title="Delete project"
            >
              ✕
            </button>
          )}
        </Link>
      ))}
    </div>
  );
};

export default ProjectGroup;
