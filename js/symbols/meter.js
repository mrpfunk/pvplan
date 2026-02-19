/**
 * Meter (Zweirichtungszähler) Symbol Generator
 * Creates an SVG group element containing a bidirectional meter symbol
 */
window.createMeter = function(options = {}) {
  const xmlns = 'http://www.w3.org/2000/svg';
  const x = Number(options.x || 0);
  const y = Number(options.y || 0);
  const label = options.label || 'Z1';
  const stroke = options.stroke || '#000';

  const g = document.createElementNS(xmlns, 'g');

  // Main body (rectangle)
  const meterRect = document.createElementNS(xmlns, 'rect');
  meterRect.setAttribute('x', '-27');
  meterRect.setAttribute('y', '-25');
  meterRect.setAttribute('width', '50');
  meterRect.setAttribute('height', '50');
  meterRect.setAttribute('fill', 'none');
  meterRect.setAttribute('stroke', stroke);
  meterRect.setAttribute('stroke-width', '2');
  g.appendChild(meterRect);

  // Label text (e.g., "Z1")
  const labelText = document.createElementNS(xmlns, 'text');
  labelText.setAttribute('x', '0');
  labelText.setAttribute('y', '5');
  labelText.setAttribute('text-anchor', 'middle');
  labelText.setAttribute('font-family', 'Arial');
  labelText.setAttribute('font-size', '10');
  labelText.textContent = label;
  g.appendChild(labelText);

  // Bidirectional arrow
  const bidirectionalArrow = document.createElementNS(xmlns, 'path');
  bidirectionalArrow.setAttribute('d', 'M -12 -15 L -15 -12 L -12 -9 M -15 -12 L 15 -12 M 12 -15 L 15 -12 L 12 -9');
  bidirectionalArrow.setAttribute('fill', 'none');
  bidirectionalArrow.setAttribute('stroke', stroke);
  bidirectionalArrow.setAttribute('stroke-width', '1.5');
  g.appendChild(bidirectionalArrow);

  // Set transform for positioning
  g.setAttribute('transform', `translate(${x},${y})`);

  return g;
};
