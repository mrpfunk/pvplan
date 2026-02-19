/**
 * Inverter (Wechselrichter) Symbol Generator
 * Creates an SVG group element containing an inverter symbol
 */
window.createInverter = function(options = {}) {
  const xmlns = 'http://www.w3.org/2000/svg';
  const x = Number(options.x || 0);
  const y = Number(options.y || 0);
  const stroke = options.stroke || '#000';

  const g = document.createElementNS(xmlns, 'g');

  // Main body (rectangle)
  const invRect = document.createElementNS(xmlns, 'rect');
  invRect.setAttribute('x', '-30');
  invRect.setAttribute('y', '-25');
  invRect.setAttribute('width', '60');
  invRect.setAttribute('height', '50');
  invRect.setAttribute('fill', 'none');
  invRect.setAttribute('stroke', stroke);
  invRect.setAttribute('stroke-width', '2');
  g.appendChild(invRect);

  // DC input symbol (=)
  const dcLine1 = document.createElementNS(xmlns, 'line');
  dcLine1.setAttribute('x1', '-20');
  dcLine1.setAttribute('y1', '-5');
  dcLine1.setAttribute('x2', '-10');
  dcLine1.setAttribute('y2', '-5');
  dcLine1.setAttribute('stroke', stroke);
  dcLine1.setAttribute('stroke-width', '2');
  g.appendChild(dcLine1);

  const dcLine2 = document.createElementNS(xmlns, 'line');
  dcLine2.setAttribute('x1', '-20');
  dcLine2.setAttribute('y1', '5');
  dcLine2.setAttribute('x2', '-10');
  dcLine2.setAttribute('y2', '5');
  dcLine2.setAttribute('stroke', stroke);
  dcLine2.setAttribute('stroke-width', '2');
  g.appendChild(dcLine2);

  // AC output symbol (~)
  const acPath = document.createElementNS(xmlns, 'path');
  acPath.setAttribute('d', 'M 10 -5 Q 15 -10 20 -5 Q 25 0 30 -5');
  acPath.setAttribute('fill', 'none');
  acPath.setAttribute('stroke', stroke);
  acPath.setAttribute('stroke-width', '2');
  g.appendChild(acPath);

  // Set transform for positioning
  g.setAttribute('transform', `translate(${x},${y})`);

  return g;
};
