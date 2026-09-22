// The "<div class='{name}-figure reveal'><img/></div>" illustration block
// used after the Anand Karaj section.
export default function EventFigure({ name, src, alt }) {
  return (
    <div className={`${name}-figure reveal`}>
      <img src={src} alt={alt} />
    </div>
  );
}
