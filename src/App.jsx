import { Fragment, useEffect } from "react";
import { config } from "./config.js";

import { useThemeVars } from "./hooks/useThemeVars.js";
import { useAntiCopy } from "./hooks/useAntiCopy.js";
import { useReveal } from "./hooks/useReveal.js";
import { useLinkConfig } from "./hooks/useLinkConfig.js";

import Hero from "./components/Hero.jsx";
import ScratchDate from "./components/ScratchDate.jsx";
import EventSection from "./components/EventSection.jsx";
import EventVenue from "./components/EventVenue.jsx";
import EventFigure from "./components/EventFigure.jsx";
import FloralDivider from "./components/FloralDivider.jsx";
import AttireNote from "./components/AttireNote.jsx";
import DressTheme from "./components/DressTheme.jsx";
import Closing from "./components/Closing.jsx";

export default function App() {
  useThemeVars(config.theme);
  useAntiCopy();
  const { hidden, ready } = useLinkConfig();
  useReveal(ready);
  const show = (key) => !hidden.has(key);

  useEffect(() => {
    document.title = config.site.title;
  }, []);

  // Each entry is one personalized-link section. Dividers are added between
  // whichever groups end up visible, below, so hiding one never leaves a
  // doubled-up or missing floral divider.
  const groups = [
    {
      key: "sunder-kand",
      visible: show("sunder-kand"),
      node: (
        <>
          <EventSection id="welcome">
            <span className="eyebrow">
              With Devotion, Grace &amp; Blessing for a New Beginning
            </span>
            <h2>Sunder Kand Path</h2>
            <span className="ornament" aria-hidden="true">
              <i />
            </span>
            <p className="event-when">8th December 2026</p>
            <p className="event-when">8:00 PM onwards</p>
            <p className="event-note">Followed by Langar Prashad</p>
            <EventVenue href="https://maps.app.goo.gl/VypHqawoh9TcGFMKA?g_st=ic">
              Venue: Shri Ram Mandir, Bhatar, Surat
            </EventVenue>
          </EventSection>

          <AttireNote>Attire: Traditional</AttireNote>
        </>
      ),
    },
    {
      key: "mehndi",
      visible: show("mehndi"),
      node: (
        <>
          <EventSection id="mehndi">
            <span className="eyebrow">
              In every swirl of henna, a story of us is told
            </span>
            <p className="event-lead">Come be a part of</p>
            <h2>Saher&apos;s Dhol &amp; Heena Mehfil</h2>
            <span className="ornament" aria-hidden="true">
              <i />
            </span>
            <p className="event-body">
              We are kicking off the wedding madness please join us for an
              evening of mehndi, music and lots of dancing to celebrate.
            </p>
            <p className="event-when">9th December 2026</p>
            <p className="event-when">5:00 PM onwards</p>
            <EventVenue href="https://maps.app.goo.gl/gb1doFZMG3kX9ugM9?g_st=ic">
              Rajhans Belizia, Dumas Road, Surat
            </EventVenue>
          </EventSection>

          <AttireNote>Attire: Comfortable Ethnic Wear</AttireNote>
        </>
      ),
    },
    {
      key: "haldi-sangeet",
      visible: show("haldi") || show("sangeet"),
      node: (
        <div className="haldi-block">
          {show("haldi") && (
            <>
              <EventSection id="haldi">
                <h2>Haldi by the River &amp; Brunch Under the Sun!</h2>
                <span className="ornament" aria-hidden="true">
                  <i />
                </span>
                <p className="event-body">
                  Come adorn the couple from head to toe with yellow sunshine
                  and watch them glow.
                </p>
                <p className="event-when">10th December 2026</p>
                <p className="event-when">11:30 AM onwards</p>
                <EventVenue href="https://maps.app.goo.gl/cL8A42gVckADpZm96?g_st=ic">
                  River Side, 72 Villa, Silent Zone, Near New Weekend Address,
                  Opp. Airport, Surat
                </EventVenue>
              </EventSection>

              <DressTheme
                title="The Golden Hour"
                sub="Yellow · Lime Yellow · Orange"
                swatches={[
                  { color: "#F7C41F", label: "Yellow" },
                  { color: "#D4DE3F", label: "Lime Yellow" },
                  { color: "#F28A1E", label: "Orange" },
                ]}
              />
            </>
          )}

          {show("haldi") && show("sangeet") && <FloralDivider />}

          {show("sangeet") && (
            <>
              <EventSection id="starry">
                <p className="event-lead">Join us for the</p>
                <h2>Engagement &amp; Sangeet night</h2>
                <span className="ornament" aria-hidden="true">
                  <i />
                </span>
                <p className="event-body">
                  Get ready for an enchanted evening as we dance our way
                  towards our beginning of forever.
                </p>
                <p className="event-when">10th December 2026</p>
                <p className="event-when">7:30 PM onwards</p>
                <EventVenue href="https://maps.app.goo.gl/cL8A42gVckADpZm96?g_st=ic">
                  72 Villa, Silent Zone, Near New Weekend Address, Opp. Surat
                  Airport
                </EventVenue>
              </EventSection>

              <DressTheme
                title="Modern Bollywood Glam"
                sub="Blue · Silver · Red · Black · Emerald Green"
                swatches={[
                  { color: "#1F4FA3", label: "Blue" },
                  { color: "#C2C6CE", label: "Silver" },
                  { color: "#C41E3A", label: "Red" },
                  { color: "#151515", label: "Black" },
                  { color: "#0E8A5F", label: "Emerald Green" },
                ]}
              />
            </>
          )}
        </div>
      ),
    },
    {
      key: "anand-karaj",
      visible: show("anand-karaj"),
      node: (
        <>
          <EventSection id="anandkaraj">
            <span className="eyebrow">The Celebration</span>
            <h2>Anand Karaj</h2>
            <span className="ornament" aria-hidden="true">
              <i />
            </span>
            <p className="event-body">
              Celebrate our union as we take our sacred steps in Anand Karaj.
            </p>
            <p className="event-when">Dec 11th | 2026</p>
            <p className="event-when">11:30 AM</p>
            <EventVenue href="https://maps.app.goo.gl/u5bmiQ36fidv5i6MA">
              Gurudwara Guru Tegh Bahadur Sahib, Guru Nanak Devi Marg, Bhatar
              Road, Surat
            </EventVenue>
            <span className="event-split" aria-hidden="true" />
            <p className="event-note">Lunch · 1 PM onwards</p>
            <EventVenue href="https://maps.app.goo.gl/Yoer6GYrZmut6dQL6?g_st=ic">
              Sapphire Banquet Hall, Euphoria The Fine Dine, Gaurav Path Road,
              Behind Baghban Kratos, Surat
            </EventVenue>
          </EventSection>

          <EventFigure
            name="anandkaraj"
            src="/assets/images/anand-karaj.png"
            alt="Saher and Harmeet at the Anand Karaj ceremony"
          />

          <DressTheme
            title="Royal Traditional"
            sub="Shades of Pastels"
            swatches={[
              { color: "#F4BFCB", label: "Blush Pink" },
              { color: "#FBCDAA", label: "Peach" },
              { color: "#F6E3A1", label: "Butter Yellow" },
              { color: "#B9E2CD", label: "Mint" },
              { color: "#AFD0EA", label: "Powder Blue" },
              { color: "#CDBAE6", label: "Lavender" },
            ]}
          />

          <p className="bidaai-note reveal">Bidaai · 6:30 PM</p>

          <div className="doli-figure reveal">
            <img src="/assets/images/Doli2.png" alt="Saher's doli bidaai" />
          </div>
        </>
      ),
    },
  ].filter((g) => g.visible);

  return (
    <main id="invitation">
      <Hero />

      <FloralDivider />

      <ScratchDate />

      {ready &&
        groups.map((g) => (
          <Fragment key={g.key}>
            <FloralDivider />
            {g.node}
          </Fragment>
        ))}

      {ready && <FloralDivider />}

      <Closing />
    </main>
  );
}
