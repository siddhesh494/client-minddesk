import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
  const { verify } = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "ok" | "guest">("loading");

  useEffect(() => {
    let active = true;
    verify().then((authenticated) => {
      if (active) {
        setStatus(authenticated ? "ok" : "guest");
      }
    });
    return () => {
      active = false;
    };
  }, [verify]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-ink-700">
        Checking your session...
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
