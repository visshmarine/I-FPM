import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Database, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

interface BaselineModelCardProps {
  data?: any;
}

export default function BaselineModelCard({ data }: BaselineModelCardProps) {
  // Baseline model data
  const baselineModel = {
    createdDate: "2024-01-15",
    conditions: "Calm seas, clean hull",
    dataPoints: 847,
    confidence: 94.2,
    lastUpdate: "2024-07-13",
    status: "valid",
    powerCurve: {
      baselineSfoc: 182.5,
      currentSfoc: 197.2,
      deviation: 8.1
    },
    hullPerformance: {
      baselineResistance: 100,
      currentResistance: 108.3,
      foulingFactor: 1.083
    }
  };

  const needsUpdate = new Date(baselineModel.lastUpdate) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-600" />
            Baseline Model Creation
          </CardTitle>
          <CardDescription>
            Sea trial data to establish baseline for hull and propeller performance
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={baselineModel.status === 'valid' ? 'default' : 'destructive'}>
            {baselineModel.status === 'valid' ? 'Valid' : 'Needs Update'}
          </Badge>
          {needsUpdate && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Baseline Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Created</div>
              <div className="font-medium">{baselineModel.createdDate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Data Points</div>
              <div className="font-medium">{baselineModel.dataPoints.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Conditions</div>
              <div className="font-medium text-sm">{baselineModel.conditions}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Confidence</div>
              <div className="font-medium flex items-center gap-2">
                {baselineModel.confidence}%
                {baselineModel.confidence > 90 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Last Update</div>
              <div className="font-medium">{baselineModel.lastUpdate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className={`font-medium ${needsUpdate ? 'text-yellow-600' : 'text-green-600'}`}>
                {needsUpdate ? 'Needs Refresh' : 'Current'}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="space-y-3">
          <h4 className="font-medium">Current vs Baseline Performance</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">SFOC Performance</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {baselineModel.powerCurve.baselineSfoc} → {baselineModel.powerCurve.currentSfoc} g/kWh
                </span>
                <Badge variant="destructive">+{baselineModel.powerCurve.deviation}%</Badge>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Hull Resistance</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {baselineModel.hullPerformance.baselineResistance} → {baselineModel.hullPerformance.currentResistance}
                </span>
                <Badge variant="destructive">+{((baselineModel.hullPerformance.foulingFactor - 1) * 100).toFixed(1)}%</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Hybrid Modeling Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Hybrid Modeling</span>
          </div>
          <p className="text-sm text-blue-800">
            Applying hybrid modeling to extrapolate performance across different draughts and trims based on baseline data.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Baseline
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Database className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>

        {needsUpdate && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Recommendation:</strong> Baseline model is over 90 days old. Consider updating with recent sea trial data for improved accuracy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}