import { apiPost, refreshCsrf } from "../api/client.js";

export default function Account({ user, onSession }) {
  const isAdmin = user?.role === "admin";

  const startRefresh = async () => {
    await refreshCsrf();
    const { ok, body } = await apiPost("/auth/refresh", {});
    if (ok) onSession?.();
    else alert(body?.message || "Refresh failed");
  };

  return (
    <div className="layout">
      <h1>Account</h1>
      <div className="card">
        <p>
          <strong>Username:</strong> @{user?.username}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
        <p>
          <strong>User id:</strong> {user?.id}
        </p>
        {isAdmin && (
          <p className="error" style={{ fontSize: "0.9rem" }}>
            Admin: you can create profiles, export CSV, and delete from the profile detail page.
          </p>
        )}
        <p>
          <button type="button" onClick={startRefresh}>
            Rotate session (refresh tokens)
          </button>
        </p>
        <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
          Access and refresh tokens are stored in HTTP-only cookies. CSRF protection applies to
          state-changing requests.
        </p>
      </div>
    </div>
  );
}
