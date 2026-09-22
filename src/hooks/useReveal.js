import { useEffect } from "react";

// Port of initializeRevealAnimations(): after everything is on the page, find
// every ".reveal" element and add "is-visible" as it scrolls into view (or all
// at once when the visitor prefers reduced motion).
export function useReveal() {
  useEffect(() => {
    const revealElements = [...document.querySelectorAll(".reveal")];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.13 },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
}
