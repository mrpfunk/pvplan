/**
 * Circuit Breaker (Leitungsschutzschalter / LS) Symbol Generator
 * Creates an SVG group element containing a circuit breaker symbol
 */
window.createCircuitBreaker = function(options = {}) {
  const xmlns = 'http://www.w3.org/2000/svg';
  const x = Number(options.x || 0);
  const y = Number(options.y || 0);
  const rotation = Number(options.rotation || 0);
  const stroke = options.stroke || '#000';

  const g = document.createElementNS(xmlns, 'g');

  // Main body (rectangle)
  const lsRect = document.createElementNS(xmlns, 'rect');
  lsRect.setAttribute('x', '-8');
  lsRect.setAttribute('y', '-6');
  lsRect.setAttribute('width', '16');
  lsRect.setAttribute('height', '12');
  lsRect.setAttribute('fill', 'none');
  lsRect.setAttribute('stroke', stroke);
  lsRect.setAttribute('stroke-width', '2');
  g.appendChild(lsRect);

  // Circuit breaker symbol (curved line inside)
  const lsCurve = document.createElementNS(xmlns, 'path');
  lsCurve.setAttribute('d', 'M -5 -2 Q 0 -4 5 -2 Q 0 0 -5 2');
  lsCurve.setAttribute('fill', 'none');
  lsCurve.setAttribute('stroke', stroke);
  lsCurve.setAttribute('stroke-width', '1.5');
  g.appendChild(lsCurve);

  // Connection points
  const lsLine1 = document.createElementNS(xmlns, 'line');
  lsLine1.setAttribute('x1', '0');
  lsLine1.setAttribute('y1', '-6');
  lsLine1.setAttribute('x2', '0');
  lsLine1.setAttribute('y2', '-10');
  lsLine1.setAttribute('stroke', stroke);
  lsLine1.setAttribute('stroke-width', '2');
  g.appendChild(lsLine1);

  const lsLine2 = document.createElementNS(xmlns, 'line');
  lsLine2.setAttribute('x1', '0');
  lsLine2.setAttribute('y1', '6');
  lsLine2.setAttribute('x2', '0');
  lsLine2.setAttribute('y2', '10');
  lsLine2.setAttribute('stroke', stroke);
  lsLine2.setAttribute('stroke-width', '2');
  g.appendChild(lsLine2);

  // Set transform for positioning and rotation
  if (rotation !== 0) {
    g.setAttribute('transform', `translate(${x},${y}) rotate(${rotation})`);
  } else {
    g.setAttribute('transform', `translate(${x},${y})`);
  }

  return g;
};
