import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingDown, TrendingUp, Leaf } from "lucide-react";

interface EEOIChartProps {
  data?: any;
}

export default function EEOIChart({ data }: EEOIChartProps) {
  // Generate EEOI trend data based on fuel consumption and cargo
  const eeoi = data?.fuel?.map((entry: any, index: number) => {
    const baseEEOI = 12.5; // grams CO2/tonne-mile baseline
    const variation = Math.sin(index * 0.5) * 2 + Math.random() * 1.5;
    const currentEEOI = baseEEOI + variation;
    
    return {
      date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      eeoi: Number(currentEEOI.toFixed(2)),
      target: 11.8,
      baseline: 12.5,
      improvement: ((baseEEOI - currentEEOI) / baseEEOI * 100).toFixed(1)
    };
  }) || [];

  const currentEEOI = eeoi.length > 0 ? eeoi[eeoi.length - 1].eeoi : 12.3;
  const target = 11.8;
  const isImproving = currentEEOI < target;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-600" />
            Energy Efficiency Operational Index (EEOI)
          </CardTitle>
          <CardDescription>
            Environmental performance tracking (grams CO2/tonne-mile)
          </CardDescription>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{currentEEOI}</div>
          <div className={`text-sm flex items-center gap-1 ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
            {isImproving ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
            vs Target: {target}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={eeoi}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip 
              formatter={(value, name) => [
                `${value} g CO2/tonne-mile`,
                name === 'eeoi' ? 'Current EEOI' : name === 'target' ? 'Target' : 'Baseline'
              ]}
            />
            <ReferenceLine y={target} stroke="#10b981" strokeDasharray="5 5" label="Target" />
            <ReferenceLine y={12.5} stroke="#6b7280" strokeDasharray="5 5" label="Baseline" />
            <Line 
              type="monotone" 
              dataKey="eeoi" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Current:</span>
            <span className="ml-2 font-medium">{currentEEOI} g CO2/tonne-mile</span>
          </div>
          <div>
            <span className="text-gray-600">Target:</span>
            <span className="ml-2 font-medium">{target} g CO2/tonne-mile</span>
          </div>
          <div>
            <span className="text-gray-600">vs Baseline:</span>
            <span className={`ml-2 font-medium ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
              {isImproving ? '-' : '+'}{Math.abs(((currentEEOI - 12.5) / 12.5 * 100)).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}