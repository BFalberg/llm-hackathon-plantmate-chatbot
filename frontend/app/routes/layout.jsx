import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { supabase } from "../lib/client";
import AppHeader from "../components/AppHeader";
import AppNav from "../components/AppNav";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate(
          `/start?redirect=${encodeURIComponent(location.pathname + location.search)}`,
          { replace: true }
        );
      }
    }
    checkAuth();
  }, [navigate, location]);

  return (
    <div className="app-layout">
      <AppHeader />
      <main className="main-content">
        <Outlet />
      </main>
      <AppNav />
    </div>
  );
}
