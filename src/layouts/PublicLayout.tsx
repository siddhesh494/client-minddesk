import { Link, Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-serif text-xl text-ink-900">
          MindDesk
        </Link>
        <Link to="/busninessList" className="text-sm text-ink-700 hover:text-ink-900">
          Admin
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
