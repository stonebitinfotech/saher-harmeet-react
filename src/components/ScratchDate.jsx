import { useRef } from "react";
import { config } from "../config.js";
import { useScratchCard } from "../hooks/useScratchCard.js";
import { useCountdown } from "../hooks/useCountdown.js";

// Scratch-to-reveal countdown card. Markup matches the original #date section;
// the canvas painting / scratch detection / petal shower live in useScratchCard,
// the ticking numbers in useCountdown.
export default function ScratchDate() {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const headingRef = useRef(null);
  const noteRef = useRef(null);

  useScratchCard({ canvasRef, cardRef, headingRef, noteRef });
  const countdown = useCountdown(config.wedding.isoDate);

  return (
    <section id="date" className="scratch-section section-pad">
      <div className="section-shell">
        <header className="section-heading reveal">
          {/* <span class="eyebrow">A date to hold close</span> */}
          <h2 id="scratchHeading" ref={headingRef}>
            A date to hold close
          </h2>
          <span className="ornament" aria-hidden="true">
            <i />
          </span>
        </header>

        <div className="scratch-frame-shell reveal">
          <img
            src="/assets/images/scratch-frame.webp"
            alt=""
            className="scratch-frame-overlay"
            aria-hidden="true"
          />

          <div id="scratchCard" className="scratch-wrap" ref={cardRef}>
            <div className="date-reveal" aria-live="polite">
              <span className="date-kicker">Counting down to forever</span>
              <div
                className="countdown"
                id="weddingCountdown"
                role="timer"
                aria-label="Time remaining until the wedding"
              >
                <div className="countdown-unit">
                  <span className="countdown-value" id="countdownDays">
                    {countdown.days}
                  </span>
                  <span className="countdown-label">Days</span>
                </div>
                <div className="countdown-unit">
                  <span className="countdown-value" id="countdownHours">
                    {countdown.hours}
                  </span>
                  <span className="countdown-label">Hrs</span>
                </div>
                <div className="countdown-unit">
                  <span className="countdown-value" id="countdownMinutes">
                    {countdown.minutes}
                  </span>
                  <span className="countdown-label">Min</span>
                </div>
                <div className="countdown-unit">
                  <span className="countdown-value" id="countdownSeconds">
                    {countdown.seconds}
                  </span>
                  <span className="countdown-label">Sec</span>
                </div>
              </div>
            </div>

            <canvas
              id="scratchCanvas"
              className="scratch-canvas"
              role="button"
              tabIndex={0}
              aria-label="Scratch to reveal the wedding countdown. Press Enter to reveal."
              ref={canvasRef}
            />
          </div>
        </div>

        <p id="scratchNote" className="scratch-note reveal" ref={noteRef}>
          Use your finger or cursor to uncover the moment.
        </p>
      </div>
    </section>
  );
}
