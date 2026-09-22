import { useEffect } from "react";
import { config } from "../config.js";

// Faithful port of initializeScratchCard() + createPetalShower() from app.js.
// The canvas painting, scratch detection, reveal text swap and petal shower are
// unchanged - only the element lookups now come from the refs passed in.
export function useScratchCard({ canvasRef, cardRef, headingRef, noteRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    const heading = headingRef.current;
    const note = noteRef.current;
    if (!canvas || !card || !heading || !note) return;

    let drawing = false;
    let revealed = false;
    let petalShower = null;

    function prepareCanvas() {
      if (revealed || !canvas.isConnected) return;

      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const context = canvas.getContext("2d", { willReadFrequently: true });

      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);

      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const width = rect.width;
      const height = rect.height;

      /* BURGUNDY BASE */
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, config.theme.plum);
      gradient.addColorStop(0.45, config.theme.lavender);
      gradient.addColorStop(0.72, config.theme.mauve);
      gradient.addColorStop(1, config.theme.plum);

      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      /* SOFT METALLIC SHIMMER */
      const shimmer = context.createLinearGradient(0, 0, width, height);
      shimmer.addColorStop(0, "rgba(255,255,255,0)");
      shimmer.addColorStop(0.35, "rgba(255,235,190,0.07)");
      shimmer.addColorStop(0.5, "rgba(255,255,255,0.13)");
      shimmer.addColorStop(0.65, "rgba(255,220,160,0.06)");
      shimmer.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = shimmer;
      context.fillRect(0, 0, width, height);

      /* FINE GOLD GLITTER */
      const glitterCount = Math.min(1100, Math.round((width * height) / 120));
      for (let i = 0; i < glitterCount; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 0.25 + Math.random() * 1.15;
        const brightness = 0.15 + Math.random() * 0.55;
        context.globalAlpha = brightness;
        context.fillStyle =
          Math.random() > 0.18 ? config.theme.champagne : config.theme.ivory;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
      }

      /* SMALL BRIGHT SPARKLES */
      const sparkleCount = Math.max(20, Math.round(width / 12));
      for (let i = 0; i < sparkleCount; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 1 + Math.random() * 2.1;
        context.globalAlpha = 0.3 + Math.random() * 0.5;
        context.strokeStyle =
          Math.random() > 0.25 ? config.theme.champagne : config.theme.ivory;
        context.lineWidth = 0.55;
        context.beginPath();
        context.moveTo(x - size, y);
        context.lineTo(x + size, y);
        context.moveTo(x, y - size);
        context.lineTo(x, y + size);
        context.stroke();
      }

      /* VERY FINE TEXTURE */
      for (let i = 0; i < 350; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        context.globalAlpha = 0.06 + Math.random() * 0.1;
        context.fillStyle = config.theme.ivory;
        context.fillRect(
          x,
          y,
          Math.random() * 0.7 + 0.15,
          Math.random() * 0.7 + 0.15,
        );
      }

      /* reset */
      context.globalAlpha = 1;

      /* SCRATCHING MODE */
      context.globalCompositeOperation = "destination-out";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 42;
    }

    function pointerPosition(event) {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function beginScratch(event) {
      if (revealed) return;
      drawing = true;
      canvas.setPointerCapture(event.pointerId);
      const position = pointerPosition(event);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.beginPath();
      context.moveTo(position.x, position.y);
    }

    function continueScratch(event) {
      if (!drawing || revealed) return;
      const position = pointerPosition(event);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.lineTo(position.x, position.y);
      context.stroke();
      if (scratchCompletion(context) > 0.42) finishReveal();
    }

    function scratchCompletion(context) {
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparentSamples = 0;
      let totalSamples = 0;
      for (let alphaIndex = 3; alphaIndex < pixels.length; alphaIndex += 64) {
        totalSamples += 1;
        if (pixels[alphaIndex] < 30) transparentSamples += 1;
      }
      return transparentSamples / totalSamples;
    }

    function finishReveal() {
      if (revealed) return;
      revealed = true;
      drawing = false;

      // Keep both classes: is-revealed handles celebration styling, while
      // is-visible prevents the scroll-reveal animation from hiding the card.
      card.classList.add("is-revealed", "is-visible");
      heading.textContent = "Our forever begins";
      note.textContent =
        "Save the date we would be honoured to have you with us.";
      canvas.remove();
      petalShower = createPetalShower();
    }

    const onPointerDown = beginScratch;
    const onPointerMove = continueScratch;
    const onPointerUp = () => {
      drawing = false;
    };
    const onPointerCancel = () => {
      drawing = false;
    };
    const onKeyDown = (event) => {
      if (event.key === "Enter" || event.key === " ") finishReveal();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("keydown", onKeyDown);

    prepareCanvas();
    window.addEventListener("resize", prepareCanvas);

    return () => {
      window.removeEventListener("resize", prepareCanvas);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("keydown", onKeyDown);
      petalShower?.remove();
    };
  }, [canvasRef, cardRef, headingRef, noteRef]);
}

// Port of createPetalShower(): a burst of falling petals when the card is
// uncovered. Returns the shower element so the caller can clean it up early.
function createPetalShower() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  document.querySelector(".petal-shower")?.remove();

  const shower = document.createElement("div");
  shower.className = "petal-shower";
  shower.setAttribute("aria-hidden", "true");

  const rootStyles = getComputedStyle(document.documentElement);
  const mauve = rootStyles.getPropertyValue("--mauve").trim() || "#A51520";
  const lavender = rootStyles.getPropertyValue("--lavender").trim() || "#6F0B17";
  const champagne =
    rootStyles.getPropertyValue("--champagne").trim() || "#C9A35F";

  const colors = [mauve, lavender, mauve, lavender, mauve, champagne];

  const shapes = [
    "80% 20% 70% 30% / 65% 35% 65% 35%",
    "70% 30% 85% 15% / 55% 45% 70% 30%",
    "90% 10% 60% 40% / 70% 30% 80% 20%",
    "60% 40% 75% 25% / 80% 20% 60% 40%",
  ];

  const random = (min, max) => Math.random() * (max - min) + min;
  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const petalCount = Math.min(60, Math.max(38, Math.round(viewportWidth / 9)));

  const petals = [];

  for (let index = 0; index < petalCount; index += 1) {
    const element = document.createElement("i");
    const size = random(7, 14);
    const x = random(-25, viewportWidth + 25);
    const y = random(-100, -25);
    const rotation = random(0, 360);
    const rotationX = random(0, 360);
    const rotationY = random(0, 360);
    const scale = random(0.65, 1.2);

    element.style.width = `${size}px`;
    element.style.height = `${size * random(1.2, 1.7)}px`;
    element.style.background = randomItem(colors);
    element.style.borderRadius = randomItem(shapes);
    element.style.opacity = "0";
    element.style.transform = `
      translate3d(${x}px, ${y}px, 0)
      rotate(${rotation}deg)
      rotateX(${rotationX}deg)
      rotateY(${rotationY}deg)
      scale(${scale})
    `;

    shower.append(element);

    petals.push({
      element,
      x,
      y,
      vx: random(-30, 30),
      vy: random(65, 120),
      gravity: random(12, 26),
      wind: random(-8, 8),
      sway: random(15, 55),
      swaySpeed: random(1.4, 3.5),
      swayPhase: random(0, Math.PI * 2),
      rotation,
      rotationX,
      rotationY,
      spin: random(-220, 220),
      spinX: random(-190, 190),
      spinY: random(-260, 260),
      scale,
      baseOpacity: random(0.55, 0.9),
      delay: random(0, 700),
      lifetime: random(5800, 8600),
    });
  }

  document.body.append(shower);

  let startTime = null;
  let previousTime = null;

  function animate(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
      previousTime = currentTime;
    }

    const elapsed = currentTime - startTime;
    const delta = Math.min((currentTime - previousTime) / 1000, 0.032);
    previousTime = currentTime;

    petals.forEach((petal) => {
      if (elapsed < petal.delay) {
        petal.element.style.opacity = "0";
        return;
      }

      const age = elapsed - petal.delay;

      if (age >= petal.lifetime) {
        petal.element.style.display = "none";
        return;
      }

      const time = age / 1000;

      petal.vy += petal.gravity * delta;
      petal.vx +=
        Math.sin(time * 0.75 + petal.swayPhase) * petal.wind * delta;
      petal.x += petal.vx * delta;
      petal.y += petal.vy * delta;

      petal.rotation += petal.spin * delta;
      petal.rotationX += petal.spinX * delta;
      petal.rotationY += petal.spinY * delta;

      const sway =
        Math.sin(time * petal.swaySpeed + petal.swayPhase) * petal.sway;
      const flutterY =
        Math.sin(time * petal.swaySpeed * 2.2 + petal.swayPhase) * 5;
      const flip =
        0.35 +
        Math.abs(Math.cos(time * petal.swaySpeed * 1.8 + petal.swayPhase)) *
          0.65;

      const fadeInDuration = 250;
      let opacity = petal.baseOpacity * Math.min(1, age / fadeInDuration);

      const fadeStart = viewportHeight * 0.82;
      if (petal.y > fadeStart) {
        const bottomFade =
          1 - (petal.y - fadeStart) / (viewportHeight + 100 - fadeStart);
        opacity *= Math.max(0, bottomFade);
      }

      if (age > petal.lifetime * 0.82) {
        const lifeFade =
          1 - (age - petal.lifetime * 0.82) / (petal.lifetime * 0.18);
        opacity *= Math.max(0, lifeFade);
      }

      petal.element.style.opacity = Math.max(0, opacity);
      petal.element.style.transform = `
        translate3d(
          ${petal.x + sway}px,
          ${petal.y + flutterY}px,
          0
        )
        rotate(${petal.rotation}deg)
        rotateX(${petal.rotationX}deg)
        rotateY(${petal.rotationY}deg)
        scale(${petal.scale})
        scaleX(${flip})
      `;

      if (petal.y > viewportHeight + 120) {
        petal.element.style.display = "none";
      }
    });

    if (elapsed < 10000) {
      requestAnimationFrame(animate);
    } else {
      shower.remove();
    }
  }

  requestAnimationFrame(animate);

  return shower;
}
