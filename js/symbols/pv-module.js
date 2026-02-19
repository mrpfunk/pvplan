/**
 * PV Module Symbol Generator
 * Creates an SVG group element containing a photovoltaic module symbol
 */
window.createPVModule = function(options = {}) {
  const xmlns = 'http://www.w3.org/2000/svg';
  const x = Number(options.x || 0);
  const y = Number(options.y || 0);
  const width = Number(options.width || 50);
  const height = Number(options.height || 30);
  const stroke = options.stroke || '#000';

  const g = document.createElementNS(xmlns, 'g');

  // Main rectangle (module outline)
  const pvRect = document.createElementNS(xmlns, 'rect');
  pvRect.setAttribute('x', String(-width / 2));
  pvRect.setAttribute('y', String(-height / 2));
  pvRect.setAttribute('width', String(width));
  pvRect.setAttribute('height', String(height));
  pvRect.setAttribute('fill', 'none');
  pvRect.setAttribute('stroke', stroke);
  pvRect.setAttribute('stroke-width', '2');

  // Solar cell grid pattern (3x2 cells)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const cell = document.createElementNS(xmlns, 'rect');
      cell.setAttribute('x', String(-20 + i * 13));
      cell.setAttribute('y', String(-10 + j * 10));
      cell.setAttribute('width', '10');
      cell.setAttribute('height', '8');
      cell.setAttribute('fill', 'none');
      cell.setAttribute('stroke', stroke);
      cell.setAttribute('stroke-width', '0.5');
      g.appendChild(cell);
    }
  }

  // Append the main rectangle after cells (so it's on top)
  g.appendChild(pvRect);

  // Set transform for positioning
  g.setAttribute('transform', `translate(${x},${y})`);

  return g;
};
