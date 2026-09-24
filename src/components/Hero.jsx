import { useEffect, useRef, useState } from "react";
import { config } from "../config.js";

// Renders the couple's first name in a <span>, rest of the name as plain text -
// exactly what setName() produced in app.js ("Harmeet Singh" -> <span>Harmeet</span> Singh).
function SplitName({ name }) {
  const [first, ...rest] = name.split(" ");
  return (
    <>
      <span>{first}</span>
      {" " + rest.join(" ")}
    </>
  );
}

// Hero / opening section + the floating music toggle + the <audio> element -
// all three were direct children of <main> in the original markup, so they
// stay together here. Port of initializeOpening() and initializeMusic().
export default function Hero() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // body.intro-locked mirrors the opened state, same as the original.
  useEffect(() => {
    document.body.classList.toggle("intro-locked", !opened);
  }, [opened]);

  // Keep `playing` in sync with the audio element (updateMusicControl()).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const sync = () => setPlaying(!audio.paused);
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    sync();
    return () => {
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
    };
  }, []);

  function openInvitation() {
    if (opened) return;
    setOpened(true);
    videoRef.current?.play().catch(() => undefined);
    audioRef.current?.play().catch(() => undefined);
  }

  function onHeroKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") openInvitation();
  }

  async function toggleMusic(event) {
    event.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        // Playback can fail if the music file is missing.
      }
    } else {
      audio.pause();
    }
  }

  return (
    <>
      <audio ref={audioRef} id="backgroundMusic" src={config.media.music} loop preload="none" />

      <button
        id="musicToggle"
        className={`music-toggle${playing ? " is-playing" : ""}`}
        type="button"
        aria-label={playing ? "Pause background music" : "Play background music"}
        onClick={toggleMusic}
      >
        <span className="music-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span id="musicLabel">Music</span>
      </button>

      <section
        id="hero"
        className={`hero ${opened ? "is-open" : "is-closed"}`}
        role={opened ? undefined : "button"}
        tabIndex={opened ? -1 : 0}
        aria-label={opened ? undefined : "Tap to open the wedding invitation"}
        onClick={openInvitation}
        onKeyDown={onHeroKeyDown}
      >
        <video
          ref={videoRef}
          id="introVideo"
          className="hero-video"
          muted
          playsInline
          preload="metadata"
          poster={config.media.introPoster}
        >
          <source id="introVideoSource" src={config.media.introVideo} type="video/mp4" />
        </video>

        <div className="hero-veil" />

        <div id="openingMark" className="opening-mark" aria-hidden={opened ? "true" : undefined}>
          <span className="opening-label" />
          <span className="opening-ripple" />
        </div>

        <div className="hero-content">
          <div className="bismillah-block">
            <img
              className="bismillah-mark"
              src="/assets/images/ganeshay.png"
              width="1774"
              height="887"
              alt="Om Shri Ganeshay Namah"
            />
            <p className="translation">{config.copy.bismillahTranslation}</p>
            <p className="bismillah-sanskrit" lang="sa">
              {config.copy.bismillahSanskrit}
            </p>
          </div>
          <p>&amp;</p>
          <p className="hero-welcome">{config.copy.welcomeLine}</p>

          <div className="couple-names">
            <div>
              <h1 id="brideName">
                <SplitName name={config.couple.bride.name} />
              </h1>
              <p>{config.couple.bride.relation}</p>
              <small>{config.couple.bride.parents}</small>
            </div>

            {/* The connector between the two names reads "With" (client copy),
                so it's sized down from the big "&" glyph this class was
                built for - inline so it also beats the wider-screen override. */}
            <span className="name-ampersand" style={{ fontSize: "14px" }}>
              With
            </span>

            <div>
              <h1 id="groomName">
                <SplitName name={config.couple.groom.name} />
              </h1>
              <p>{config.couple.groom.relation}</p>
              <small>{config.couple.groom.parents}</small>
            </div>
          </div>

          <p className="hero-invitation">{config.copy.invitation}</p>
          <p className="hero-closing">{config.copy.heroClosing}</p>

          <a className="scroll-cue" href="#date" onClick={(e) => e.stopPropagation()}>
            <span>Scroll</span>
            <i aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
