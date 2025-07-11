import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface HullConditionProps {
  data?: any;
}

export default function HullCondition({ data }: HullConditionProps) {
  const roughnessIndex = data?.roughnessIndex ? parseFloat(data.roughnessIndex) : 150;
  const propellerSlip = data?.propellerSlip ? parseFloat(data.propellerSlip) : 15.2;
  const hullEfficiency = data?.hullEfficiency ? parseFloat(data.hullEfficiency) : -4.5;
  const daysSinceLastCleaning = data?.daysSinceLastCleaning || 89;

  const getRoughnessStatus = (index: number) => {
    if (index < 120) return { label: "Good", color: "bg-success-green" };
    if (index < 180) return { label: "Moderate", color: "bg-warning-orange" };
    return { label: "Poor", color: "bg-alert-red" };
  };

  const roughnessStatus = getRoughnessStatus(roughnessIndex);

  // Trim optimization data
  const currentTrim = data?.currentTrim ? parseFloat(data.currentTrim) : 1.2;
  const optimalTrim = 0.8;
  const potentialSavings = ((currentTrim - optimalTrim) * 2).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Hull Condition Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Hull Condition Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hull Roughness Index</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{roughnessIndex.toFixed(0)} μm</span>
                <Badge className={`${roughnessStatus.color} text-white`}>
                  {roughnessStatus.label}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Propeller Slip</span>
              <span className="font-semibold">{propellerSlip.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hull Efficiency</span>
              <span className="font-semibold text-warning-orange">{hullEfficiency.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Days Since Cleaning</span>
              <span className="font-semibold">{daysSinceLastCleaning} days</span>
            </div>
          </div>
          <Alert className="mt-4 border-warning-orange bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-warning-orange" />
            <AlertDescription className="text-yellow-800">
              Hull cleaning recommended within 30 days
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Trim Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Trim Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Trim</span>
              <span className="font-semibold">{currentTrim.toFixed(1)}m by stern</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Optimal Trim</span>
              <span className="font-semibold text-success-green">{optimalTrim.toFixed(1)}m by stern</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Potential Savings</span>
              <span className="font-semibold text-success-green">{potentialSavings}% fuel</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Trim Adjustment</span>
              <span className="font-semibold">{(optimalTrim - currentTrim).toFixed(1)}m</span>
            </div>
          </div>
          <Alert className="mt-4 border-success-green bg-green-50">
            <Lightbulb className="h-4 w-4 text-success-green" />
            <AlertDescription className="text-green-800">
              Optimize trim for $340/day fuel savings
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
