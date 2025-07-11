import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Expand } from "lucide-react";

interface EngineLoadChartProps {
  data?: {
    fuel?: any;
    auxiliary?: any;
  };
}

export default function EngineLoadChart({ data }: EngineLoadChartProps) {
  const mainEngineLoad = data?.fuel?.engineLoadFactor ? parseFloat(data.fuel.engineLoadFactor) : 78.2;
  const auxiliaryData = data?.auxiliary;

  const chartData = [
    { name: "Main Engine", value: mainEngineLoad, color: "hsl(207, 90%, 54%)" },
    { name: "Aux Engine 1", value: 65.4, color: "hsl(174, 100%, 29%)" },
    { name: "Aux Engine 2", value: 52.1, color: "hsl(25, 100%, 50%)" },
    { name: "Aux Engine 3", value: 41.8, color: "hsl(142, 71%, 45%)" },
  ];

  const COLORS = chartData.map(item => item.color);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-800">Engine Load Distribution</CardTitle>
          <Button variant="ghost" size="sm" className="text-maritime-blue hover:text-deep-ocean">
            <Expand className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Load Factor']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
