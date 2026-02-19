/**
 * Selective Circuit Breaker (SLS - Selektiver Leitungsschutzschalter) Symbol Generator
 * Creates an SVG group element containing an SLS symbol
 */
window.createSLS = function(options = {}) {
  const xmlns = 'http://www.w3.org/2000/svg';
  const x = Number(options.x || 0);
  const y = Number(options.y || 0);
  const rotation = Number(options.rotation || 0);
  const stroke = options.stroke || '#000';

  const g = document.createElementNS(xmlns, 'g');

  // Main body (rectangle)
  const slsRect = document.createElementNS(xmlns, 'rect');
  slsRect.setAttribute('x', '-12');
  slsRect.setAttribute('y', '-8');
  slsRect.setAttribute('width', '24');
  slsRect.setAttribute('height', '16');
  slsRect.setAttribute('fill', 'none');
  slsRect.setAttribute('stroke', stroke);
  slsRect.setAttribute('stroke-width', '2');
  g.appendChild(slsRect);

  // SLS symbol (curved line with S-shape inside)
  const slsCurve = document.createElementNS(xmlns, 'path');
  slsCurve.setAttribute('d', 'M -8 -4 Q -4 -6 0 -4 Q 4 -2 8 -4 M -8 4 Q -4 2 0 4 Q 4 6 8 4');
  slsCurve.setAttribute('fill', 'none');
  slsCurve.setAttribute('stroke', stroke);
  slsCurve.setAttribute('stroke-width', '1.5');
  g.appendChild(slsCurve);

  // Connection points
  const slsLine1 = document.createElementNS(xmlns, 'line');
  slsLine1.setAttribute('x1', '0');
  slsLine1.setAttribute('y1', '-8');
  slsLine1.setAttribute('x2', '0');
  slsLine1.setAttribute('y2', '-12');
  slsLine1.setAttribute('stroke', stroke);
  slsLine1.setAttribute('stroke-width', '2');
  g.appendChild(slsLine1);

  const slsLine2 = document.createElementNS(xmlns, 'line');
  slsLine2.setAttribute('x1', '0');
  slsLine2.setAttribute('y1', '8');
  slsLine2.setAttribute('x2', '0');
  slsLine2.setAttribute('y2', '12');
  slsLine2.setAttribute('stroke', stroke);
  slsLine2.setAttribute('stroke-width', '2');
  g.appendChild(slsLine2);

  // Set transform for positioning and rotation
  if (rotation !== 0) {
    g.setAttribute('transform', `translate(${x},${y}) rotate(${rotation})`);
  } else {
    g.setAttribute('transform', `translate(${x},${y})`);
  }

  return g;
};
