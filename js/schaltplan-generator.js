// Professional electrical schematic generation
// Uses external symbol modules from js/symbols/*.js
// Uses calculation functions from js/calculations.js
window.buildProfessionalSVG = function(){
  const width = 1000;
  const height = 700;
  const xmlns = 'http://www.w3.org/2000/svg';

  // Create main SVG container
  const svg = document.createElementNS(xmlns, 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('style', 'background: white; border: 1px solid #000;');

  // Layout positions - new vertical layout
  const pvX = 100; // PV modules on the left
  const invX = 300; // Inverters to the right of PV modules
  const startY = 150; // Starting Y position
  const verticalSpacing = 80; // Vertical spacing between components
  const meterX = 660; // Zweirichtungszähler position
  const spdKombiX = 740; // SPD Kombi after meter
  const slsX = 810; // SLS position
  const hakX = 860; // HAK position (Ende der Schaltung)
  const batY = 500;


  const titleText = document.createElementNS(xmlns, 'text');
  titleText.setAttribute('x', '500');
  titleText.setAttribute('y', '40');
  titleText.setAttribute('text-anchor', 'middle');
  titleText.setAttribute('font-family', 'Arial');
  titleText.setAttribute('font-size', '14');
  titleText.setAttribute('font-weight', 'bold');
  titleText.textContent = 'PV-Anlage Stromlaufplan';
  svg.appendChild(titleText);

  // Add address below title if available
  if (state.projectAddress) {
    const addressLines = state.projectAddress.split('\n');
    addressLines.forEach((line, idx) => {
      const addressText = document.createElementNS(xmlns, 'text');
      addressText.setAttribute('x', '500');
      addressText.setAttribute('y', 40 + 16 + (idx * 11));
      addressText.setAttribute('text-anchor', 'middle');
      addressText.setAttribute('font-family', 'Arial');
      addressText.setAttribute('font-size', '10');
      addressText.textContent = line.trim();
      svg.appendChild(addressText);
    });
  }

  // Data box in upper right corner
  const dataBoxX = width - 200;
  const dataBoxY = 20;
  const dataBoxWidth = 180;
  const dataBoxHeight = 135;

  // Data box background
  const dataBoxBg = document.createElementNS(xmlns, 'rect');
  dataBoxBg.setAttribute('x', dataBoxX);
  dataBoxBg.setAttribute('y', dataBoxY);
  dataBoxBg.setAttribute('width', dataBoxWidth);
  dataBoxBg.setAttribute('height', dataBoxHeight);
  dataBoxBg.setAttribute('fill', '#f8f9fa');
  dataBoxBg.setAttribute('stroke', '#000');
  dataBoxBg.setAttribute('stroke-width', '1');
  dataBoxBg.setAttribute('rx', '5');
  svg.appendChild(dataBoxBg);

  // Calculate totals for data box
  const totalPvPower = state.solarAreas.reduce((sum, sa) => sum + (sa.modules * state.moduleConfig.wattage), 0);
  const totalInvPower = state.inverters.reduce((sum, inv) => sum + inv.ac_power_w, 0);

  // Data box title
  const dataBoxTitle = document.createElementNS(xmlns, 'text');
  dataBoxTitle.setAttribute('x', dataBoxX + 10);
  dataBoxTitle.setAttribute('y', dataBoxY + 18);
  dataBoxTitle.setAttribute('font-family', 'Arial');
  dataBoxTitle.setAttribute('font-size', '11');
  dataBoxTitle.setAttribute('font-weight', 'bold');
  dataBoxTitle.textContent = 'Anlagedaten:';
  svg.appendChild(dataBoxTitle);

  // PV-Generator gesamt
  const pvTotalLabel = document.createElementNS(xmlns, 'text');
  pvTotalLabel.setAttribute('x', dataBoxX + 10);
  pvTotalLabel.setAttribute('y', dataBoxY + 35);
  pvTotalLabel.setAttribute('font-family', 'Arial');
  pvTotalLabel.setAttribute('font-size', '9');
  pvTotalLabel.textContent = 'PV-Generator gesamt:';
  svg.appendChild(pvTotalLabel);

  const pvTotalValue = document.createElementNS(xmlns, 'text');
  pvTotalValue.setAttribute('x', dataBoxX + dataBoxWidth - 10);
  pvTotalValue.setAttribute('y', dataBoxY + 35);
  pvTotalValue.setAttribute('text-anchor', 'end');
  pvTotalValue.setAttribute('font-family', 'Arial');
  pvTotalValue.setAttribute('font-size', '9');
  pvTotalValue.setAttribute('font-weight', 'bold');
  pvTotalValue.textContent = `${(totalPvPower/1000).toFixed(2)} kWp`;
  svg.appendChild(pvTotalValue);

  // Wechselrichter gesamt
  const invTotalLabel = document.createElementNS(xmlns, 'text');
  invTotalLabel.setAttribute('x', dataBoxX + 10);
  invTotalLabel.setAttribute('y', dataBoxY + 50);
  invTotalLabel.setAttribute('font-family', 'Arial');
  invTotalLabel.setAttribute('font-size', '9');
  invTotalLabel.textContent = 'Wechselrichter gesamt:';
  svg.appendChild(invTotalLabel);

  const invTotalValue = document.createElementNS(xmlns, 'text');
  invTotalValue.setAttribute('x', dataBoxX + dataBoxWidth - 10);
  invTotalValue.setAttribute('y', dataBoxY + 50);
  invTotalValue.setAttribute('text-anchor', 'end');
  invTotalValue.setAttribute('font-family', 'Arial');
  invTotalValue.setAttribute('font-size', '9');
  invTotalValue.setAttribute('font-weight', 'bold');
  invTotalValue.textContent = `${(totalInvPower/1000).toFixed(2)} kW`;
  svg.appendChild(invTotalValue);

  // Speicherkapazität (nur wenn Batterie vorhanden)
  if (state.battery) {
    const batCapLabel = document.createElementNS(xmlns, 'text');
    batCapLabel.setAttribute('x', dataBoxX + 10);
    batCapLabel.setAttribute('y', dataBoxY + 65);
    batCapLabel.setAttribute('font-family', 'Arial');
    batCapLabel.setAttribute('font-size', '9');
    batCapLabel.textContent = 'Speicherkapazität:';
    svg.appendChild(batCapLabel);

    const batCapValue = document.createElementNS(xmlns, 'text');
    batCapValue.setAttribute('x', dataBoxX + dataBoxWidth - 10);
    batCapValue.setAttribute('y', dataBoxY + 65);
    batCapValue.setAttribute('text-anchor', 'end');
    batCapValue.setAttribute('font-family', 'Arial');
    batCapValue.setAttribute('font-size', '9');
    batCapValue.setAttribute('font-weight', 'bold');
    batCapValue.textContent = `${state.battery.kwh} kWh`;
    svg.appendChild(batCapValue);

    // Max. Batterieleistung (nur wenn angegeben)
    if (state.battery.power_kw && state.battery.power_kw > 0) {
      const batPowerLabel = document.createElementNS(xmlns, 'text');
      batPowerLabel.setAttribute('x', dataBoxX + 10);
      batPowerLabel.setAttribute('y', dataBoxY + 80);
      batPowerLabel.setAttribute('font-family', 'Arial');
      batPowerLabel.setAttribute('font-size', '9');
      batPowerLabel.textContent = 'Max. Batterieleistung:';
      svg.appendChild(batPowerLabel);

      const batPowerValue = document.createElementNS(xmlns, 'text');
      batPowerValue.setAttribute('x', dataBoxX + dataBoxWidth - 10);
      batPowerValue.setAttribute('y', dataBoxY + 80);
      batPowerValue.setAttribute('text-anchor', 'end');
      batPowerValue.setAttribute('font-family', 'Arial');
      batPowerValue.setAttribute('font-size', '9');
      batPowerValue.setAttribute('font-weight', 'bold');
      batPowerValue.textContent = `${state.battery.power_kw.toFixed(1)} kW`;
      svg.appendChild(batPowerValue);
    }
  }

  // Leistungsverhältnis (falls beide Werte > 0)
  let nextY = dataBoxY + 65; // Startwert für die nächste Y-Position
  if (totalPvPower > 0 && totalInvPower > 0) {
    const ratioY = state.battery ? (state.battery.power_kw > 0 ? dataBoxY + 95 : dataBoxY + 80) : dataBoxY + 65;

    const ratioLabel = document.createElementNS(xmlns, 'text');
    ratioLabel.setAttribute('x', dataBoxX + 10);
    ratioLabel.setAttribute('y', ratioY);
    ratioLabel.setAttribute('font-family', 'Arial');
    ratioLabel.setAttribute('font-size', '9');
    ratioLabel.textContent = 'Überdimensionierung:';
    svg.appendChild(ratioLabel);

    const ratioValue = document.createElementNS(xmlns, 'text');
    ratioValue.setAttribute('x', dataBoxX + dataBoxWidth - 10);
    ratioValue.setAttribute('y', ratioY);
    ratioValue.setAttribute('text-anchor', 'end');
    ratioValue.setAttribute('font-family', 'Arial');
    ratioValue.setAttribute('font-size', '9');
    ratioValue.setAttribute('font-weight', 'bold');
    ratioValue.textContent = `${(totalPvPower/totalInvPower).toFixed(2)}`;
    svg.appendChild(ratioValue);

    nextY = ratioY + 15; // Nächste Position nach Überdimensionierung
  } else {
    nextY = state.battery ? (state.battery.power_kw > 0 ? dataBoxY + 95 : dataBoxY + 80) : dataBoxY + 65;
  }

  // Notstrom-Information
  const emergencyPowerStatus = state.inverters.some(inv => inv.emergencyPower);
  const emergencyLabel = document.createElementNS(xmlns, 'text');
  emergencyLabel.setAttribute('x', dataBoxX + 10);
  emergencyLabel.setAttribute('y', nextY);
  emergencyLabel.setAttribute('font-family', 'Arial');
  emergencyLabel.setAttribute('font-size', '9');
  emergencyLabel.textContent = 'Notstrom:';
  svg.appendChild(emergencyLabel);

  const emergencyValue = document.createElementNS(xmlns, 'text');
  emergencyValue.setAttribute('x', dataBoxX + dataBoxWidth - 10);
  emergencyValue.setAttribute('y', nextY);
  emergencyValue.setAttribute('text-anchor', 'end');
  emergencyValue.setAttribute('font-family', 'Arial');
  emergencyValue.setAttribute('font-size', '9');
  emergencyValue.setAttribute('font-weight', 'bold');
  emergencyValue.textContent = emergencyPowerStatus ? 'Ja' : 'Nein';
  svg.appendChild(emergencyValue);

  // SLS-Schalter Größe
  const slsInfoLabel = document.createElementNS(xmlns, 'text');
  slsInfoLabel.setAttribute('x', dataBoxX + 10);
  slsInfoLabel.setAttribute('y', nextY + 15);
  slsInfoLabel.setAttribute('font-family', 'Arial');
  slsInfoLabel.setAttribute('font-size', '9');
  slsInfoLabel.textContent = 'SLS-Schalter:';
  svg.appendChild(slsInfoLabel);

  const slsInfoValue = document.createElementNS(xmlns, 'text');
  slsInfoValue.setAttribute('x', dataBoxX + dataBoxWidth - 10);
  slsInfoValue.setAttribute('y', nextY + 15);
  slsInfoValue.setAttribute('text-anchor', 'end');
  slsInfoValue.setAttribute('font-family', 'Arial');
  slsInfoValue.setAttribute('font-size', '9');
  slsInfoValue.setAttribute('font-weight', 'bold');
  slsInfoValue.textContent = `${state.slsSize || 35}A`;
  svg.appendChild(slsInfoValue);

  // Draw PV areas - vertically arranged on the left
  state.solarAreas.forEach((sa, index) => {
    const x = pvX;
    const y = startY + (index * verticalSpacing);
    const spdX = x + 60; // Position SPD to the right of PV module

    // PV symbol (using factory function from js/symbols/pv-module.js)
    const pvGroup = window.createPVModule({ x: x, y: y });
    svg.appendChild(pvGroup);

    // PV label
    const pvLabel = document.createElementNS(xmlns, 'text');
    pvLabel.setAttribute('x', x);
    pvLabel.setAttribute('y', y - 30);
    pvLabel.setAttribute('text-anchor', 'middle');
    pvLabel.setAttribute('font-family', 'Arial');
    pvLabel.setAttribute('font-size', '10');
    pvLabel.setAttribute('font-weight', 'bold');
    pvLabel.textContent = `${sa.name}`;
    svg.appendChild(pvLabel);

    const pvPower = document.createElementNS(xmlns, 'text');
    pvPower.setAttribute('x', x);
    pvPower.setAttribute('y', y - 20);
    pvPower.setAttribute('text-anchor', 'middle');
    pvPower.setAttribute('font-family', 'Arial');
    pvPower.setAttribute('font-size', '8');
    pvPower.setAttribute('fill', '#222');
    pvPower.textContent = `${sa.modules} × ${state.moduleConfig.wattage}W = ${(sa.modules * state.moduleConfig.wattage / 1000).toFixed(2)} kWp`;
    svg.appendChild(pvPower);

    // Line from PV to SPD
    const pvToSpdLine = document.createElementNS(xmlns, 'line');
    pvToSpdLine.setAttribute('x1', x + 25); // Right edge of PV module
    pvToSpdLine.setAttribute('y1', y);
    pvToSpdLine.setAttribute('x2', spdX - 8); // Left edge of SPD
    pvToSpdLine.setAttribute('y2', y);
    pvToSpdLine.setAttribute('stroke', '#000');
    pvToSpdLine.setAttribute('stroke-width', '2');
    pvToSpdLine.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(pvToSpdLine);

    // Surge protector symbol using createSPD
    const spdGroup = window.createSPD('', {x: spdX - 6, y: y - 7 });
    svg.appendChild(spdGroup);

    // SPD label
    const spdLabel = document.createElementNS(xmlns, 'text');
    spdLabel.setAttribute('x', spdX);
    spdLabel.setAttribute('y', y - 15);
    spdLabel.setAttribute('text-anchor', 'middle');
    spdLabel.setAttribute('font-family', 'Arial');
    spdLabel.setAttribute('font-size', '9');
    spdLabel.setAttribute('fill', '#000');
    spdLabel.setAttribute('font-weight', 'bold');
    spdLabel.textContent = 'SPD';
    svg.appendChild(spdLabel);
  });

  // Draw inverters - positioned at the center of their assigned PV modules
  state.inverters.forEach((inv, index) => {
    const x = invX;

    // Calculate the center Y position of assigned PV modules
    let invY;
    if (inv.assignedSolarAreaIds.length > 0) {
      // Find indices of assigned PV modules
      const assignedIndices = inv.assignedSolarAreaIds.map(saId =>
        state.solarAreas.findIndex(sa => sa.id === saId)
      ).filter(idx => idx !== -1);

      if (assignedIndices.length > 0) {
        // Calculate center position
        const minIndex = Math.min(...assignedIndices);
        const maxIndex = Math.max(...assignedIndices);
        const centerIndex = (minIndex + maxIndex) / 2;
        invY = startY + (centerIndex * verticalSpacing);
      } else {
        // Fallback: use sequential positioning
        invY = startY + (index * verticalSpacing);
      }
    } else {
      // No assigned PV modules: use sequential positioning
      invY = startY + (index * verticalSpacing);
    }

    // Inverter symbol (using factory function from js/symbols/inverter.js)
    const invGroup = window.createInverter({ x: x, y: invY });
    svg.appendChild(invGroup);

    const invLabel = document.createElementNS(xmlns, 'text');
    invLabel.setAttribute('x', x);
    invLabel.setAttribute('y', invY - 40);
    invLabel.setAttribute('text-anchor', 'middle');
    invLabel.setAttribute('font-family', 'Arial');
    invLabel.setAttribute('font-size', '10');
    invLabel.setAttribute('font-weight', 'bold');
    invLabel.textContent = inv.name;
    svg.appendChild(invLabel);

    const invInfo = document.createElementNS(xmlns, 'text');
    invInfo.setAttribute('x', x - 30);
    invInfo.setAttribute('y', invY - 30);
    invInfo.setAttribute('text-anchor', 'start');
    invInfo.setAttribute('font-family', 'Arial');
    invInfo.setAttribute('font-size', '8');
    invInfo.setAttribute('fill', '#222');
    invInfo.textContent = `${(inv.ac_power_w / 1000).toFixed(1)} kW | ${inv.phases}`;
    svg.appendChild(invInfo);

    // Store inverter position for later use
    inv._layoutY = invY;
    inv._layoutX = x;

    // Draw connections from SPD to inverter
    inv.assignedSolarAreaIds.forEach(saId => {
      const saIndex = state.solarAreas.findIndex(sa => sa.id === saId);
      if (saIndex !== -1) {
        const saX = pvX;
        const saY = startY + (saIndex * verticalSpacing);
        const spdX = saX + 60; // SPD position

        // DC connection line (horizontal from SPD to inverter)
        const dcLine = document.createElementNS(xmlns, 'line');
        dcLine.setAttribute('x1', spdX + 8); // Right edge of SPD
        dcLine.setAttribute('y1', saY);
        dcLine.setAttribute('x2', x - 30); // Left edge of inverter
        dcLine.setAttribute('y2', invY);
        dcLine.setAttribute('stroke', '#000');
        dcLine.setAttribute('stroke-width', '2');
        dcLine.setAttribute('stroke-dasharray', '5,5');
        svg.appendChild(dcLine);
      }
    });

  });

  // Calculate dynamic positions based on number of inverters
  const busLineY = Math.max(startY + (state.inverters.length * verticalSpacing), startY + 120); // Position below all inverters
  const meterY = busLineY; // Meter at same height as bus line

  // Draw main AC bus line (Sammelschiene) to meter - parallel connection
  const busStartX = invX + 85; // Vertical bus line position
  const busEndX = meterX - 30;

  const mainBusLine = document.createElementNS(xmlns, 'line');
  mainBusLine.setAttribute('x1', busStartX);
  mainBusLine.setAttribute('y1', busLineY);
  mainBusLine.setAttribute('x2', busEndX);
  mainBusLine.setAttribute('y2', busLineY);
  mainBusLine.setAttribute('stroke', '#000');
  mainBusLine.setAttribute('stroke-width', '4');
  svg.appendChild(mainBusLine);

  // Connect each inverter to the bus line (parallel connection) with circuit breakers
  state.inverters.forEach((inv, index) => {
    const x = invX;
    const y = inv._layoutY; // Use the calculated center position
    const lsX = x + 60; // Position LS closer to inverter

    // Use configured values or calculate as fallback
    const nominalCurrent = inv.ls_amps || calculateNominalCurrent(inv.ac_power_w, inv.phases);
    const cableSize = inv.cable_size || calculateCableSizeFromLsCurrent(nominalCurrent);

    // Bei Notstrom-WR: AC-Ausgang nach unten verschieben für Platz oberhalb
    const acLineY = inv.emergencyPower ? y + 15 : y;

    // Line from inverter to circuit breaker
    const invToLsLine = document.createElementNS(xmlns, 'line');
    invToLsLine.setAttribute('x1', x + 30); // Right edge of inverter
    invToLsLine.setAttribute('y1', acLineY);
    invToLsLine.setAttribute('x2', lsX - 10); // Left edge of LS
    invToLsLine.setAttribute('y2', acLineY);
    invToLsLine.setAttribute('stroke', '#000');
    invToLsLine.setAttribute('stroke-width', '3');
    svg.appendChild(invToLsLine);          // Cable cross-section label (between inverter and LS)
    const cableLabel = document.createElementNS(xmlns, 'text');
    cableLabel.setAttribute('x', x + 50); // Adjusted position for new LS location
    cableLabel.setAttribute('y', acLineY - 8);
    cableLabel.setAttribute('text-anchor', 'middle');
    cableLabel.setAttribute('font-family', 'Arial');
    cableLabel.setAttribute('font-size', '8');
    cableLabel.setAttribute('fill', '#222');
    cableLabel.textContent = '' // `${cableSize}mm²`;
    svg.appendChild(cableLabel);

    // Circuit breaker symbol (using factory function from js/symbols/circuit-breaker.js)
    const lsGroup = window.createCircuitBreaker({ x: lsX, y: acLineY, rotation: 90 });
    svg.appendChild(lsGroup);

    // LS label (text "LS")
    const lsLabel = document.createElementNS(xmlns, 'text');
    lsLabel.setAttribute('x', lsX);
    lsLabel.setAttribute('y', acLineY - 20);
    lsLabel.setAttribute('text-anchor', 'middle');
    lsLabel.setAttribute('font-family', 'Arial');
    lsLabel.setAttribute('font-size', '9');
    lsLabel.setAttribute('fill', '#000');
    lsLabel.setAttribute('font-weight', 'bold');
    lsLabel.textContent = 'LS';
    svg.appendChild(lsLabel);

    // Circuit breaker label (nominal current)
    const lsInfo = document.createElementNS(xmlns, 'text');
    lsInfo.setAttribute('x', lsX);
    lsInfo.setAttribute('y', acLineY - 12);
    lsInfo.setAttribute('text-anchor', 'middle');
    lsInfo.setAttribute('font-family', 'Arial');
    lsInfo.setAttribute('font-size', '8');
    lsInfo.setAttribute('fill', '#222');
    lsInfo.textContent = `${nominalCurrent}A`;
    svg.appendChild(lsInfo);

    // Line from circuit breaker to bus collector
    const lsToBusLine = document.createElementNS(xmlns, 'line');
    lsToBusLine.setAttribute('x1', lsX + 10); // Right edge of LS
    lsToBusLine.setAttribute('y1', acLineY);
    lsToBusLine.setAttribute('x2', busStartX); // Connect to bus line start
    lsToBusLine.setAttribute('y2', acLineY);
    lsToBusLine.setAttribute('stroke', '#000');
    lsToBusLine.setAttribute('stroke-width', '3');
    svg.appendChild(lsToBusLine);

    // Vertical line from horizontal line to bus
    const invToBusLineVertical = document.createElementNS(xmlns, 'line');
    invToBusLineVertical.setAttribute('x1', busStartX);
    invToBusLineVertical.setAttribute('y1', acLineY);
    invToBusLineVertical.setAttribute('x2', busStartX);
    invToBusLineVertical.setAttribute('y2', busLineY);
    invToBusLineVertical.setAttribute('stroke', '#000');
    invToBusLineVertical.setAttribute('stroke-width', '3');
    svg.appendChild(invToBusLineVertical);

    // Junction point on bus line
    const junctionPoint = document.createElementNS(xmlns, 'circle');
    junctionPoint.setAttribute('cx', busStartX);
    junctionPoint.setAttribute('cy', busLineY);
    junctionPoint.setAttribute('r', '3');
    junctionPoint.setAttribute('fill', '#000');
    svg.appendChild(junctionPoint);
  });

  // Connection from bus line to meter
  const busToMeterLine = document.createElementNS(xmlns, 'line');
  busToMeterLine.setAttribute('x1', busEndX);
  busToMeterLine.setAttribute('y1', busLineY);
  busToMeterLine.setAttribute('x2', meterX - 30);
  busToMeterLine.setAttribute('y2', meterY);
  busToMeterLine.setAttribute('stroke', '#000');
  busToMeterLine.setAttribute('stroke-width', '4');
  svg.appendChild(busToMeterLine);

  // Draw battery if exists - positioned above first PV module on the left
  if (state.battery) {
    // Battery connection to inverter
    if (state.battery.assignedInvId) {
      const assignedInverter = state.inverters.find(inv => inv.id === state.battery.assignedInvId);
      if (assignedInverter) {
        const assignedInvX = invX;
        const assignedInvY = assignedInverter._layoutY; // Use the calculated center position
        // Position battery above the first PV module on the left side
        const batX = pvX; // Same X position as PV modules
        const batY = startY - 80; // Above the first PV module

        // Battery symbol (using factory function from js/symbols/battery.js)
        const batGroup = window.createBattery({ x: batX, y: batY });
        svg.appendChild(batGroup);

        const batLabel = document.createElementNS(xmlns, 'text');
        batLabel.setAttribute('x', batX);
        batLabel.setAttribute('y', batY - 35);
        batLabel.setAttribute('text-anchor', 'middle');
        batLabel.setAttribute('font-family', 'Arial');
        batLabel.setAttribute('font-size', '10');
        batLabel.setAttribute('font-weight', 'bold');
        batLabel.textContent = state.battery.name;
        svg.appendChild(batLabel);

        const batInfo = document.createElementNS(xmlns, 'text');
        batInfo.setAttribute('x', batX);
        batInfo.setAttribute('y', batY - 25);
        batInfo.setAttribute('text-anchor', 'middle');
        batInfo.setAttribute('font-family', 'Arial');
        batInfo.setAttribute('font-size', '8');
        batInfo.setAttribute('fill', '#222');
        batInfo.textContent = `${state.battery.kwh} kWh | ${state.battery.power_kw ? state.battery.power_kw + ' kW DC' : ''}`;
        svg.appendChild(batInfo);

        // L-shaped connection from battery (top-left) to inverter
        // Horizontal line from battery to the right
        const batLineHorizontal = document.createElementNS(xmlns, 'line');
        batLineHorizontal.setAttribute('x1', batX + 15); // Right edge of battery
        batLineHorizontal.setAttribute('y1', batY);
        batLineHorizontal.setAttribute('x2', assignedInvX - 50); // Stop before inverter
        batLineHorizontal.setAttribute('y2', batY);
        batLineHorizontal.setAttribute('stroke', '#000');
        batLineHorizontal.setAttribute('stroke-width', '2');
        batLineHorizontal.setAttribute('stroke-dasharray', '5,5');
        svg.appendChild(batLineHorizontal);

        // Vertical line down to inverter level
        const batLineVertical = document.createElementNS(xmlns, 'line');
        batLineVertical.setAttribute('x1', assignedInvX - 50);
        batLineVertical.setAttribute('y1', batY);
        batLineVertical.setAttribute('x2', assignedInvX - 50);
        batLineVertical.setAttribute('y2', assignedInvY);
        batLineVertical.setAttribute('stroke', '#000');
        batLineVertical.setAttribute('stroke-width', '2');
        batLineVertical.setAttribute('stroke-dasharray', '5,5');
        svg.appendChild(batLineVertical);

        // Final horizontal line to inverter
        const batLineToInv = document.createElementNS(xmlns, 'line');
        batLineToInv.setAttribute('x1', assignedInvX - 50);
        batLineToInv.setAttribute('y1', assignedInvY);
        batLineToInv.setAttribute('x2', assignedInvX - 30); // Left edge of inverter
        batLineToInv.setAttribute('y2', assignedInvY);
        batLineToInv.setAttribute('stroke', '#000');
        batLineToInv.setAttribute('stroke-width', '2');
        batLineToInv.setAttribute('stroke-dasharray', '5,5');
        svg.appendChild(batLineToInv);

        // Junction points
        const batJunction1 = document.createElementNS(xmlns, 'circle');
        batJunction1.setAttribute('cx', assignedInvX - 50);
        batJunction1.setAttribute('cy', batY);
        batJunction1.setAttribute('r', '2');
        batJunction1.setAttribute('fill', '#000');
        svg.appendChild(batJunction1);

        const batJunction2 = document.createElementNS(xmlns, 'circle');
        batJunction2.setAttribute('cx', assignedInvX - 50);
        batJunction2.setAttribute('cy', assignedInvY);
        batJunction2.setAttribute('r', '2');
        batJunction2.setAttribute('fill', '#000');
        svg.appendChild(batJunction2);
      }
    }
  }

  // Draw meter (using factory function from js/symbols/meter.js)
  const meterGroup = window.createMeter({ x: meterX, y: meterY, label: 'Z1' });
  svg.appendChild(meterGroup);

  const meterLabel = document.createElementNS(xmlns, 'text');
  meterLabel.setAttribute('x', meterX);
  meterLabel.setAttribute('y', meterY - 30);
  meterLabel.setAttribute('text-anchor', 'middle');
  meterLabel.setAttribute('font-family', 'Arial');
  meterLabel.setAttribute('font-size', '10');
  meterLabel.setAttribute('font-weight', 'bold');
  meterLabel.textContent = 'Zweirichtungszähler';
  svg.appendChild(meterLabel);        // Check if any inverter has emergency power
  const hasEmergencyPower = state.inverters.some(inv => inv.emergencyPower);

  if (hasEmergencyPower) {
    // Notstrom-Layout: Haus rechts vom Umschalter
    const emergencyInv = state.inverters.find(inv => inv.emergencyPower);

    // Bei mehr als 3 Solarflächen: Umschalter und Haus oberhalb der busLineY positionieren
    const hasManySolarAreas = emergencyInv.assignedSolarAreaIds.length > 3;
    let switchX, switchY, houseX, houseY, rcdX, lsEmergencyX;
    if (hasManySolarAreas) {
      // Position oberhalb der busLineY mit mehr Abstand
      // RCD und LS auf der Notstrom-Leitung, dann Umschalter
      rcdX = emergencyInv._layoutX + 150;
      lsEmergencyX = rcdX + 50;
      switchX = lsEmergencyX + 70;
      switchY = busLineY - 80; // Weit oberhalb der busLineY
      houseX = switchX + 80;
      houseY = switchY - 10;
    } else {
      // Normale Position bei <= 3 Solarflächen
      rcdX = emergencyInv._layoutX + 150;
      lsEmergencyX = rcdX + 50;
      switchX = lsEmergencyX + 70;
      switchY = emergencyInv._layoutY - 15; // Auf Höhe der Notstrom-Leitung
      houseX = switchX + 80;
      houseY = switchY - 10;
    }

    // 1|0|2 Umschalter Symbol
    const switchRect = document.createElementNS(xmlns, 'rect');
    switchRect.setAttribute('x', switchX - 25);
    switchRect.setAttribute('y', switchY - 15);
    switchRect.setAttribute('width', '50');
    switchRect.setAttribute('height', '30');
    switchRect.setAttribute('fill', 'none');
    switchRect.setAttribute('stroke', '#000');
    switchRect.setAttribute('stroke-width', '2');
    svg.appendChild(switchRect);

    // Umschalter-Beschriftung
    const switchLabel = document.createElementNS(xmlns, 'text');
    switchLabel.setAttribute('x', switchX);
    switchLabel.setAttribute('y', switchY + 2);
    switchLabel.setAttribute('text-anchor', 'middle');
    switchLabel.setAttribute('font-family', 'Arial');
    switchLabel.setAttribute('font-size', '12');
    switchLabel.setAttribute('font-weight', 'bold');
    switchLabel.textContent = '1|0|2';
    svg.appendChild(switchLabel);

    // Umschalter Info
    const switchInfo = document.createElementNS(xmlns, 'text');
    switchInfo.setAttribute('x', switchX);
    switchInfo.setAttribute('y', switchY - 30);
    switchInfo.setAttribute('text-anchor', 'middle');
    switchInfo.setAttribute('font-family', 'Arial');
    switchInfo.setAttribute('font-size', '10');
    switchInfo.setAttribute('font-weight', 'bold');
    switchInfo.setAttribute('fill', '#000');
    switchInfo.textContent = 'Lastumschalter';
    svg.appendChild(switchInfo);

    // Umschalter details
    const switchDetail = document.createElementNS(xmlns, 'text');
    switchDetail.setAttribute('x', switchX);
    switchDetail.setAttribute('y', switchY - 20);
    switchDetail.setAttribute('text-anchor', 'middle');
    switchDetail.setAttribute('font-family', 'Arial');
    switchDetail.setAttribute('font-size', '8');
    switchDetail.setAttribute('fill', '#222');
    switchDetail.textContent = '4polig, 63A';
    svg.appendChild(switchDetail);

    // Anschlüsse am Umschalter
    // Position 1 (links): Wechselrichter - immer links mittig, egal wie viele Solarflächen
    const switch1Circle = document.createElementNS(xmlns, 'circle');
    switch1Circle.setAttribute('cx', switchX - 25);
    switch1Circle.setAttribute('cy', switchY);
    switch1Circle.setAttribute('r', '2');
    switch1Circle.setAttribute('fill', '#000');
    svg.appendChild(switch1Circle);

    // Position 2 (unten): Netz
    const switch2Circle = document.createElementNS(xmlns, 'circle');
    switch2Circle.setAttribute('cx', switchX);
    switch2Circle.setAttribute('cy', switchY + 15);
    switch2Circle.setAttribute('r', '2');
    switch2Circle.setAttribute('fill', '#000');
    svg.appendChild(switch2Circle);

    // Ausgang (rechts): Haus
    const switchOutCircle = document.createElementNS(xmlns, 'circle');
    switchOutCircle.setAttribute('cx', switchX + 25);
    switchOutCircle.setAttribute('cy', switchY);
    switchOutCircle.setAttribute('r', '2');
    switchOutCircle.setAttribute('fill', '#000');
    svg.appendChild(switchOutCircle);

    let emergencyY;
    // Notstrom-Leitung vom Wechselrichter über RCD und LS zum Umschalter
    if (hasManySolarAreas) {
      // Bei mehr als 3 Solarflächen: L-Route - nach oben, dann nach rechts
      emergencyY = emergencyInv._layoutY - 15;

      // 1. Horizontale Linie am Wechselrichter Ausgang (länger, damit Label nicht durchkreuzt wird)
      const emergencyLineStart = document.createElementNS(xmlns, 'line');
      emergencyLineStart.setAttribute('x1', emergencyInv._layoutX + 30);
      emergencyLineStart.setAttribute('y1', emergencyY);
      emergencyLineStart.setAttribute('x2', emergencyInv._layoutX + 120);
      emergencyLineStart.setAttribute('y2', emergencyY);
      emergencyLineStart.setAttribute('stroke', '#ff9900');
      emergencyLineStart.setAttribute('stroke-width', '3');
      emergencyLineStart.setAttribute('stroke-dasharray', '10,5');
      svg.appendChild(emergencyLineStart);

      // 2. Vertikale Linie nach oben (jetzt weiter rechts, um Label nicht zu durchkreuzen)
      const emergencyLine1 = document.createElementNS(xmlns, 'line');
      emergencyLine1.setAttribute('x1', emergencyInv._layoutX + 120);
      emergencyLine1.setAttribute('y1', emergencyY);
      emergencyLine1.setAttribute('x2', emergencyInv._layoutX + 120);
      emergencyLine1.setAttribute('y2', switchY);
      emergencyLine1.setAttribute('stroke', '#ff9900');
      emergencyLine1.setAttribute('stroke-width', '3');
      emergencyLine1.setAttribute('stroke-dasharray', '10,5');
      svg.appendChild(emergencyLine1);

      // 3. Linie zum RCD
      const lineToRcd = document.createElementNS(xmlns, 'line');
      lineToRcd.setAttribute('x1', emergencyInv._layoutX + 120);
      lineToRcd.setAttribute('y1', switchY);
      lineToRcd.setAttribute('x2', rcdX - 10);
      lineToRcd.setAttribute('y2', switchY);
      lineToRcd.setAttribute('stroke', '#ff9900');
      lineToRcd.setAttribute('stroke-width', '3');
      lineToRcd.setAttribute('stroke-dasharray', '10,5');
      svg.appendChild(lineToRcd);

    } else {
      // Normale direkte Route bei <= 3 Solarflächen
      emergencyY = emergencyInv._layoutY - 15;

      // Verlängerte Linie vom WR zum RCD für bessere Label-Sichtbarkeit
      const lineToRcd = document.createElementNS(xmlns, 'line');
      lineToRcd.setAttribute('x1', emergencyInv._layoutX + 30);
      lineToRcd.setAttribute('y1', emergencyY);
      lineToRcd.setAttribute('x2', rcdX - 10);
      lineToRcd.setAttribute('y2', emergencyY);
      lineToRcd.setAttribute('stroke', '#ff9900');
      lineToRcd.setAttribute('stroke-width', '3');
      lineToRcd.setAttribute('stroke-dasharray', '10,5');
      svg.appendChild(lineToRcd);
    }

    // RCD Symbol (using factory function from js/symbols/rcd.js)
    const rcdY = hasManySolarAreas ? switchY : emergencyY;
    const rcdGroup = window.createRCD({ x: rcdX, y: rcdY, rotation: 90, stroke: '#000' });
    svg.appendChild(rcdGroup);

    // RCD Label
    const rcdLabel = document.createElementNS(xmlns, 'text');
    rcdLabel.setAttribute('x', rcdX);
    rcdLabel.setAttribute('y', rcdY - 18);
    rcdLabel.setAttribute('text-anchor', 'middle');
    rcdLabel.setAttribute('font-family', 'Arial');
    rcdLabel.setAttribute('font-size', '8');
    rcdLabel.setAttribute('fill', '#000');
    rcdLabel.setAttribute('font-weight', 'bold');
    rcdLabel.textContent = 'RCD';
    svg.appendChild(rcdLabel);

    // RCD Info
    const rcdInfo = document.createElementNS(xmlns, 'text');
    rcdInfo.setAttribute('x', rcdX);
    rcdInfo.setAttribute('y', rcdY - 10);
    rcdInfo.setAttribute('text-anchor', 'middle');
    rcdInfo.setAttribute('font-family', 'Arial');
    rcdInfo.setAttribute('font-size', '7');
    rcdInfo.setAttribute('fill', '#000');
    rcdInfo.textContent = '40A/300mA';
    svg.appendChild(rcdInfo);

    // Linie vom RCD zum LS
    const rcdToLsLine = document.createElementNS(xmlns, 'line');
    rcdToLsLine.setAttribute('x1', rcdX + 10);
    rcdToLsLine.setAttribute('y1', rcdY);
    rcdToLsLine.setAttribute('x2', lsEmergencyX - 10);
    rcdToLsLine.setAttribute('y2', rcdY);
    rcdToLsLine.setAttribute('stroke', '#ff9900');
    rcdToLsLine.setAttribute('stroke-width', '3');
    rcdToLsLine.setAttribute('stroke-dasharray', '10,5');
    svg.appendChild(rcdToLsLine);

    // LS Symbol auf Notstrom-Leitung (using factory function, black stroke)
    const lsEmergencyGroup = window.createCircuitBreaker({ x: lsEmergencyX, y: rcdY, rotation: 90 });
    svg.appendChild(lsEmergencyGroup);

    // LS Label
    const lsEmergencyLabel = document.createElementNS(xmlns, 'text');
    lsEmergencyLabel.setAttribute('x', lsEmergencyX);
    lsEmergencyLabel.setAttribute('y', rcdY - 20);
    lsEmergencyLabel.setAttribute('text-anchor', 'middle');
    lsEmergencyLabel.setAttribute('font-family', 'Arial');
    lsEmergencyLabel.setAttribute('font-size', '8');
    lsEmergencyLabel.setAttribute('fill', '#000');
    lsEmergencyLabel.setAttribute('font-weight', 'bold');
    lsEmergencyLabel.textContent = 'LS';
    svg.appendChild(lsEmergencyLabel);

    // LS Info
    const lsEmergencyInfo = document.createElementNS(xmlns, 'text');
    lsEmergencyInfo.setAttribute('x', lsEmergencyX);
    lsEmergencyInfo.setAttribute('y', rcdY - 12);
    lsEmergencyInfo.setAttribute('text-anchor', 'middle');
    lsEmergencyInfo.setAttribute('font-family', 'Arial');
    lsEmergencyInfo.setAttribute('font-size', '7');
    lsEmergencyInfo.setAttribute('fill', '#000');
    lsEmergencyInfo.textContent = '32A';
    svg.appendChild(lsEmergencyInfo);

    // Linie vom LS zum Umschalter
    const lsToSwitchLine = document.createElementNS(xmlns, 'line');
    lsToSwitchLine.setAttribute('x1', lsEmergencyX + 10);
    lsToSwitchLine.setAttribute('y1', rcdY);
    lsToSwitchLine.setAttribute('x2', switchX - 25);
    lsToSwitchLine.setAttribute('y2', switchY);
    lsToSwitchLine.setAttribute('stroke', '#ff9900');
    lsToSwitchLine.setAttribute('stroke-width', '3');
    lsToSwitchLine.setAttribute('stroke-dasharray', '10,5');
    svg.appendChild(lsToSwitchLine);

    // Notstrom-Label
    const emergencyLabel = document.createElementNS(xmlns, 'text');
    emergencyLabel.setAttribute('x', emergencyInv._layoutX + 50);
    emergencyLabel.setAttribute('y', emergencyY - 8);
    emergencyLabel.setAttribute('text-anchor', 'start');
    emergencyLabel.setAttribute('font-family', 'Arial');
    emergencyLabel.setAttribute('font-size', '9');
    emergencyLabel.setAttribute('fill', '#ff9900');
    emergencyLabel.setAttribute('font-weight', 'bold');
    emergencyLabel.textContent = 'Notstrom';
    svg.appendChild(emergencyLabel);

    // Netz-Leitung vom Meter zum Umschalter (Position 2 - unten)
    const meterToSwitchLine1 = document.createElementNS(xmlns, 'line');
    meterToSwitchLine1.setAttribute('x1', meterX - 30);
    meterToSwitchLine1.setAttribute('y1', meterY);
    meterToSwitchLine1.setAttribute('x2', switchX);
    meterToSwitchLine1.setAttribute('y2', meterY);
    meterToSwitchLine1.setAttribute('stroke', '#000');
    meterToSwitchLine1.setAttribute('stroke-width', '3');
    svg.appendChild(meterToSwitchLine1);

    const meterToSwitchLine2 = document.createElementNS(xmlns, 'line');
    meterToSwitchLine2.setAttribute('x1', switchX);
    meterToSwitchLine2.setAttribute('y1', meterY);
    meterToSwitchLine2.setAttribute('x2', switchX);
    meterToSwitchLine2.setAttribute('y2', switchY + 15);
    meterToSwitchLine2.setAttribute('stroke', '#000');
    meterToSwitchLine2.setAttribute('stroke-width', '3');
    svg.appendChild(meterToSwitchLine2);

    // Leitung vom Umschalter zum Haus (rechts)
    const switchToHouseLine = document.createElementNS(xmlns, 'line');
    switchToHouseLine.setAttribute('x1', switchX + 25);
    switchToHouseLine.setAttribute('y1', switchY);
    switchToHouseLine.setAttribute('x2', houseX - 20);
    switchToHouseLine.setAttribute('y2', houseY + 10);
    switchToHouseLine.setAttribute('stroke', '#000');
    switchToHouseLine.setAttribute('stroke-width', '3');
    svg.appendChild(switchToHouseLine);

    // Haus-Symbol (rechts vom Umschalter)
    const loadRect = document.createElementNS(xmlns, 'rect');
    loadRect.setAttribute('x', houseX - 20);
    loadRect.setAttribute('y', houseY);
    loadRect.setAttribute('width', '40');
    loadRect.setAttribute('height', '20');
    loadRect.setAttribute('fill', 'none');
    loadRect.setAttribute('stroke', '#000');
    loadRect.setAttribute('stroke-width', '2');
    svg.appendChild(loadRect);

    // Haus-Label
    const loadLabel = document.createElementNS(xmlns, 'text');
    loadLabel.setAttribute('x', houseX + 25);
    loadLabel.setAttribute('y', houseY + 15);
    loadLabel.setAttribute('text-anchor', 'start');
    loadLabel.setAttribute('font-family', 'Arial');
    loadLabel.setAttribute('font-size', '10');
    loadLabel.setAttribute('font-weight', 'bold');
    loadLabel.textContent = 'Haus';
    svg.appendChild(loadLabel);

  } else {
    // Normales Layout: Haus unten
    const loadBranchX = busEndX - 160; // Position on the bus line

    // Junction point on bus line for load
    const loadJunctionPoint = document.createElementNS(xmlns, 'circle');
    loadJunctionPoint.setAttribute('cx', loadBranchX);
    loadJunctionPoint.setAttribute('cy', busLineY);
    loadJunctionPoint.setAttribute('r', '3');
    loadJunctionPoint.setAttribute('fill', '#000');
    svg.appendChild(loadJunctionPoint);

    // Line down from bus line to load
    const loadToBusLine = document.createElementNS(xmlns, 'line');
    loadToBusLine.setAttribute('x1', loadBranchX);
    loadToBusLine.setAttribute('y1', busLineY);
    loadToBusLine.setAttribute('x2', loadBranchX);
    loadToBusLine.setAttribute('y2', busLineY + 80);
    loadToBusLine.setAttribute('stroke', '#000');
    loadToBusLine.setAttribute('stroke-width', '3');
    svg.appendChild(loadToBusLine);

    // Draw load symbol (Messkonzept-Style with arrows)
    const loadRect = document.createElementNS(xmlns, 'rect');
    loadRect.setAttribute('x', loadBranchX - 20);
    loadRect.setAttribute('y', busLineY + 80);
    loadRect.setAttribute('width', '40');
    loadRect.setAttribute('height', '20');
    loadRect.setAttribute('fill', 'none');
    loadRect.setAttribute('stroke', '#000');
    loadRect.setAttribute('stroke-width', '2');
    svg.appendChild(loadRect);

    // Load label
    const loadLabel = document.createElementNS(xmlns, 'text');
    loadLabel.setAttribute('x', loadBranchX + 25);
    loadLabel.setAttribute('y', busLineY + 95);
    loadLabel.setAttribute('text-anchor', 'start');
    loadLabel.setAttribute('font-family', 'Arial');
    loadLabel.setAttribute('font-size', '10');
    loadLabel.setAttribute('font-weight', 'bold');
    loadLabel.textContent = 'Haus';
    svg.appendChild(loadLabel);
  }

  // Connection from SPD Kombi to SLS
  const spdKombiToSlsLine = document.createElementNS(xmlns, 'line');
  spdKombiToSlsLine.setAttribute('x1', spdKombiX - 12);
  spdKombiToSlsLine.setAttribute('y1', meterY);
  spdKombiToSlsLine.setAttribute('x2', slsX - 12);
  spdKombiToSlsLine.setAttribute('y2', meterY);
  spdKombiToSlsLine.setAttribute('stroke', '#000');
  spdKombiToSlsLine.setAttribute('stroke-width', '3');
  svg.appendChild(spdKombiToSlsLine);

  // Add SLS 35A symbol (using factory function from js/symbols/sls.js)
  const slsGroup = window.createSLS({ x: slsX, y: meterY, rotation: 90 });
  svg.appendChild(slsGroup);

  const slsLabel = document.createElementNS(xmlns, 'text');
  slsLabel.setAttribute('x', slsX);
  slsLabel.setAttribute('y', meterY - 26);
  slsLabel.setAttribute('text-anchor', 'middle');
  slsLabel.setAttribute('font-family', 'Arial');
  slsLabel.setAttribute('font-size', '9');
  slsLabel.setAttribute('font-weight', 'bold');
  slsLabel.textContent = 'SLS';
  svg.appendChild(slsLabel);

  const slsInfo = document.createElementNS(xmlns, 'text');
  slsInfo.setAttribute('x', slsX);
  slsInfo.setAttribute('y', meterY - 16);
  slsInfo.setAttribute('text-anchor', 'middle');
  slsInfo.setAttribute('font-family', 'Arial');
  slsInfo.setAttribute('font-size', '8');
  slsInfo.setAttribute('fill', '#222');
  slsInfo.textContent = (state.slsSize || 35) + 'A';
  svg.appendChild(slsInfo);

  // Connection from SLS to HAK
  const slsToHakLine = document.createElementNS(xmlns, 'line');
  slsToHakLine.setAttribute('x1', slsX + 12);
  slsToHakLine.setAttribute('y1', meterY);
  slsToHakLine.setAttribute('x2', hakX - 15);
  slsToHakLine.setAttribute('y2', meterY);
  slsToHakLine.setAttribute('stroke', '#000');
  slsToHakLine.setAttribute('stroke-width', '3');
  svg.appendChild(slsToHakLine);



  // Connection from meter to SPD Kombi
  const meterToSpdKombiLine = document.createElementNS(xmlns, 'line');
  meterToSpdKombiLine.setAttribute('x1', meterX + 25);
  meterToSpdKombiLine.setAttribute('y1', meterY);
  meterToSpdKombiLine.setAttribute('x2', spdKombiX - 12);
  meterToSpdKombiLine.setAttribute('y2', meterY);
  meterToSpdKombiLine.setAttribute('stroke', '#000');
  meterToSpdKombiLine.setAttribute('stroke-width', '3');
  svg.appendChild(meterToSpdKombiLine);

  // Add HAK (Hauptanschlusskasten) symbol at new position
  const hakSymbol = document.createElementNS(xmlns, 'rect');
  hakSymbol.setAttribute('x', hakX - 15);
  hakSymbol.setAttribute('y', meterY - 15);
  hakSymbol.setAttribute('width', '30');
  hakSymbol.setAttribute('height', '30');
  hakSymbol.setAttribute('fill', 'none');
  hakSymbol.setAttribute('stroke', '#000');
  hakSymbol.setAttribute('stroke-width', '2');
  svg.appendChild(hakSymbol);

  // HAK internal structure (simplified)
  const hakLine1 = document.createElementNS(xmlns, 'line');
  hakLine1.setAttribute('x1', hakX - 10);
  hakLine1.setAttribute('y1', meterY - 10);
  hakLine1.setAttribute('x2', hakX + 10);
  hakLine1.setAttribute('y2', meterY - 10);
  hakLine1.setAttribute('stroke', '#000');
  hakLine1.setAttribute('stroke-width', '1');
  svg.appendChild(hakLine1);

  const hakLine2 = document.createElementNS(xmlns, 'line');
  hakLine2.setAttribute('x1', hakX - 10);
  hakLine2.setAttribute('y1', meterY);
  hakLine2.setAttribute('x2', hakX + 10);
  hakLine2.setAttribute('y2', meterY);
  hakLine2.setAttribute('stroke', '#000');
  hakLine2.setAttribute('stroke-width', '1');
  svg.appendChild(hakLine2);

  const hakLine3 = document.createElementNS(xmlns, 'line');
  hakLine3.setAttribute('x1', hakX - 10);
  hakLine3.setAttribute('y1', meterY + 10);
  hakLine3.setAttribute('x2', hakX + 10);
  hakLine3.setAttribute('y2', meterY + 10);
  hakLine3.setAttribute('stroke', '#000');
  hakLine3.setAttribute('stroke-width', '1');
  svg.appendChild(hakLine3);

  const hakLabel = document.createElementNS(xmlns, 'text');
  hakLabel.setAttribute('x', hakX);
  hakLabel.setAttribute('y', meterY - 20);
  hakLabel.setAttribute('text-anchor', 'middle');
  hakLabel.setAttribute('font-family', 'Arial');
  hakLabel.setAttribute('font-size', '9');
  hakLabel.setAttribute('font-weight', 'bold');
  hakLabel.textContent = 'HAK';
  svg.appendChild(hakLabel);

  // SPD Kombi
  // Vertical line from busbar down
  const spdKombiToBusLine = document.createElementNS(xmlns, 'line');
  spdKombiToBusLine.setAttribute('x1', spdKombiX);
  spdKombiToBusLine.setAttribute('y1', meterY);
  spdKombiToBusLine.setAttribute('x2', spdKombiX);
  spdKombiToBusLine.setAttribute('y2', meterY + 40);
  spdKombiToBusLine.setAttribute('stroke', '#000');
  spdKombiToBusLine.setAttribute('stroke-width', '2');
  svg.appendChild(spdKombiToBusLine);

  // SPD Kombi rectangle box
  const spdKombiBox = window.createSPD('SPD Kombi', { x: spdKombiX - 5, y: meterY + 40 });
  svg.appendChild(spdKombiBox);


  notes = [
    'Alle PV-Strings lassen sich an den Wechselrichteren abschalten (DC-Trennvorrichtung)',
    'Der Akkuspeicher und der Wechselrichter haben eine DC-Trennvorrichtung',
    'NA-Schutz nach VDE-AR-N 4105 integriert in Wechselrichtern',
    'Alle metallischen PV-Komponenten und SPDs sind mit dem Hauptpotentialausgleich verbunden'
  ]
  notes.unshift(`Modulbezeichnung: ${state.moduleConfig.info}`);
  let yNotes = height - ((notes.length + 1) * 15);
  // Fußnote für Hinweise
  const footnoteTitle = document.createElementNS(xmlns, 'text');
  footnoteTitle.setAttribute('x', '600');
  footnoteTitle.setAttribute('y', yNotes);
  footnoteTitle.setAttribute('font-family', 'Arial');
  footnoteTitle.setAttribute('font-size', '10');
  footnoteTitle.setAttribute('font-weight', 'bold');
  footnoteTitle.textContent = 'Hinweise:';
  svg.appendChild(footnoteTitle);

  for (let i = 0; i < notes.length; i++) {
    const noteText = document.createElementNS(xmlns, 'text');
    noteText.setAttribute('x', '600');
    noteText.setAttribute('y', yNotes + 15 * (i + 1));
    noteText.setAttribute('font-family', 'Arial');
    noteText.setAttribute('font-size', '9');
    noteText.textContent = `• ${notes[i]}`;
    svg.appendChild(noteText);
  }

  legend = [
    'HAK: Hauptanschlusskasten',
    'LS: Leitungsschutzschalter',
    'SPD: Überspannungsschutzgerät',
    'SLS: Selektiver Leitungsschutzschalter'
  ]
  let yLegend = 510;
  let xLegend = 820;
  // Fußnote für Legende
  const legendTitle = document.createElementNS(xmlns, 'text');
  legendTitle.setAttribute('x', xLegend);
  legendTitle.setAttribute('y', yLegend);
  legendTitle.setAttribute('font-family', 'Arial');
  legendTitle.setAttribute('font-size', '10');
  legendTitle.setAttribute('font-weight', 'bold');
  legendTitle.textContent = 'Legende:';
  svg.appendChild(legendTitle);

  for (let i = 0; i < legend.length; i++) {
    const legendText = document.createElementNS(xmlns, 'text');
    legendText.setAttribute('x', xLegend);
    legendText.setAttribute('y', yLegend + 15 * (i + 1));
    legendText.setAttribute('font-family', 'Arial');
    legendText.setAttribute('font-size', '9');
    legendText.textContent = `• ${legend[i]}`;
    svg.appendChild(legendText);
  }
  return svg;
};
