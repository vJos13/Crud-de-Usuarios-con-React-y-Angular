// Logos de los frameworks en SVG (sin dependencias)

export function ReactLogo(props) {
  return (
    <svg viewBox="-11.5 -10.23 23 20.46" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" {...props}>
      <circle r="2.05" fill="currentColor" stroke="none" />
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </svg>
  );
}

export function AngularLogo(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 1.5 2.4 4.9l1.5 12.6L12 22.5l8.1-5 1.5-12.6Z" fill="var(--angular)" />
      <path d="M12 4.3 6.3 17.1h2.1l1.15-2.85h4.9l1.15 2.85h2.1Zm-1.65 8.1L12 8.4l1.65 4Z" fill="#fff" />
    </svg>
  );
}
