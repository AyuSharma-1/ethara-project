import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useAuth();

  const handleLogout = () => logout();

  return (
    <nav className="border-b border-zinc-200 bg-white px-6 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to={token ? "/dashboard" : "/login"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-sm font-bold text-white">
            E
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">Ethara</span>
        </Link>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="rounded px-3 py-1.5 text-base font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                Dashboard
              </Link>
              <span className="text-zinc-300">|</span>
              <span className="text-base font-medium text-zinc-700">
                {user?.username || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded px-4 py-2 text-base font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded bg-indigo-600 px-4 py-2 text-base font-medium text-white transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
