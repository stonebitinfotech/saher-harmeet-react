import { useEffect, useState } from "react";
import { isSectionKey } from "../config/sections";

const STORAGE_KEY = "sh-link-config";

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

// Unsaved/saved dashboard edits live in localStorage on the admin's browser so
// they can preview before publishing. Guests never have this key.
function fromStorage(slot) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    const keys = data?.slots?.[slot]?.hidden;
    if (Array.isArray(keys)) return new Set(keys.filter(isSectionKey));
  } catch {
    /* ignore */
  }
  return null;
}

// Resolves which section keys are hidden for the current guest slot. No slot =>
// nothing hidden. Prefers this browser's dashboard edits, else /link-config.json.
export function useLinkConfig() {
  const [slot] = useState(readSlot);
  const [hidden, setHidden] = useState(() =>
    slot === null ? new Set() : fromStorage(slot) ?? new Set(),
  );
  const [ready, setReady] = useState(
    () => slot === null || fromStorage(slot) !== null,
  );

  useEffect(() => {
    if (slot === null || fromStorage(slot) !== null) return;
    let cancelled = false;

    fetch(`${import.meta.env.BASE_URL}link-config.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
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
