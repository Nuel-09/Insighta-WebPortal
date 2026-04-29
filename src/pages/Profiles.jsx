import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client.js";

export default function Profiles() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    gender: "",
    country_id: "",
    age_group: "",
    page: "1",
    limit: "10"
  });
  const [err, setErr] = useState("");

  const load = async (queryString) => {
    setErr("");
    const q =
      queryString != null
        ? queryString
        : (() => {
            const p = new URLSearchParams();
            Object.entries(filters).forEach(([k, v]) => {
              if (v) p.set(k, v);
            });
            return p.toString();
          })();
    const { ok, body } = await apiGet(`/api/profiles?${q}`);
    if (!ok) {
      setErr(body?.message || "Request failed");
      return;
    }
    setData(body);
  };

  const followLink = async (href) => {
    if (!href) return;
    const withQuery = href.startsWith("http")
      ? new URL(href).pathname + new URL(href).search
      : href;
    const qs = withQuery.includes("?") ? withQuery.split("?")[1] : "";
    const p = new URLSearchParams(qs);
    setFilters((f) => ({
      ...f,
      ...(p.get("page") ? { page: p.get("page") } : {}),
      ...(p.get("limit") ? { limit: p.get("limit") } : {})
    }));
    await load(qs);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="layout">
      <h1>Profiles</h1>
      <form className="card" onSubmit={onSubmit}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "end" }}>
          <label>
            Gender
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            >
              <option value="">Any</option>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </label>
          <label>
            Country (ISO2)
            <input
              value={filters.country_id}
              onChange={(e) =>
                setFilters({ ...filters, country_id: e.target.value.toUpperCase() })
              }
              maxLength={2}
              style={{ width: "4rem" }}
            />
          </label>
          <label>
            Age group
            <select
              value={filters.age_group}
              onChange={(e) => setFilters({ ...filters, age_group: e.target.value })}
            >
              <option value="">Any</option>
              <option value="child">child</option>
              <option value="teenager">teenager</option>
              <option value="adult">adult</option>
              <option value="senior">senior</option>
            </select>
          </label>
          <label>
            Page
            <input
              value={filters.page}
              onChange={(e) => setFilters({ ...filters, page: e.target.value })}
              style={{ width: "4rem" }}
            />
          </label>
          <label>
            Limit
            <input
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: e.target.value })}
              style={{ width: "4rem" }}
            />
          </label>
          <button type="submit" className="primary">
            Apply
          </button>
        </div>
      </form>
      {err && <p className="error">{err}</p>}
      {data && (
        <>
          <p>
            Page {data.page} of {data.total_pages} — {data.total} records
          </p>
          <div className="card" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Country</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {(data.data || []).map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.gender}</td>
                    <td>{p.age}</td>
                    <td>{p.country_id}</td>
                    <td>
                      <Link to={`/profiles/${p.id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav style={{ display: "flex", gap: "1rem" }}>
            {data.links?.prev && (
              <button type="button" onClick={() => followLink(data.links.prev)}>
                Previous
              </button>
            )}
            {data.links?.next && (
              <button type="button" onClick={() => followLink(data.links.next)}>
                Next
              </button>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
