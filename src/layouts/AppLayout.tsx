import { Link, NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export function AppLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif text-xl text-ink-900">
            MindDesk
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <NavLink
              to="/busninessList"
              className={({ isActive }) => (isActive ? "text-accent-700" : "text-ink-700 hover:text-ink-900")}
            >
              Clients
            </NavLink>
            <NavLink
              to="/newbusniness"
              className={({ isActive }) => (isActive ? "text-accent-700" : "text-ink-700 hover:text-ink-900")}
            >
              New client
            </NavLink>
            <button type="button" onClick={logout} className="text-ink-700 hover:text-ink-900">
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
