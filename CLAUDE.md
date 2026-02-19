# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PV Schaltplan Generator is a frontend-only web application for creating professional photovoltaic circuit diagrams (German: "Stromlaufpläne"). It generates SVG-based electrical schematics with PDF export capability.

## Running the Application

No build process required. Open `index.html` directly in a browser, or use a local server:

```bash
python -m http.server 8000
# Visit http://localhost:8000
```

## File Structure

```
pvplan/
├── index.html                    # Main application (~2000 lines)
├── css/
│   └── styles.css               # Extracted CSS styles
├── js/
│   ├── calculations.js          # Electrical calculation functions
│   └── symbols/
│       ├── spd.js               # SPD (Überspannungsschutz) symbol
│       ├── pv-module.js         # PV-Modul symbol
│       ├── inverter.js          # Wechselrichter symbol
│       ├── battery.js           # Batterie symbol
│       ├── meter.js             # Zweirichtungszähler symbol
│       ├── circuit-breaker.js   # Leitungsschutzschalter (LS)
│       └── sls.js               # Selektiver LS symbol
└── CLAUDE.md                    # This file
```

## Architecture

**Main Application**: `index.html` contains the UI, state management, and SVG diagram generation as an IIFE with a centralized state object (`window.state`).

**CSS Module**: `css/styles.css` contains all styling including print styles for the protocol.

**Calculation Module**: `js/calculations.js` provides electrical calculation functions:
- `window.calculateNominalCurrent(acPowerW, phases)` - Circuit breaker sizing
- `window.calculateCableSize(acPowerW, phases, length)` - Cable cross-section based on power
- `window.calculateCableSizeFromLsCurrent(lsAmps, length, voltage)` - Cable sizing from LS current

**Symbol Modules**: `js/symbols/*.js` - Each file exports a factory function following this pattern:
```javascript
window.createSymbolName = function(options = {}) {
    const xmlns = 'http://www.w3.org/2000/svg';
    const g = document.createElementNS(xmlns, 'g');
    // ... SVG elements
    g.setAttribute('transform', `translate(${options.x || 0},${options.y || 0})`);
    return g;
};
```

**External dependencies** (loaded via CDN):
- jsPDF v2.5.1 - PDF generation
- svg2pdf.js v2.2.1 - SVG to PDF conversion

### State Management

All application data lives in `window.state`:

```javascript
window.state = {
  projectName,
  projectAddress,
  moduleConfig: { info, wattage },
  solarAreas: [],      // PV areas with module counts
  inverters: [],       // Inverter configurations
  battery: null,       // Optional battery storage
  protocol: {}         // Inspection test data
}
```

### Key Functions in index.html

**Rendering**:
- `renderLists()` - Rebuilds component tables/cards from state
- `buildProfessionalSVG()` - Generates the complete circuit diagram SVG
- `updateMetaBox()` - Updates project metadata display

**ID generation**: Base-36 counter system (`SA1`, `SA2`, `INV1`, etc.) with `updateUidCounter()` to handle project loading

### SVG Symbol Usage

Symbols are created using factory functions from the symbol modules:
```javascript
const pvGroup = window.createPVModule({ x: 100, y: 150 });
const invGroup = window.createInverter({ x: 300, y: 150 });
const lsGroup = window.createCircuitBreaker({ x: 400, y: 150, rotation: 90 });
svg.appendChild(pvGroup);
```

### Data Persistence

- **Save**: JSON export with `.pvproj.json` extension
- **Load**: File upload with state restoration and ID counter adjustment

## Language

The UI and all user-facing text is in German. Domain terms:
- Schaltplan = circuit diagram
- Wechselrichter = inverter
- Solarfläche/Solarbereich = solar area
- Leitungsschutzschalter (LS) = circuit breaker
- Prüfprotokoll = test/inspection protocol
