import { useEffect, useState } from "react";
import { config } from "../config.js";
import { useThemeVars } from "../hooks/useThemeVars.js";
import { SECTIONS, SLOT_NUMBERS, isSectionKey } from "../config/sections";
import {
  ERROR_TEXT,
  fetchSavedConfig,
  fetchStaticConfig,
  saveLinkConfig,
  verifyLogin,
} from "../lib/linkConfigApi";
import "./Dashboard.css";

// Login is checked by the server (deploy/link-config-api), not in this bundle.
// The credentials that passed are kept for this tab only, to sign each save.
const AUTH_KEY = "sh-dashboard-auth";

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

function readCreds() {
  try {
    const c = JSON.parse(sessionStorage.getItem(AUTH_KEY) || "null");
    if (c && typeof c.user === "string" && typeof c.password === "string") return c;
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

  const [creds, setCreds] = useState(readCreds);
  const [notice, setNotice] = useState("");

  function signIn(c) {
    try {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(c));
    } catch {
      /* ignore */
    }
    setNotice("");
    setCreds(c);
  }

  // The server stopped accepting these credentials (e.g. the password changed).
  function authLost() {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    setNotice("Your login is no longer valid. Please sign in again.");
    setCreds(null);
  }

  if (!creds) return <Login onSuccess={signIn} notice={notice} />;
  return <Editor creds={creds} onAuthLost={authLost} />;
}

/* -------------------------------- Login ---------------------------------- */

function Login({ onSuccess, notice }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await verifyLogin(user, pass);
    setBusy(false);
    if (result === "ok") onSuccess({ user, password: pass });
    else setError(ERROR_TEXT[result]);
  }

  return (
    <div className="dash-page dash-center">
      <form onSubmit={submit} className="dash-card dash-login">
        <h1 className="dash-script-title">Dashboard</h1>
        <p className="dash-subtitle">Saher &amp; Harmeet &middot; guest link settings</p>

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

        {(error || notice) && <p className="dash-error">{error || notice}</p>}

        <button type="submit" disabled={busy} className="dash-btn dash-btn-primary dash-btn-block">
          {busy ? "Checking…" : "Open dashboard"}
        </button>
      </form>
    </div>
  );
}

/* -------------------------------- Editor --------------------------------- */

function Editor({ creds, onAuthLost }) {
  const [config, setConfig] = useState(null);
  const [savedConfig, setSavedConfig] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [flashId, setFlashId] = useState(null); // slot number, or "all"
  const [savingId, setSavingId] = useState(null); // slot number, or "all"

  useEffect(() => {
    let cancelled = false;

    // What's saved on the server; if nothing has been saved yet, the defaults
    // checked into the repo.
    fetchSavedConfig()
      .then((saved) => saved ?? fetchStaticConfig())
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
        setLoadError(
          "Could not load the saved settings from the server. Reload the page before saving, or you may overwrite them.",
        );
      });

    return () => {
      cancelled = true;
    };
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

  // Sends the whole config to the server; guests see it on their next load.
  async function commit(next, id) {
    setSavingId(id);
    setSaveError("");
    const result = await saveLinkConfig(creds, next);
    setSavingId(null);
    if (result === "ok") {
      setSavedConfig(next);
      flash(id);
    } else if (result === "unauthorized") {
      onAuthLost();
    } else {
      setSaveError(`Not saved. ${ERROR_TEXT[result]}`);
    }
  }

  function saveSlot(n) {
    commit({ ...savedConfig, slots: { ...savedConfig.slots, [n]: config.slots[n] } }, n);
  }

  function saveAll() {
    commit(config, "all");
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

        {(loadError || saveError) && <p className="dash-note">{saveError || loadError}</p>}

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
                      maxLength={60}
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
                    disabled={savingId !== null || (!dirty && flashId !== n)}
                    className={
                      "dash-btn dash-row-save " +
                      (flashId === n
                        ? "dash-btn-saved"
                        : dirty
                          ? "dash-btn-primary"
                          : "dash-btn-disabled")
                    }
                  >
                    {savingId === n ? "Saving…" : flashId === n ? "Saved ✓" : "Save"}
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
            disabled={savingId !== null || (!anyDirty && flashId !== "all")}
            className={
              "dash-btn dash-btn-lg " +
              (flashId === "all"
                ? "dash-btn-saved"
                : anyDirty
                  ? "dash-btn-primary"
                  : "dash-btn-disabled")
            }
          >
            {savingId === "all" ? "Saving…" : flashId === "all" ? "All saved ✓" : "Save all"}
          </button>
          {anyDirty && <span className="dash-unsaved dash-unsaved-lg">You have unsaved changes</span>}
        </div>

        <p className="dash-footnote">
          Saving updates the live guest links straight away, on every device - no redeploy needed.
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
