import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Expand } from "lucide-react";

interface HullResistanceChartProps {
  data: any[];
}

export default function HullResistanceChart({ data }: HullResistanceChartProps) {
  const chartData = [
    { speed: 10, current: 450, baseline: 420 },
    { speed: 12, current: 580, baseline: 540 },
    { speed: 14, current: 740, baseline: 690 },
    { speed: 16, current: 920, baseline: 860 },
    { speed: 18, current: 1130, baseline: 1060 },
    { speed: 20, current: 1380, baseline: 1290 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-800">Hull Resistance Analysis</CardTitle>
          <Button variant="ghost" size="sm" className="text-maritime-blue hover:text-deep-ocean">
            <Expand className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="speed" 
                label={{ value: 'Speed (knots)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Resistance (kN)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} kN`, 
                  name === 'current' ? 'Current Resistance' : 'Baseline Resistance'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="hsl(0, 84%, 60%)" 
                name="Current Resistance"
                strokeWidth={2}
                dot={{ fill: "hsl(0, 84%, 60%)" }}
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="hsl(142, 71%, 45%)" 
                name="Baseline Resistance"
                strokeWidth={2}
                dot={{ fill: "hsl(142, 71%, 45%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
