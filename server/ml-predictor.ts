import OpenAI from "openai";
import { storage } from "./storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export interface PredictiveMaintenanceRecommendation {
  component: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  estimatedDaysToFailure: number;
  confidence: number;
  recommendation: string;
  detailedAnalysis: string;
  costImplication: string;
}

export interface WeatherAdjustedPerformance {
  adjustedSfoc: number;
  weatherImpactFactor: number;
  performanceScore: number;
  optimizationRecommendations: string[];
}

export class MLPredictor {
  async generatePredictiveMaintenanceRecommendations(
    shipId: number
  ): Promise<PredictiveMaintenanceRecommendation[]> {
    try {
      // Gather comprehensive data for ML analysis
      const [ship, fuelData, hullCondition, auxiliaryData, environmentalData] = await Promise.all([
        storage.getShip(shipId),
        storage.getFuelData(shipId, undefined, 50),
        storage.getHullCondition(shipId, 20),
        storage.getAuxiliaryData(shipId, 30),
        storage.getEnvironmentalData(shipId, undefined, 30)
      ]);

      if (!ship || !fuelData.length) {
        throw new Error("Insufficient data for ML analysis");
      }

      // Prepare data for ML analysis
      const analysisData = {
        ship: {
          name: ship.name,
          type: ship.type,
          deadweight: ship.deadweight,
          enginePower: ship.enginePower
        },
        fuelPerformance: fuelData.map(d => ({
          sfoc: d.sfoc,
          fuelConsumptionRate: d.fuelConsumptionRate,
          engineLoad: d.engineLoad,
          timestamp: d.timestamp
        })),
        hullCondition: hullCondition.map(h => ({
          roughnessIndex: h.roughnessIndex,
          propellerSlip: h.propellerSlip,
          hullEfficiency: h.hullEfficiency,
          daysSinceLastCleaning: h.daysSinceLastCleaning
        })),
        auxiliaryPower: auxiliaryData.map(a => ({
          hvacPower: a.hvacPower,
          pumpsPower: a.pumpsPower,
          totalAuxiliaryPower: a.totalAuxiliaryPower
        })),
        environmentalConditions: environmentalData.map(e => ({
          windSpeed: e.windSpeed,
          waveHeight: e.waveHeight,
          weatherImpact: e.weatherImpact
        }))
      };

      const prompt = `
As a maritime engineering AI specialist, analyze the following vessel data and provide predictive maintenance recommendations:

${JSON.stringify(analysisData, null, 2)}

Based on the fuel consumption trends, hull condition, auxiliary system performance, and environmental factors, identify potential maintenance issues before they become critical.

Provide your analysis as a JSON array of maintenance recommendations, each containing:
- component: The ship component/system requiring attention
- priority: Risk level (LOW, MEDIUM, HIGH, CRITICAL)
- estimatedDaysToFailure: Estimated days until failure (if no action taken)
- confidence: Confidence level (0.0 to 1.0)
- recommendation: Specific maintenance action required
- detailedAnalysis: Technical explanation of the issue
- costImplication: Estimated cost impact category

Focus on:
1. Engine performance degradation patterns
2. Hull fouling and cleaning requirements  
3. Auxiliary system inefficiencies
4. Weather-related wear patterns
5. Fuel efficiency optimization opportunities

Respond only with valid JSON.
      `;

      if (!openai) {
        // Fallback to rule-based analysis if OpenAI is unavailable
        return this.fallbackMaintenanceAnalysis(shipId);
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert maritime engineering AI that provides data-driven predictive maintenance recommendations. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.recommendations || [];

    } catch (error) {
      console.error("ML Prediction Error:", error);
      // Fallback to rule-based analysis if OpenAI is unavailable
      return this.fallbackMaintenanceAnalysis(shipId);
    }
  }

  async calculateWeatherAdjustedPerformance(
    shipId: number,
    voyageId?: number
  ): Promise<WeatherAdjustedPerformance> {
    try {
      const [fuelData, environmentalData] = await Promise.all([
        storage.getFuelData(shipId, voyageId, 24), // Last 24 hours
        storage.getEnvironmentalData(shipId, voyageId, 24)
      ]);

      if (!fuelData.length || !environmentalData.length) {
        throw new Error("Insufficient data for weather adjustment");
      }

      const analysisData = {
        fuelMetrics: fuelData.map(f => ({
          sfoc: parseFloat(f.sfoc || "0"),
          engineLoad: parseFloat(f.engineLoad || "0"),
          timestamp: f.timestamp
        })),
        weatherConditions: environmentalData.map(e => ({
          windSpeed: parseFloat(e.windSpeed || "0"),
          waveHeight: parseFloat(e.waveHeight || "0"),
          seaState: e.seaState || 0,
          weatherImpact: e.weatherImpact
        }))
      };

      const prompt = `
Analyze the following vessel performance data and weather conditions to calculate weather-adjusted fuel efficiency:

${JSON.stringify(analysisData, null, 2)}

Calculate weather-adjusted performance metrics considering:
1. Wind resistance effects on fuel consumption
2. Wave height impact on engine load
3. Sea state influence on propeller efficiency
4. Overall weather impact factor

Provide your analysis as JSON with:
- adjustedSfoc: Weather-corrected SFOC value
- weatherImpactFactor: Factor representing weather influence (0.8-1.2)
- performanceScore: Overall performance rating (0-100)
- optimizationRecommendations: Array of specific optimization suggestions

Respond only with valid JSON.
      `;

      if (!openai) {
        // Fallback to rule-based analysis if OpenAI is unavailable
        return this.fallbackWeatherAnalysis();
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert in maritime performance analysis and weather impact calculations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        adjustedSfoc: result.adjustedSfoc || 200,
        weatherImpactFactor: result.weatherImpactFactor || 1.0,
        performanceScore: result.performanceScore || 75,
        optimizationRecommendations: result.optimizationRecommendations || []
      };

    } catch (error) {
      console.error("Weather Adjustment Error:", error);
      return this.fallbackWeatherAnalysis();
    }
  }

  private async fallbackMaintenanceAnalysis(shipId: number): Promise<PredictiveMaintenanceRecommendation[]> {
    // Rule-based analysis when ML is unavailable
    const hullData = await storage.getLatestHullCondition(shipId);
    const fuelData = await storage.getLatestFuelData(shipId);
    
    const recommendations: PredictiveMaintenanceRecommendation[] = [];

    if (hullData && hullData.daysSinceLastCleaning && hullData.daysSinceLastCleaning > 180) {
      recommendations.push({
        component: "Hull",
        priority: "HIGH",
        estimatedDaysToFailure: 60,
        confidence: 0.85,
        recommendation: "Schedule hull cleaning and inspection",
        detailedAnalysis: "Hull has not been cleaned for over 180 days, leading to increased fuel consumption",
        costImplication: "Medium ($50k-100k)"
      });
    }

    if (fuelData && parseFloat(fuelData.sfoc || "0") > 220) {
      recommendations.push({
        component: "Main Engine",
        priority: "MEDIUM",
        estimatedDaysToFailure: 90,
        confidence: 0.75,
        recommendation: "Engine performance optimization required",
        detailedAnalysis: "SFOC values indicate declining engine efficiency",
        costImplication: "Low ($10k-25k)"
      });
    }

    return recommendations;
  }

  private fallbackWeatherAnalysis(): WeatherAdjustedPerformance {
    return {
      adjustedSfoc: 200,
      weatherImpactFactor: 1.0,
      performanceScore: 75,
      optimizationRecommendations: [
        "Monitor weather conditions for route optimization",
        "Adjust engine load based on sea state"
      ]
    };
  }
}

export const mlPredictor = new MLPredictor();