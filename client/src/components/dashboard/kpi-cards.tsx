import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel, Gauge, TrendingUp, Leaf, ArrowDown, ArrowUp, Circle } from "lucide-react";

interface KpiCardsProps {
  data?: {
    fuel?: any;
    compliance?: any;
  };
}

export default function KpiCards({ data }: KpiCardsProps) {
  const sfoc = data?.fuel?.sfoc ? parseFloat(data.fuel.sfoc) : 182.5;
  const fuelRate = data?.fuel?.fuelConsumptionRate ? parseFloat(data.fuel.fuelConsumptionRate) : 24.7;
  const loadFactor = data?.fuel?.engineLoadFactor ? parseFloat(data.fuel.engineLoadFactor) : 78.2;
  const ciiRating = data?.compliance?.ciiRating || "B";

  const sfocBaseline = 185;
  const sfocDiff = ((sfoc - sfocBaseline) / sfocBaseline) * 100;
  const fuelAverage = 24.0;
  const fuelDiff = ((fuelRate - fuelAverage) / fuelAverage) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* SFOC KPI */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">SFOC</h3>
            <Fuel className="h-5 w-5 text-maritime-blue" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{sfoc.toFixed(1)}</div>
          <div className="text-sm text-gray-500">g/kWh</div>
          <div className="flex items-center mt-2">
            {sfocDiff < 0 ? (
              <ArrowDown className="h-4 w-4 text-success-green mr-1" />
            ) : (
              <ArrowUp className="h-4 w-4 text-alert-red mr-1" />
            )}
            <span className={`text-sm ${sfocDiff < 0 ? "text-success-green" : "text-alert-red"}`}>
              {Math.abs(sfocDiff).toFixed(1)}% vs baseline
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Fuel Consumption Rate KPI */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Fuel Consumption Rate</h3>
            <Gauge className="h-5 w-5 text-maritime-blue" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{fuelRate.toFixed(1)}</div>
          <div className="text-sm text-gray-500">MT/day</div>
          <div className="flex items-center mt-2">
            {fuelDiff < 0 ? (
              <ArrowDown className="h-4 w-4 text-success-green mr-1" />
            ) : (
              <ArrowUp className="h-4 w-4 text-alert-red mr-1" />
            )}
            <span className={`text-sm ${fuelDiff < 0 ? "text-success-green" : "text-alert-red"}`}>
              {Math.abs(fuelDiff).toFixed(1)}% vs average
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Engine Load Factor KPI */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Engine Load Factor</h3>
            <TrendingUp className="h-5 w-5 text-maritime-blue" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{loadFactor.toFixed(1)}</div>
          <div className="text-sm text-gray-500">%</div>
          <div className="flex items-center mt-2">
            <Circle className="h-4 w-4 text-success-green mr-1" />
            <span className="text-sm text-gray-600">Optimal Range</span>
          </div>
        </CardContent>
      </Card>

      {/* CII Rating KPI */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">CII Rating</h3>
            <Leaf className="h-5 w-5 text-maritime-blue" />
          </div>
          <div className="text-2xl font-bold text-success-green">{ciiRating}</div>
          <div className="text-sm text-gray-500">IMO Grade</div>
          <div className="flex items-center mt-2">
            <Circle className="h-4 w-4 text-success-green mr-1" />
            <span className="text-sm text-success-green">Compliant</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
