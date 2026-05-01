import { useEffect, useState } from "react";
import { apiGet } from "../api/client.js";

// Lightweight metrics view for demo: reads pagination metadata from list API.
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { ok, body } = await apiGet("/api/profiles?page=1&limit=1");
      if (cancelled) return;
      if (!ok) {
        setErr(body?.message || "Failed to load metrics");
        return;
      }
      setStats({ total: body.total, total_pages: body.total_pages });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="layout">
      <h1>Dashboard</h1>
      {err && <p className="error">{err}</p>}
      <div className="card">
        <h2>Overview</h2>
        {stats ? (
          <ul>
            <li>
              <strong>Total profiles:</strong> {stats.total}
            </li>
            <li>
              <strong>Pages (default page size):</strong> {stats.total_pages}
            </li>
          </ul>
        ) : (
          !err && <p>Loading metrics…</p>
        )}
      </div>
    </div>
  );
}
