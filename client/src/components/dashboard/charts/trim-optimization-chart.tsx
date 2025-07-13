import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingDown, ArrowUpDown, Lightbulb } from "lucide-react";

interface TrimOptimizationChartProps {
  data?: any;
}

export default function TrimOptimizationChart({ data }: TrimOptimizationChartProps) {
  // Generate trim optimization scenarios
  const trimScenarios = [
    { 
      scenario: "Current", 
      trim: 2.1, 
      fuelSaving: 0, 
      resistance: 100, 
      color: "#6b7280",
      recommended: false 
    },
    { 
      scenario: "Optimized", 
      trim: 1.8, 
      fuelSaving: 3.2, 
      resistance: 96.8, 
      color: "#10b981",
      recommended: true 
    },
    { 
      scenario: "Alternative", 
      trim: 1.5, 
      fuelSaving: 2.8, 
      resistance: 97.2, 
      color: "#3b82f6",
      recommended: false 
    }
  ];

  const currentFuelConsumption = data?.fuel?.[0]?.fuelConsumptionRate || 18.5;
  const optimizedSaving = trimScenarios[1].fuelSaving;
  const dailySavings = (currentFuelConsumption * optimizedSaving / 100 * 24).toFixed(1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-blue-600" />
            Trim Optimization Index
          </CardTitle>
          <CardDescription>
            Optimize vessel trim for fuel efficiency improvements
          </CardDescription>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {optimizedSaving}%
          </div>
          <div className="text-sm text-gray-600">Potential Savings</div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={trimScenarios} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="scenario" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'fuelSaving') return [`${value}%`, 'Fuel Saving'];
                if (name === 'resistance') return [`${value}%`, 'Hull Resistance'];
                if (name === 'trim') return [`${value}m`, 'Trim Value'];
                return [value, name];
              }}
            />
            <Bar dataKey="fuelSaving" name="fuelSaving">
              {trimScenarios.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">Recommended Action</span>
            </div>
            <p className="text-sm text-green-800">
              Optimize trim to 1.8m for 3.2% fuel savings (~{dailySavings} MT/day)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Current Trim:</span>
              <span className="ml-2 font-medium">2.1m</span>
            </div>
            <div>
              <span className="text-gray-600">Optimal Trim:</span>
              <span className="ml-2 font-medium text-green-600">1.8m</span>
            </div>
            <div>
              <span className="text-gray-600">Daily Savings:</span>
              <span className="ml-2 font-medium text-green-600">{dailySavings} MT</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}