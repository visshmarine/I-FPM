export interface HullCalculationInputs {
  currentPower: number;        // kW
  baselinePower: number;       // kW
  currentSpeed: number;        // knots
  baselineSpeed: number;       // knots
  currentSfoc: number;         // g/kWh
  baselineSfoc: number;        // g/kWh
  seaState?: number;           // 0-9
  windSpeed?: number;          // knots
  waveHeight?: number;         // meters
}

export interface HullCalculationResults {
  hullRoughnessIndex: number;
  hullEfficiency: number;
  performanceDegradation: number;
  recommendedAction: string;
  calculationMethod: string;
  weatherCorrected: boolean;
}

export class HullPerformanceCalculator {
  
  /**
   * Calculate Hull Roughness Index using power-based method
   */
  calculateHullRoughnessIndex(inputs: HullCalculationInputs): number {
    const { currentPower, baselinePower } = inputs;
    
    if (!baselinePower || baselinePower <= 0) {
      throw new Error("Baseline power must be greater than 0");
    }
    
    return (currentPower / baselinePower) * 100;
  }

  /**
   * Calculate Hull Efficiency (performance degradation)
   */
  calculateHullEfficiency(inputs: HullCalculationInputs): number {
    const { currentSfoc, baselineSfoc } = inputs;
    
    if (!baselineSfoc || baselineSfoc <= 0) {
      throw new Error("Baseline SFOC must be greater than 0");
    }
    
    return ((currentSfoc - baselineSfoc) / baselineSfoc) * 100;
  }

  /**
   * Apply weather corrections based on ISO 15016 principles
   */
  applyWeatherCorrections(inputs: HullCalculationInputs): HullCalculationInputs {
    let correctedPower = inputs.currentPower;
    
    // Wind resistance correction
    if (inputs.windSpeed && inputs.windSpeed > 0) {
      const windCorrection = this.calculateWindResistance(inputs.windSpeed, inputs.currentSpeed);
      correctedPower -= windCorrection;
    }
    
    // Wave resistance correction
    if (inputs.waveHeight && inputs.waveHeight > 0) {
      const waveCorrection = this.calculateWaveResistance(inputs.waveHeight, inputs.currentSpeed);
      correctedPower -= waveCorrection;
    }
    
    return {
      ...inputs,
      currentPower: Math.max(correctedPower, inputs.currentPower * 0.7) // Minimum 70% of original
    };
  }

  /**
   * Calculate wind resistance based on wind speed and vessel speed
   */
  private calculateWindResistance(windSpeed: number, vesselSpeed: number): number {
    // Simplified wind resistance calculation
    // Real implementation would consider wind direction, vessel dimensions, etc.
    const relativeWindSpeed = windSpeed + vesselSpeed * 0.514; // Convert knots to m/s
    const windResistance = 0.5 * 1.225 * 0.05 * Math.pow(relativeWindSpeed, 2); // Simplified formula
    
    // Convert resistance to power (kW) - approximate
    return windResistance * vesselSpeed * 0.514 / 1000; // Very simplified conversion
  }

  /**
   * Calculate additional resistance due to waves
   */
  private calculateWaveResistance(waveHeight: number, vesselSpeed: number): number {
    // Simplified wave resistance calculation
    const waveResistance = 2.5 * Math.pow(waveHeight, 2) * Math.pow(vesselSpeed, 1.5);
    return waveResistance / 1000; // Convert to kW
  }

  /**
   * Get recommendation based on hull roughness index
   */
  getMaintenanceRecommendation(hri: number): string {
    if (hri <= 110) {
      return "Hull condition excellent. No immediate action required.";
    } else if (hri <= 120) {
      return "Hull condition good. Monitor trend and plan cleaning within 3-6 months.";
    } else if (hri <= 140) {
      return "Hull condition fair. Consider hull cleaning within 1-3 months for optimal efficiency.";
    } else if (hri <= 160) {
      return "Hull condition poor. Hull cleaning recommended within 30 days to avoid significant fuel penalties.";
    } else {
      return "Hull condition critical. Immediate hull cleaning required. Significant fuel waste occurring.";
    }
  }

  /**
   * Comprehensive hull performance analysis
   */
  calculateHullPerformance(inputs: HullCalculationInputs): HullCalculationResults {
    // Apply weather corrections if environmental data is available
    const weatherCorrected = !!(inputs.windSpeed || inputs.waveHeight || inputs.seaState);
    const correctedInputs = weatherCorrected ? this.applyWeatherCorrections(inputs) : inputs;
    
    // Calculate metrics
    const hullRoughnessIndex = this.calculateHullRoughnessIndex(correctedInputs);
    const hullEfficiency = this.calculateHullEfficiency(correctedInputs);
    const performanceDegradation = Math.max(0, hullEfficiency); // Only positive degradation
    
    // Get maintenance recommendation
    const recommendedAction = this.getMaintenanceRecommendation(hullRoughnessIndex);
    
    return {
      hullRoughnessIndex: Math.round(hullRoughnessIndex * 10) / 10,
      hullEfficiency: Math.round(hullEfficiency * 10) / 10,
      performanceDegradation: Math.round(performanceDegradation * 10) / 10,
      recommendedAction,
      calculationMethod: "Power-based with SFOC efficiency analysis",
      weatherCorrected
    };
  }

  /**
   * Calculate economic impact of hull fouling
   */
  calculateEconomicImpact(
    inputs: HullCalculationInputs,
    fuelPrice: number = 600, // USD per MT
    dailyOperatingHours: number = 24
  ): {
    additionalFuelCost: number;
    annualExtraCost: number;
    paybackPeriod: number; // days for hull cleaning ROI
  } {
    const results = this.calculateHullPerformance(inputs);
    
    // Calculate additional fuel consumption
    const additionalFuelPerHour = (inputs.currentPower * inputs.currentSfoc - 
                                  inputs.baselinePower * inputs.baselineSfoc) / 1000000; // MT/hour
    
    const dailyExtraFuel = additionalFuelPerHour * dailyOperatingHours;
    const additionalFuelCost = dailyExtraFuel * fuelPrice;
    const annualExtraCost = additionalFuelCost * 365;
    
    // Estimate hull cleaning cost and payback period
    const estimatedCleaningCost = 50000; // USD - typical hull cleaning cost
    const paybackPeriod = estimatedCleaningCost / additionalFuelCost;
    
    return {
      additionalFuelCost: Math.round(additionalFuelCost),
      annualExtraCost: Math.round(annualExtraCost),
      paybackPeriod: Math.round(paybackPeriod)
    };
  }
}

export const hullCalculator = new HullPerformanceCalculator();