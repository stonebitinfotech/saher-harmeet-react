import { useEffect } from "react";

// The two top-level document listeners from app.js: block the context menu
// everywhere, and block dragging images out of the page.
export function useAntiCopy() {
  useEffect(() => {
    const onContextMenu = (event) => event.preventDefault();
    const onDragStart = (event) => {
      if (event.target instanceof HTMLImageElement) event.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);
}
