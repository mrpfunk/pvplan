/**
 * PV Schaltplan Generator - Electrical Calculations
 * Consolidated calculation functions for circuit breaker sizing and cable selection
 */

/**
 * Calculate nominal current and return the appropriate circuit breaker size
 * @param {number} acPowerW - AC power in Watts
 * @param {string} phases - Phase configuration ('1-ph' or '3-ph')
 * @returns {number} - Standard circuit breaker size in Amperes
 */
window.calculateNominalCurrent = function(acPowerW, phases) {
  const acPowerKW = acPowerW / 1000;
  let current;

  if (phases === '1-ph') {
    // 1-phase: I = P / (U * cos φ), U = 230V, cos φ ≈ 1
    current = acPowerKW / 0.23;
  } else {
    // 3-phase: I = P / (√3 * U * cos φ), U = 400V, cos φ ≈ 1
    current = acPowerKW / (Math.sqrt(3) * 0.4);
  }

  // Round up to next standard circuit breaker size
  const standardSizes = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
  for (let size of standardSizes) {
    if (current <= size * 0.8) { // 80% rule for continuous load
      return size;
    }
  }
  return 125; // fallback for very high power
};

/**
 * Calculate cable cross-section based on AC power and cable length
 * @param {number} acPowerW - AC power in Watts
 * @param {string} phases - Phase configuration ('1-ph' or '3-ph')
 * @param {number} cableLengthMeters - Cable length in meters (default: 10)
 * @returns {number} - Cable cross-section in mm²
 */
window.calculateCableSize = function(acPowerW, phases, cableLengthMeters = 10) {
  const acPowerKW = acPowerW / 1000;
  let current;
  let voltage;

  if (phases === '1-ph') {
    current = acPowerKW / 0.23;
    voltage = 230;
  } else {
    current = acPowerKW / (Math.sqrt(3) * 0.4);
    voltage = 400;
  }

  const rho = 0.0175; // specific resistance of copper in Ω·mm²/m
  const totalLength = cableLengthMeters * 2; // forward and return conductors

  const cableSizes = [
    { size: 1.5, capacity: 18.5 },
    { size: 2.5, capacity: 25 },
    { size: 4, capacity: 32 },
    { size: 6, capacity: 41 },
    { size: 10, capacity: 57 },
    { size: 16, capacity: 76 },
    { size: 25, capacity: 101 },
    { size: 35, capacity: 125 },
    { size: 50, capacity: 151 }
  ];

  for (let cable of cableSizes) {
    const voltageDrop = (2 * totalLength * current * rho) / cable.size;
    const maxDrop = voltage * 0.03; // max. 3% voltage drop

    if (current <= cable.capacity * 0.8 && voltageDrop <= maxDrop) {
      return cable.size;
    }
  }

  return 50; // fallback
};

/**
 * Calculate cable cross-section based on LS current rating and voltage drop
 * @param {number} lsAmps - Circuit breaker current rating in Amperes
 * @param {number} cableLengthMeters - Cable length in meters (default: 10)
 * @param {number} voltage - Voltage in Volts (default: 230)
 * @returns {number} - Cable cross-section in mm²
 */
window.calculateCableSizeFromLsCurrent = function(lsAmps, cableLengthMeters = 10, voltage = 230) {
  const rho = 0.0175; // specific resistance of copper in Ω·mm²/m
  const totalLength = cableLengthMeters * 2; // forward and return conductors
  const maxVoltageDrop = voltage * 0.03; // max. allowed voltage drop (e.g., 3%)

  const cableSizes = [
    { size: 1.5, capacity: 18.5 },
    { size: 2.5, capacity: 25 },
    { size: 4, capacity: 32 },
    { size: 6, capacity: 41 },
    { size: 10, capacity: 57 },
    { size: 16, capacity: 76 },
    { size: 25, capacity: 101 },
    { size: 35, capacity: 125 },
    { size: 50, capacity: 151 }
  ];

  for (let cable of cableSizes) {
    const voltageDrop = (totalLength * lsAmps * rho) / cable.size;

    if (lsAmps <= cable.capacity && voltageDrop <= maxVoltageDrop) {
      return cable.size;
    }
  }

  return 50; // fallback for very high currents or long cables
};
