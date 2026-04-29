import { useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client.js";

export default function Search() {
  const [q, setQ] = useState("young males from nigeria");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const p = new URLSearchParams({ q, page: "1", limit: "10" });
    const { ok, body } = await apiGet(`/api/profiles/search?${p.toString()}`);
    if (!ok) {
      setErr(body?.message || "Search failed");
      setData(null);
      return;
    }
    setData(body);
  };

  return (
    <div className="layout">
      <h1>Search</h1>
      <p>Rule-based natural language (same as API):</p>
      <form className="card" onSubmit={onSubmit}>
        <label>
          Query
          <div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: "100%", maxWidth: "32rem" }}
            />
          </div>
        </label>
        <p>
          <button type="submit" className="primary">
            Search
          </button>
        </p>
      </form>
      {err && <p className="error">{err}</p>}
      {data && (
        <>
          <p>Total: {data.total}</p>
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
                {(data.data || []).map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.gender}</td>
                    <td>{row.age}</td>
                    <td>{row.country_id}</td>
                    <td>
                      <Link to={`/profiles/${row.id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
