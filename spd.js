window.createSPD = function(label = 'SPD', options = {}) {
    // Creates a <g> element containing an SPD symbol: a rectangle, ground connection and a grounding symbol.
    // Internal coordinates are relative to (0,0). The group supports positioning via either
    // options.x/options.y at creation or by setting attributes 'x' and 'y' on the returned <g> later.

    const xmlns = 'http://www.w3.org/2000/svg';
    const optX = Number(options.x || 0);
    const optY = Number(options.y || 0);
    const width = Number(options.width || 10);
    const height = Number(options.height || 15);
    const stroke = options.stroke || '#000';
    const fill = options.fill || 'none';

    const g = document.createElementNS(xmlns, 'g');

    // create rect at local 0,0
    const box = document.createElementNS(xmlns, 'rect');
    box.setAttribute('x', '0');
    box.setAttribute('y', '0');
    box.setAttribute('width', String(width));
    box.setAttribute('height', String(height));
    box.setAttribute('fill', fill);
    box.setAttribute('stroke', stroke);
    box.setAttribute('stroke-width', '2');
    g.appendChild(box);

    // ground connection line from middle-bottom of box downwards (local coords)
    const groundLine = document.createElementNS(xmlns, 'line');
    groundLine.setAttribute('x1', String(width / 2));
    groundLine.setAttribute('y1', String(height));
    groundLine.setAttribute('x2', String(width / 2));
    groundLine.setAttribute('y2', String(height + 10));
    groundLine.setAttribute('stroke', stroke);
    groundLine.setAttribute('stroke-width', '2');
    g.appendChild(groundLine);

    // ground symbol: three horizontal lines centered at same x (local coords)
    const groundTopY = height + 10;
    for (let i = 0; i < 3; i++) {
        const gl = document.createElementNS(xmlns, 'line');
        const half = 6 - i * 2; // decreasing half width
        gl.setAttribute('x1', String(width / 2 - half));
        gl.setAttribute('y1', String(groundTopY + i * 3));
        gl.setAttribute('x2', String(width / 2 + half));
        gl.setAttribute('y2', String(groundTopY + i * 3));
        gl.setAttribute('stroke', stroke);
        gl.setAttribute('stroke-width', '1');
        g.appendChild(gl);
    }

    // SPD symbol: arrow pointing down (to ground)
    const arrowTop = 0;  // Start at top of rectangle
    const arrowBottom = height * 0.6;
    
    // vertical line of arrow
    const arrowLine = document.createElementNS(xmlns, 'line');
    arrowLine.setAttribute('x1', String(width / 2));
    arrowLine.setAttribute('y1', String(arrowTop));
    arrowLine.setAttribute('x2', String(width / 2));
    arrowLine.setAttribute('y2', String(arrowBottom));
    arrowLine.setAttribute('stroke', stroke);
    arrowLine.setAttribute('stroke-width', '1.5');
    g.appendChild(arrowLine);
    
    // arrow head (two lines forming a V)
    const arrowHeadSize = width * 0.3;
    const arrowLeft = document.createElementNS(xmlns, 'line');
    arrowLeft.setAttribute('x1', String(width / 2 - arrowHeadSize));
    arrowLeft.setAttribute('y1', String(arrowBottom - arrowHeadSize));
    arrowLeft.setAttribute('x2', String(width / 2));
    arrowLeft.setAttribute('y2', String(arrowBottom));
    arrowLeft.setAttribute('stroke', stroke);
    arrowLeft.setAttribute('stroke-width', '1.5');
    g.appendChild(arrowLeft);
    
    const arrowRight = document.createElementNS(xmlns, 'line');
    arrowRight.setAttribute('x1', String(width / 2));
    arrowRight.setAttribute('y1', String(arrowBottom));
    arrowRight.setAttribute('x2', String(width / 2 + arrowHeadSize));
    arrowRight.setAttribute('y2', String(arrowBottom - arrowHeadSize));
    arrowRight.setAttribute('stroke', stroke);
    arrowRight.setAttribute('stroke-width', '1.5');
    g.appendChild(arrowRight);

    // optional label as text element placed to the right (local coords)
    if (label) {
        const text = document.createElementNS(xmlns, 'text');
        text.setAttribute('x', String(width + 6));
        text.setAttribute('y', String(Math.round(height / 2) + 4));
        text.setAttribute('text-anchor', 'start');
        text.setAttribute('font-family', 'Arial');
        text.setAttribute('font-size', '9');
        text.setAttribute('font-weight', 'bold');
        text.textContent = label;
        g.appendChild(text);
    }

    // helper to update group's transform using either g's attributes or the creation options
    function updateTransformFromAttributes() {
        // prefer explicit attributes on the group if present
        const attrX = g.hasAttribute('x') ? Number(g.getAttribute('x')) : optX;
        const attrY = g.hasAttribute('y') ? Number(g.getAttribute('y')) : optY;
        // if both are NaN, use 0
        const tx = Number.isFinite(attrX) ? attrX : 0;
        const ty = Number.isFinite(attrY) ? attrY : 0;
        g.setAttribute('transform', `translate(${tx},${ty})`);
    }

    // set initial transform from options
    updateTransformFromAttributes();

    // observe attribute changes on the group so callers can set x/y after creation
    const mo = new MutationObserver((mutationsList) => {
        for (const m of mutationsList) {
            if (m.type === 'attributes' && (m.attributeName === 'x' || m.attributeName === 'y')) {
                updateTransformFromAttributes();
                break;
            }
        }
    });
    mo.observe(g, { attributes: true });

    return g;
};