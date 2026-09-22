import { useLayoutEffect } from "react";

// Mirrors applyConfig()'s theme loop: the palette (--plum, --mauve, ...) is
// referenced throughout styles.css but defined nowhere in the CSS - it is
// injected here from config.theme onto :root.
export function useThemeVars(theme) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([name, value]) => {
      root.style.setProperty(`--${name}`, value);
    });
  }, [theme]);
}
