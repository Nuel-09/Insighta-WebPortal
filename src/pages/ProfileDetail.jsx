import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet, apiDelete, refreshCsrf } from "../api/client.js";

export default function ProfileDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");
  const [role, setRole] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const me = await apiGet("/api/me");
      if (me.ok && me.body?.data) setRole(me.body.data.role);
      const { ok, body } = await apiGet(`/api/profiles/${encodeURIComponent(id)}`);
      if (cancelled) return;
      if (!ok) {
        setErr(body?.message || "Not found");
        return;
      }
      setP(body.data);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const onDelete = async () => {
    if (!confirm("Delete this profile?")) return;
    await refreshCsrf();
    const { ok, body } = await apiDelete(`/api/profiles/${encodeURIComponent(id)}`);
    if (!ok) {
      alert(body?.message || "Delete failed");
      return;
    }
    window.location.href = "/profiles";
  };

  return (
    <div className="layout">
      <p>
        <Link to="/profiles">← Back to list</Link>
      </p>
      {err && <p className="error">{err}</p>}
      {p && (
        <div className="card">
          <h1>{p.name}</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(p, null, 2)}</pre>
          {role === "admin" && (
            <p>
              <button
                type="button"
                onClick={onDelete}
                style={{ color: "#b91c1c", borderColor: "#fecaca" }}
              >
                Delete profile
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
