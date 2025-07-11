import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AuxiliaryChartProps {
  data?: any;
}

export default function AuxiliaryChart({ data }: AuxiliaryChartProps) {
  const chartData = [
    { 
      name: "HVAC", 
      power: data?.hvacPower ? parseFloat(data.hvacPower) : 85,
      color: "hsl(207, 90%, 54%)"
    },
    { 
      name: "Pumps", 
      power: data?.pumpsPower ? parseFloat(data.pumpsPower) : 120,
      color: "hsl(174, 100%, 29%)"
    },
    { 
      name: "Lighting", 
      power: data?.lightingPower ? parseFloat(data.lightingPower) : 35,
      color: "hsl(25, 100%, 50%)"
    },
    { 
      name: "Navigation", 
      power: data?.navigationPower ? parseFloat(data.navigationPower) : 45,
      color: "hsl(142, 71%, 45%)"
    },
    { 
      name: "Cargo", 
      power: data?.cargoHandlingPower ? parseFloat(data.cargoHandlingPower) : 95,
      color: "hsl(291, 64%, 42%)"
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">Auxiliary Systems</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)} kW`, 'Power']} />
              <Bar dataKey="power" fill="hsl(207, 90%, 54%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
