import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { apiGet, apiPost, refreshCsrf } from "./api/client.js";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profiles from "./pages/Profiles.jsx";
import ProfileDetail from "./pages/ProfileDetail.jsx";
import Search from "./pages/Search.jsx";
import Account from "./pages/Account.jsx";

function useSession() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const { ok, body } = await apiGet("/api/me");
      if (ok && body?.data) {
        try {
          await refreshCsrf();
        } catch {
          /* ignore */
        }
        setUser(body.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return { user, loading, reload, setUser };
}

function Layout({ user, onLogout, children }) {
  if (!user) return children;
  return (
    <div className="layout">
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/profiles">Profiles</Link>
        <Link to="/search">Search</Link>
        <Link to="/account">Account</Link>
        <button type="button" onClick={onLogout}>
          Log out
        </button>
      </nav>
      {children}
    </div>
  );
}

export default function App() {
  const { user, loading, reload, setUser } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await apiPost("/auth/logout", {});
    setUser(null);
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="layout">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            user ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/profiles"
          element={
            user ? <Profiles /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/profiles/:id"
          element={
            user ? <ProfileDetail /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/search"
          element={
            user ? <Search /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/account"
          element={
            user ? <Account user={user} onSession={reload} /> : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </Layout>
  );
}
