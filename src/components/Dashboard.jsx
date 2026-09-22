import { useEffect, useState } from "react";
import { config } from "../config.js";
import { useThemeVars } from "../hooks/useThemeVars.js";
import { SECTIONS, SLOT_NUMBERS, isSectionKey } from "../config/sections";
import "./Dashboard.css";

const AUTH_KEY = "sh-dashboard-auth";
const STORAGE_KEY = "sh-link-config";
const ENV_USER = import.meta.env.VITE_DASHBOARD_USER;
const ENV_PASS = import.meta.env.VITE_DASHBOARD_PASSWORD;

function emptyConfig() {
  const slots = {};
  for (const n of SLOT_NUMBERS) slots[n] = { name: "", hidden: [] };
  return { slots };
}

function normalize(data) {
  const base = emptyConfig();
  if (data && data.slots) {
    for (const n of SLOT_NUMBERS) {
      const s = data.slots[n];
      if (!s) continue;
      base.slots[n] = {
        name: typeof s.name === "string" ? s.name : "",
        hidden: Array.isArray(s.hidden) ? s.hidden.filter(isSectionKey) : [],
      };
    }
  }
  return base;
}

function persist(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    return true;
  } catch {
    return false;
  }
}

function storedConfig() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (data && data.slots) return normalize(data);
  } catch {
    /* ignore */
  }
  return null;
}

function urlFor(n) {
  return `${window.location.origin}${import.meta.env.BASE_URL}?g=${n}`;
}

/* -------------------------------------------------------------------------- */

export default function Dashboard() {
  useThemeVars(config.theme);

  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Editor />;
}

/* -------------------------------- Login ---------------------------------- */

function Login({ onSuccess }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const envMissing = !ENV_USER || !ENV_PASS;

  function submit(e) {
    e.preventDefault();
    if (envMissing) {
      setError("Login is not configured. Set VITE_DASHBOARD_USER and VITE_DASHBOARD_PASSWORD in .env.local, then restart.");
      return;
    }
    if (user === ENV_USER && pass === ENV_PASS) {
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch {
        /* ignore */
      }
      onSuccess();
    } else {
      setError("Wrong username or password.");
    }
  }

  return (
    <div className="dash-page dash-center">
      <form onSubmit={submit} className="dash-card dash-login">
        <h1 className="dash-script-title">Dashboard</h1>
        <p className="dash-subtitle">Saher &amp; Harmeet &middot; guest link settings</p>

        {envMissing && (
          <p className="dash-note">
            <b>Not configured.</b> Add <code>VITE_DASHBOARD_USER</code> and{" "}
            <code>VITE_DASHBOARD_PASSWORD</code> to <code>.env.local</code> and restart the dev
            server / rebuild.
          </p>
        )}

        <label className="dash-label">Username</label>
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          autoComplete="username"
          className="dash-input"
        />

        <label className="dash-label">Password</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          autoComplete="current-password"
          className="dash-input"
        />

        {error && <p className="dash-error">{error}</p>}

        <button type="submit" className="dash-btn dash-btn-primary dash-btn-block">
          Open dashboard
        </button>
      </form>
    </div>
  );
}

/* -------------------------------- Editor --------------------------------- */

function Editor() {
  const [config, setConfig] = useState(storedConfig);
  const [savedConfig, setSavedConfig] = useState(storedConfig);
  const [loadError, setLoadError] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [flashId, setFlashId] = useState(null); // slot number, or "all"

  useEffect(() => {
    if (config !== null) return; // already loaded from this browser's saved edits
    let cancelled = false;

    fetch(`${import.meta.env.BASE_URL}link-config.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("not found"))))
      .then((data) => {
        if (cancelled) return;
        const c = normalize(data);
        setConfig(c);
        setSavedConfig(c);
      })
      .catch(() => {
        if (cancelled) return;
        const c = emptyConfig();
        setConfig(c);
        setSavedConfig(c);
        setLoadError("Could not load the current link-config.json - starting from a blank set.");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slotDirty = (n) =>
    savedConfig &&
    JSON.stringify(config.slots[n]) !== JSON.stringify(savedConfig.slots[n]);

  const anyDirty =
    config && savedConfig && JSON.stringify(config) !== JSON.stringify(savedConfig);

  function flash(id) {
    setFlashId(id);
    setTimeout(() => setFlashId((f) => (f === id ? null : f)), 1500);
  }

  function setName(n, name) {
    setConfig((c) => ({
      ...c,
      slots: { ...c.slots, [n]: { ...c.slots[n], name } },
    }));
  }

  function toggle(n, key) {
    setConfig((c) => {
      const slot = c.slots[n];
      const hidden = slot.hidden.includes(key)
        ? slot.hidden.filter((k) => k !== key)
        : [...slot.hidden, key];
      return { ...c, slots: { ...c.slots, [n]: { ...slot, hidden } } };
    });
  }

  function clearRow(n) {
    setConfig((c) => ({
      ...c,
      slots: { ...c.slots, [n]: { ...c.slots[n], hidden: [] } },
    }));
  }

  function saveSlot(n) {
    const next = {
      ...savedConfig,
      slots: { ...savedConfig.slots, [n]: config.slots[n] },
    };
    persist(next);
    setSavedConfig(next);
    flash(n);
  }

  function saveAll() {
    persist(config);
    setSavedConfig(config);
    flash("all");
  }

  async function copyUrl(n) {
    try {
      await navigator.clipboard.writeText(urlFor(n));
      setCopiedUrl(n);
      setTimeout(() => setCopiedUrl((c) => (c === n ? null : c)), 1200);
    } catch {
      /* ignore */
    }
  }

  function logout() {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    window.location.reload();
  }

  if (!config) {
    return <div className="dash-page dash-center dash-loading">Loading…</div>;
  }

  return (
    <div className="dash-page">
      <div className="dash-shell">
        <header className="dash-header">
          <div>
            <h1 className="dash-script-title">Guest Links</h1>
            <p className="dash-subtitle dash-subtitle-left">
              Name each link, pick which sections to hide, then Save.
            </p>
          </div>
          <button onClick={logout} className="dash-logout">
            Log out
          </button>
        </header>

        {loadError && <p className="dash-note">{loadError}</p>}

        <div className="dash-rows">
          {SLOT_NUMBERS.map((n) => {
            const slot = config.slots[n];
            const hiddenSet = new Set(slot.hidden);
            const dirty = slotDirty(n);
            return (
              <div key={n} className="dash-card dash-row">
                <div className="dash-row-main">
                  <div className="dash-row-name">
                    <span className="dash-slot-badge">{n}</span>
                    <input
                      value={slot.name}
                      onChange={(e) => setName(n, e.target.value)}
                      placeholder={`Name for link ?g=${n} (e.g. Sharma Family)`}
                      className="dash-input"
                    />
                  </div>

                  <div className="dash-row-hide">
                    <HideSelect
                      hiddenSet={hiddenSet}
                      onToggle={(key) => toggle(n, key)}
                      onClear={() => clearRow(n)}
                    />
                  </div>

                  <button
                    onClick={() => saveSlot(n)}
                    disabled={!dirty && flashId !== n}
                    className={
                      "dash-btn dash-row-save " +
                      (flashId === n
                        ? "dash-btn-saved"
                        : dirty
                          ? "dash-btn-primary"
                          : "dash-btn-disabled")
                    }
                  >
                    {flashId === n ? "Saved ✓" : "Save"}
                  </button>
                </div>

                <div className="dash-row-url">
                  <span className="dash-row-url-label">URL</span>
                  <a href={urlFor(n)} target="_blank" rel="noreferrer" className="dash-link">
                    {urlFor(n)}
                  </a>
                  <button onClick={() => copyUrl(n)} className="dash-copy-btn">
                    {copiedUrl === n ? "Copied" : "Copy"}
                  </button>
                  {dirty && <span className="dash-unsaved">• unsaved</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="dash-footer-actions">
          <button
            onClick={saveAll}
            disabled={!anyDirty && flashId !== "all"}
            className={
              "dash-btn dash-btn-lg " +
              (flashId === "all"
                ? "dash-btn-saved"
                : anyDirty
                  ? "dash-btn-primary"
                  : "dash-btn-disabled")
            }
          >
            {flashId === "all" ? "All saved ✓" : "Save all"}
          </button>
          {anyDirty && <span className="dash-unsaved dash-unsaved-lg">You have unsaved changes</span>}
        </div>

        <p className="dash-footnote">
          Plain <code>/1</code>…<code>/10</code> URLs also work once the host is set to serve{" "}
          <code>index.html</code> for unknown paths.
        </p>
      </div>
    </div>
  );
}

/* --------------------------- Multi-select ------------------------------- */

function HideSelect({ hiddenSet, onToggle, onClear }) {
  const count = hiddenSet.size;
  const summary =
    count === 0
      ? "Nothing hidden - full invite"
      : `${count} hidden: ${SECTIONS.filter((s) => hiddenSet.has(s.key))
          .map((s) => s.label.replace(" (+ dress code)", "").replace(" (+ dress theme)", ""))
          .join(", ")}`;

  return (
    <details className="dash-hide-select">
      <summary className="dash-hide-summary">
        <span className="dash-hide-summary-text">{summary}</span>
        <span className="dash-hide-caret">▾</span>
      </summary>

      <div className="dash-hide-panel">
        {SECTIONS.map((s) => (
          <label key={s.key} className="dash-hide-option">
            <input
              type="checkbox"
              checked={hiddenSet.has(s.key)}
              onChange={() => onToggle(s.key)}
            />
            <span>{s.label}</span>
          </label>
        ))}
        {count > 0 && (
          <button onClick={onClear} className="dash-hide-clear">
            Clear all
          </button>
        )}
      </div>
    </details>
  );
}
