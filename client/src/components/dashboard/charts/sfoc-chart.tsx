import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Expand } from "lucide-react";
import { format } from "date-fns";

interface SfocChartProps {
  data: any[];
}

export default function SfocChart({ data }: SfocChartProps) {
  const chartData = data.map((item, index) => ({
    day: `Day ${index + 1}`,
    sfoc: parseFloat(item.sfoc || "0"),
    target: 180,
    date: new Date(item.timestamp),
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-800">SFOC Trend Analysis</CardTitle>
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
              <XAxis dataKey="day" />
              <YAxis 
                domain={[175, 190]}
                label={{ value: 'SFOC (g/kWh)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)} g/kWh`, 
                  name === 'sfoc' ? 'SFOC' : 'Target'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sfoc" 
                stroke="hsl(207, 90%, 54%)" 
                name="SFOC"
                strokeWidth={2}
                dot={{ fill: "hsl(207, 90%, 54%)" }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="hsl(142, 71%, 45%)" 
                name="Target"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
