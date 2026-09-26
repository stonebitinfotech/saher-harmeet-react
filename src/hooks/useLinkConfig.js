import { useEffect, useState } from "react";
import { isSectionKey } from "../config/sections";
import { fetchSavedConfig, fetchStaticConfig } from "../lib/linkConfigApi";

// Read the guest slot from the URL: ?g=1 (works anywhere) or a bare /1 path
// (works once the host rewrites unknown paths to index.html).
function readSlot() {
  const q = new URLSearchParams(window.location.search).get("g");
  if (q && /^\d+$/.test(q)) {
    const n = parseInt(q, 10);
    if (n >= 1 && n <= 10) return String(n);
  }
  const seg = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (/^\d+$/.test(seg)) {
    const n = parseInt(seg, 10);
    if (n >= 1 && n <= 10) return String(n);
  }
  return null;
}

// What the dashboard saved on the server, so every guest on every device sees
// the same thing. Falls back to the defaults in /link-config.json when nothing
// has been saved yet or the server can't be reached.
async function loadConfig() {
  try {
    const saved = await fetchSavedConfig();
    if (saved) return saved;
  } catch {
    /* use the defaults below */
  }
  return fetchStaticConfig();
}

// Resolves which section keys are hidden for the current guest slot. No slot =>
// nothing hidden.
export function useLinkConfig() {
  const [slot] = useState(readSlot);
  const [hidden, setHidden] = useState(() => new Set());
  const [ready, setReady] = useState(() => slot === null);

  useEffect(() => {
    if (slot === null) return;
    let cancelled = false;

    loadConfig()
      .then((data) => {
        if (cancelled) return;
        const keys = data?.slots?.[slot]?.hidden;
        if (Array.isArray(keys)) setHidden(new Set(keys.filter(isSectionKey)));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slot]);

  return { slot, hidden, ready };
}
