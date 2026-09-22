// The repeated "<p class='event-venue'><a><svg pin/> address</a></p>" pattern,
// now linking to each venue's real Google Maps URL.
export default function EventVenue({ href, children }) {
  return (
    <p className="event-venue">
      <a href={href} target="_blank" rel="noreferrer">
        <svg
          className="event-pin"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
            fill="currentColor"
          />
        </svg>{" "}
        {children}
      </a>
    </p>
  );
}
