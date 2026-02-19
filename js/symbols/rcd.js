/**
 * RCD (Residual Current Device / FI-Schutzschalter) Symbol Generator
 * Creates an SVG group element containing an RCD symbol
 */
window.createRCD = function(options = {}) {
  const xmlns = 'http://www.w3.org/2000/svg';
  const x = Number(options.x || 0);
  const y = Number(options.y || 0);
  const rotation = Number(options.rotation || 0);
  const stroke = options.stroke || '#000';

  const g = document.createElementNS(xmlns, 'g');

  // Main body (rectangle) - similar size to circuit breaker
  const rcdRect = document.createElementNS(xmlns, 'rect');
  rcdRect.setAttribute('x', '-8');
  rcdRect.setAttribute('y', '-6');
  rcdRect.setAttribute('width', '16');
  rcdRect.setAttribute('height', '12');
  rcdRect.setAttribute('fill', 'none');
  rcdRect.setAttribute('stroke', stroke);
  rcdRect.setAttribute('stroke-width', '2');
  g.appendChild(rcdRect);

  // Single angled line to show separation (from top-left, diagonal, then down)
  const separationLine = document.createElementNS(xmlns, 'polyline');
  separationLine.setAttribute('points', '-6,-4 0,-1 0,4');
  separationLine.setAttribute('fill', 'none');
  separationLine.setAttribute('stroke', stroke);
  separationLine.setAttribute('stroke-width', '1.5');
  g.appendChild(separationLine);

  // Connection points (top and bottom)
  const line1 = document.createElementNS(xmlns, 'line');
  line1.setAttribute('x1', '0');
  line1.setAttribute('y1', '-6');
  line1.setAttribute('x2', '0');
  line1.setAttribute('y2', '-10');
  line1.setAttribute('stroke', stroke);
  line1.setAttribute('stroke-width', '2');
  g.appendChild(line1);

  const line2 = document.createElementNS(xmlns, 'line');
  line2.setAttribute('x1', '0');
  line2.setAttribute('y1', '6');
  line2.setAttribute('x2', '0');
  line2.setAttribute('y2', '10');
  line2.setAttribute('stroke', stroke);
  line2.setAttribute('stroke-width', '2');
  g.appendChild(line2);

  // Set transform for positioning and rotation
  if (rotation !== 0) {
    g.setAttribute('transform', `translate(${x},${y}) rotate(${rotation})`);
  } else {
    g.setAttribute('transform', `translate(${x},${y})`);
  }

  return g;
};
