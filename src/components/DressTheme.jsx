// The "Dress Theme" card that follows Haldi, Starry Night, and Anand Karaj -
// a title, a colour-name subtitle, and a swatch row.
export default function DressTheme({ title, sub, swatches }) {
  return (
    <div className="dress-theme reveal">
      <span className="dress-theme-label">Dress Theme</span>
      <p className="dress-theme-title">{title}</p>
      <p className="dress-theme-sub">{sub}</p>
      <ul className="dress-swatches" aria-label="Colour palette">
        {swatches.map(({ color, label }) => (
          <li key={color}>
            <i style={{ "--swatch": color }} title={color} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
