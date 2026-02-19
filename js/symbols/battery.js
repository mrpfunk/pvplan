/**
 * Battery Symbol Generator
 * Creates an SVG group element containing a battery symbol
 */
window.createBattery = function(options = {}) {
  const xmlns = 'http://www.w3.org/2000/svg';
  const x = Number(options.x || 0);
  const y = Number(options.y || 0);
  const stroke = options.stroke || '#000';

  const g = document.createElementNS(xmlns, 'g');

  // Battery cells - alternating long and short lines
  const longLine1 = document.createElementNS(xmlns, 'line');
  longLine1.setAttribute('x1', '-15');
  longLine1.setAttribute('y1', '-20');
  longLine1.setAttribute('x2', '-15');
  longLine1.setAttribute('y2', '20');
  longLine1.setAttribute('stroke', stroke);
  longLine1.setAttribute('stroke-width', '3');
  g.appendChild(longLine1);

  const shortLine1 = document.createElementNS(xmlns, 'line');
  shortLine1.setAttribute('x1', '-10');
  shortLine1.setAttribute('y1', '-15');
  shortLine1.setAttribute('x2', '-10');
  shortLine1.setAttribute('y2', '15');
  shortLine1.setAttribute('stroke', stroke);
  shortLine1.setAttribute('stroke-width', '2');
  g.appendChild(shortLine1);

  const longLine2 = document.createElementNS(xmlns, 'line');
  longLine2.setAttribute('x1', '-5');
  longLine2.setAttribute('y1', '-20');
  longLine2.setAttribute('x2', '-5');
  longLine2.setAttribute('y2', '20');
  longLine2.setAttribute('stroke', stroke);
  longLine2.setAttribute('stroke-width', '3');
  g.appendChild(longLine2);

  const shortLine2 = document.createElementNS(xmlns, 'line');
  shortLine2.setAttribute('x1', '0');
  shortLine2.setAttribute('y1', '-15');
  shortLine2.setAttribute('x2', '0');
  shortLine2.setAttribute('y2', '15');
  shortLine2.setAttribute('stroke', stroke);
  shortLine2.setAttribute('stroke-width', '2');
  g.appendChild(shortLine2);

  // Set transform for positioning
  g.setAttribute('transform', `translate(${x},${y})`);

  return g;
};
