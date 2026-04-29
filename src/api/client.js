const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiHeaders = () => ({
  "X-API-Version": "1",
  Accept: "application/json",
  "Content-Type": "application/json"
});

let csrfToken = null;

export function getApiBase() {
  return API.replace(/\/$/, "");
}

/** Double-submit CSRF for cookie-based requests (TRD). Call before unsafe methods. */
export async function refreshCsrf() {
  const r = await fetch(`${getApiBase()}/auth/csrf-token`, {
    credentials: "include"
  });
  if (!r.ok) throw new Error("Could not load CSRF token");
  const j = await r.json();
  csrfToken = j.csrf_token;
  return csrfToken;
}

export async function apiGet(path) {
  try {
    const r = await fetch(`${getApiBase()}${path}`, {
      credentials: "include",
      headers: {
        "X-API-Version": "1",
        Accept: "application/json"
      }
    });
    const text = await r.text();
    let body;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { message: text };
    }
    return { ok: r.ok, status: r.status, body };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      body: {
        message:
          e instanceof TypeError
            ? "Network or CORS error — check VITE_API_URL and backend WEB_ORIGIN match this site."
            : String(e?.message || e)
      }
    };
  }
}

export async function apiPost(path, jsonBody, needCsrf = true) {
  const headers = { ...apiHeaders() };
  if (needCsrf) {
    if (!csrfToken) await refreshCsrf();
    headers["X-CSRF-Token"] = csrfToken;
  }
  const r = await fetch(`${getApiBase()}${path}`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(jsonBody ?? {})
  });
  const text = await r.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { message: text };
  }
  return { ok: r.ok, status: r.status, body };
}

export async function apiDelete(path) {
  if (!csrfToken) await refreshCsrf();
  const r = await fetch(`${getApiBase()}${path}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...apiHeaders(),
      "X-CSRF-Token": csrfToken
    }
  });
  const text = await r.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { message: text };
  }
  return { ok: r.ok, status: r.status, body };
}
