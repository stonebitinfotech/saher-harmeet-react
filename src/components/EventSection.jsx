// One event block: <section class="welcome-section section-pad"> holding a
// reveal-animated .event-card. Children are the card's exact inner content.
export default function EventSection({ id, children }) {
  return (
    <section id={id} className="welcome-section section-pad">
      <div className="section-shell">
        <div className="event-card reveal">{children}</div>
      </div>
    </section>
  );
}
