# Velvet — React

This site was originally a static HTML/CSS/JS template; it's now React + Vite
with the same look, content and behaviour.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/  (static, deploy anywhere)
```

## Where things live

| File | What it is |
|---|---|
| `src/config.js` | **All client content** — couple, dates, venues, copy, theme colours. Edit this to reuse the template. Ported verbatim from the old `assets/js/config.js`. |
| `public/assets/css/styles.css` + `fonts.css` | The original stylesheets, byte-for-byte. Loaded straight from `index.html`. |
| `public/assets/`, `public/media/` | Original images, fonts, video, audio — untouched. |
| `src/App.jsx` | Page composition — every section in the original's order. |
| `src/components/` | One component per section/piece: `Hero`, `ScratchDate`, `EventSection`, `EventVenue`, `EventFigure`, `AttireNote`, `DressTheme`, `Closing`, `FloralDivider`. |
| `src/hooks/` | The behaviour from the old `app.js`: `useScratchCard` (canvas scratch + petal shower), `useCountdown` (the live ticking countdown under the scratch card), `useReveal` (scroll-in animations), `useThemeVars` (inject the `--plum`/`--mauve`/… palette from `config.theme`), `useAntiCopy` (block context menu / image drag). |

Nothing about the visitor-facing site changed — the theme CSS, fonts, media,
markup structure, class names, and interactions all match the original.
