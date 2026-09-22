// Sections a personalized guest link (?g=1 .. ?g=10) can hide.
export const SECTIONS = [
  { key: "sunder-kand", label: "Sunder Kand Path" },
  { key: "mehndi", label: "Dhol & Heena Mehfil (+ dress code)" },
  { key: "haldi", label: "Haldi by the River (+ dress theme)" },
  { key: "sangeet", label: "Engagement & Sangeet Night (+ dress theme)" },
  { key: "anand-karaj", label: "Anand Karaj & Bidaai (+ dress theme)" },
];

export const SECTION_KEYS = SECTIONS.map((s) => s.key);

export const isSectionKey = (k) => SECTION_KEYS.includes(k);

// Guest slots 1..10
export const SLOT_NUMBERS = Array.from({ length: 10 }, (_, i) => String(i + 1));
