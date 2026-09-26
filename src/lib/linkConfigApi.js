// Client for the link-config service (deploy/link-config-api in the templates
// repo). nginx serves it at /api/link-config on this site's own host. Reading is
// public; login and save send the dashboard credentials, which the server checks.

const API = `${import.meta.env.BASE_URL}api/link-config`;

// What the dashboard last saved on the server, or null when nothing has been
// saved yet. Throws if the server can't be reached or answers with junk.
export async function fetchSavedConfig() {
  const r = await fetch(API, { cache: "no-store" });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// The defaults checked into the repo (public/link-config.json).
export async function fetchStaticConfig() {
  const r = await fetch(`${import.meta.env.BASE_URL}link-config.json`, { cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// "ok" | "unauthorized" | "blocked" | "invalid" | "unavailable"
async function call(method, url, body) {
  try {
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.status === 200) return "ok";
    if (r.status === 401) return "unauthorized";
    if (r.status === 429) return "blocked";
    if (r.status === 400 || r.status === 413) return "invalid";
  } catch {
    /* network error - fall through */
  }
  return "unavailable";
}

export const verifyLogin = (user, password) => call("POST", `${API}/verify`, { user, password });

export const saveLinkConfig = ({ user, password }, config) =>
  call("PUT", API, { user, password, config });

export const ERROR_TEXT = {
  unauthorized: "Wrong username or password.",
  blocked: "Too many wrong attempts. Wait 10 minutes and try again.",
  invalid: "The server rejected these settings. Reload the page and try again.",
  unavailable: "Couldn't reach the server. Check your connection and try again.",
};
