import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Info, ArrowDown } from "lucide-react";

interface AdvancedMetricsProps {
  data?: {
    compliance?: any;
    environmental?: any;
    fuel?: any;
  };
}

export default function AdvancedMetrics({ data }: AdvancedMetricsProps) {
  const eeoiCurrent = data?.compliance?.eeoiValue ? parseFloat(data.compliance.eeoiValue) : 8.2;
  const eeoiTarget = data?.compliance?.eeoiTarget ? parseFloat(data.compliance.eeoiTarget) : 7.8;
  const eeoiPercentage = (eeoiCurrent / eeoiTarget) * 100;

  const windSpeed = data?.environmental?.windSpeed ? parseFloat(data.environmental.windSpeed) : 12;
  const waveHeight = data?.environmental?.waveHeight ? parseFloat(data.environmental.waveHeight) : 2.1;
  const weatherImpact = data?.environmental?.weatherImpact ? parseFloat(data.environmental.weatherImpact) : 3.2;

  const fuelRate = data?.fuel?.fuelConsumptionRate ? parseFloat(data.fuel.fuelConsumptionRate) : 24.7;
  const adjustedConsumption = fuelRate * (1 - weatherImpact / 100);
  const costPerNm = 12.45;
  const dailyCost = fuelRate * 600; // Assuming $600 per MT
  const voyageCost = dailyCost * 21; // Assuming 21-day voyage
  const budgetVariance = -2.1;

  return (
    <>
      {/* Emission Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Emission Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">EEOI (Current)</span>
              <span className="font-semibold">{eeoiCurrent.toFixed(1)} g CO₂/t·nm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">EEOI (Target)</span>
              <span className="font-semibold text-gray-400">{eeoiTarget.toFixed(1)} g CO₂/t·nm</span>
            </div>
            <div className="space-y-2">
              <Progress value={Math.min(eeoiPercentage, 100)} className="h-2" />
              <div className="text-xs text-gray-500">
                {eeoiPercentage.toFixed(0)}% of target efficiency
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CII Compliance</span>
              <Badge variant="secondary" className="bg-success-green text-white">
                Grade {data?.compliance?.ciiRating || "B"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Weather Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Wind Speed</span>
              <span className="font-semibold">{windSpeed.toFixed(0)} kts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Wave Height</span>
              <span className="font-semibold">{waveHeight.toFixed(1)} m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Weather Correction</span>
              <span className="font-semibold text-alert-red">+{weatherImpact.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Adjusted Consumption</span>
              <span className="font-semibold">{adjustedConsumption.toFixed(1)} MT/day</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <Info className="h-4 w-4 mr-2" />
              <span>Moderate weather impact on fuel efficiency</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cost/Nautical Mile</span>
              <span className="font-semibold">${costPerNm.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Daily Fuel Cost</span>
              <span className="font-semibold">${dailyCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Voyage Cost</span>
              <span className="font-semibold">${voyageCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">vs Budget</span>
              <span className="font-semibold text-success-green">{budgetVariance.toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-success-green">
              <ArrowDown className="h-4 w-4 mr-2" />
              <span>${(Math.abs(budgetVariance) * voyageCost / 100).toLocaleString()} under budget</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
