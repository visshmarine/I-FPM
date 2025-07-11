import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Expand } from "lucide-react";

interface FuelSpeedChartProps {
  data: any[];
}

export default function FuelSpeedChart({ data }: FuelSpeedChartProps) {
  const currentData = data.map(item => ({
    speed: parseFloat(item.speedThroughWater || "0"),
    fuel: parseFloat(item.fuelConsumptionRate || "0"),
  }));

  // Generate baseline data (clean hull performance)
  const baselineData = currentData.map(item => ({
    speed: item.speed,
    fuel: item.fuel * 0.9, // Assume 10% better performance with clean hull
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-800">Fuel Consumption vs Speed</CardTitle>
          <Button variant="ghost" size="sm" className="text-maritime-blue hover:text-deep-ocean">
            <Expand className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="speed" 
                type="number"
                domain={[10, 20]}
                label={{ value: 'Speed (knots)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                dataKey="fuel" 
                type="number"
                label={{ value: 'Fuel Consumption (MT/day)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  typeof value === 'number' ? value.toFixed(1) : value,
                  name === 'fuel' ? 'Fuel (MT/day)' : 'Speed (knots)'
                ]}
              />
              <Legend />
              <Scatter 
                data={currentData} 
                fill="hsl(207, 90%, 54%)" 
                name="Current Performance"
              />
              <Scatter 
                data={baselineData} 
                fill="hsl(142, 71%, 45%)" 
                name="Baseline (Clean Hull)"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
