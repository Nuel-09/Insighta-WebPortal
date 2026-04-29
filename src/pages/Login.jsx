import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { apiGet, getGithubAuthUrl } from "../api/client.js";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { ok } = await apiGet("/api/me");
      if (!cancelled && ok) navigate("/", { replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const startGithub = () => {
    window.location.href = getGithubAuthUrl();
  };

  return (
    <div className="layout">
      <div className="card">
        <h1>Insighta Labs+</h1>
        <p>Sign in with GitHub. Tokens stay in HTTP-only cookies (not readable from JavaScript).</p>
        <button type="button" className="primary" onClick={startGithub}>
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
