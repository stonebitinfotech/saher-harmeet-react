import { config } from "../config.js";

export default function Closing() {
  return (
    <footer className="closing-section">
      <div className="closing-inner reveal">
        <p className="closing-kicker">Seeking your presence</p>
        <p className="closing-families">{config.copy.closing}</p>
        <img
          className="closing-monogram"
          src="/assets/images/hs.png"
          width="1254"
          height="1254"
          alt="Harmeet & Saher"
        />
        <span className="closing-rule" aria-hidden="true" />
        <p className="closing-date">11th December 2026</p>
        <p className="closing-hashtag">#SAHMEET</p>
      </div>
    </footer>
  );
}
