import type { IStorage } from "../../../server/storage";
import type {
  InsertFuelData,
  InsertEnvironmentalData,
  InsertHullCondition,
  InsertTrimData,
  InsertComplianceData,
  InsertAuxiliaryData,
} from "@shared/schema";

export async function generateRealisticData(storage: IStorage) {
  const ships = await storage.getShips();
  const voyages = await storage.getVoyages();

  // Generate data for each ship
  for (const ship of ships) {
    const shipVoyages = voyages.filter(v => v.shipId === ship.id);
    const currentVoyage = shipVoyages.find(v => v.status === "active");

    // Generate last 7 days of data
    for (let i = 6; i >= 0; i--) {
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - i);
      timestamp.setHours(12, 0, 0, 0); // Set to noon

      // Generate fuel data
      const baseSpeed = 14 + Math.random() * 4; // 14-18 knots
      const engineLoad = 70 + Math.random() * 20; // 70-90%
      const sfoc = 180 + Math.random() * 10 + (i * 0.5); // Gradual increase over time
      const fuelConsumption = 20 + Math.random() * 10 + (engineLoad / 100) * 5;

      const fuelData: InsertFuelData = {
        shipId: ship.id,
        voyageId: currentVoyage?.id || null,
        timestamp,
        sfoc: sfoc.toFixed(2),
        fuelConsumptionRate: fuelConsumption.toFixed(2),
        engineLoadFactor: engineLoad.toFixed(2),
        speedThroughWater: baseSpeed.toFixed(2),
        speedOverGround: (baseSpeed + Math.random() * 2 - 1).toFixed(2),
        enginePower: (engineLoad / 100 * parseFloat(ship.enginePower || "20000")).toFixed(2),
        fuelType: "HFO",
        co2Emissions: (fuelConsumption * 3.114).toFixed(2), // CO2 factor for HFO
      };

      await storage.createFuelData(fuelData);

      // Generate environmental data
      const windSpeed = 8 + Math.random() * 12; // 8-20 knots
      const waveHeight = 1 + Math.random() * 2; // 1-3 meters
      const weatherImpact = Math.min(windSpeed / 20 * 5, 5); // Up to 5% impact

      const environmentalData: InsertEnvironmentalData = {
        shipId: ship.id,
        voyageId: currentVoyage?.id || null,
        timestamp,
        windSpeed: windSpeed.toFixed(2),
        waveHeight: waveHeight.toFixed(2),
        windDirection: Math.floor(Math.random() * 360),
        seaState: Math.floor(waveHeight * 2), // Rough calculation
        weatherImpact: weatherImpact.toFixed(2),
      };

      await storage.createEnvironmentalData(environmentalData);

      // Generate trim data
      const currentTrim = 0.8 + Math.random() * 0.8; // 0.8-1.6m by stern
      const optimalTrim = 0.6 + Math.random() * 0.4; // 0.6-1.0m by stern
      const fuelSavings = Math.max(0, (currentTrim - optimalTrim) * 2); // 2% per 0.1m difference

      const trimData: InsertTrimData = {
        shipId: ship.id,
        voyageId: currentVoyage?.id || null,
        timestamp,
        currentTrim: currentTrim.toFixed(2),
        optimalTrim: optimalTrim.toFixed(2),
        fuelSavingsPotential: fuelSavings.toFixed(2),
        trimAdjustment: (optimalTrim - currentTrim).toFixed(2),
      };

      await storage.createTrimData(trimData);

      // Generate compliance data
      const ciiRatings = ["A", "B", "C", "D", "E"];
      const ciiRating = ciiRatings[Math.floor(Math.random() * 2) + 1]; // Mostly B or C
      const eeoiValue = 7 + Math.random() * 3; // 7-10 g CO2/t·nm
      const eeoiTarget = 7.8;

      const complianceData: InsertComplianceData = {
        shipId: ship.id,
        voyageId: currentVoyage?.id || null,
        timestamp,
        ciiRating,
        ciiValue: (10 + Math.random() * 5).toFixed(2),
        eeoiValue: eeoiValue.toFixed(2),
        eeoiTarget: eeoiTarget.toFixed(2),
        complianceStatus: ciiRating <= "C" ? "Compliant" : "Non-Compliant",
      };

      await storage.createComplianceData(complianceData);

      // Generate auxiliary data
      const auxiliaryData: InsertAuxiliaryData = {
        shipId: ship.id,
        timestamp,
        hvacPower: (80 + Math.random() * 20).toFixed(2), // 80-100 kW
        pumpsPower: (100 + Math.random() * 40).toFixed(2), // 100-140 kW
        lightingPower: (30 + Math.random() * 10).toFixed(2), // 30-40 kW
        navigationPower: (40 + Math.random() * 10).toFixed(2), // 40-50 kW
        cargoHandlingPower: (70 + Math.random() * 50).toFixed(2), // 70-120 kW
        totalAuxiliaryPower: "0", // Will be calculated
      };

      // Calculate total auxiliary power
      const total = parseFloat(auxiliaryData.hvacPower) + 
                   parseFloat(auxiliaryData.pumpsPower) + 
                   parseFloat(auxiliaryData.lightingPower) + 
                   parseFloat(auxiliaryData.navigationPower) + 
                   parseFloat(auxiliaryData.cargoHandlingPower);
      auxiliaryData.totalAuxiliaryPower = total.toFixed(2);

      await storage.createAuxiliaryData(auxiliaryData);
    }

    // Generate hull condition data (less frequent)
    const hullTimestamp = new Date();
    hullTimestamp.setHours(12, 0, 0, 0);

    const daysSinceLastCleaning = 60 + Math.floor(Math.random() * 60); // 60-120 days
    const roughnessIndex = 100 + daysSinceLastCleaning * 0.8; // Increases over time
    const propellerSlip = 12 + Math.random() * 6; // 12-18%
    const hullEfficiency = -(roughnessIndex - 100) / 20; // Negative efficiency impact

    const hullCondition: InsertHullCondition = {
      shipId: ship.id,
      timestamp: hullTimestamp,
      roughnessIndex: roughnessIndex.toFixed(2),
      propellerSlip: propellerSlip.toFixed(2),
      hullEfficiency: hullEfficiency.toFixed(2),
      daysSinceLastCleaning,
      lastCleaningDate: new Date(Date.now() - daysSinceLastCleaning * 24 * 60 * 60 * 1000),
    };

    await storage.createHullCondition(hullCondition);
  }
}
