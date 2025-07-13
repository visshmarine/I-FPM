import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { DollarSign, TrendingDown, MapPin } from "lucide-react";

interface FuelCostNauticalMileProps {
  data?: any;
}

export default function FuelCostNauticalMile({ data }: FuelCostNauticalMileProps) {
  // Generate fuel cost per nautical mile data
  const costPerMileData = Array.from({ length: 7 }, (_, i) => {
    const speed = 13.8 + Math.random() * 1.2; // 13.8-15 knots
    const fuelRate = 18.2 + Math.random() * 2.8; // 18.2-21 MT/day
    const fuelPrice = 580 + Math.random() * 40; // $580-620 per MT
    const milesPerDay = speed * 24;
    const costPerMile = (fuelRate * fuelPrice) / milesPerDay;
    
    return {
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      costPerMile: Number(costPerMile.toFixed(2)),
      speed: Number(speed.toFixed(1)),
      fuelRate: Number(fuelRate.toFixed(1)),
      fuelPrice: Number(fuelPrice.toFixed(0)),
      efficiency: Number((milesPerDay / fuelRate).toFixed(1)) // nautical miles per MT
    };
  });

  const currentCost = costPerMileData[costPerMileData.length - 1]?.costPerMile || 32.5;
  const avgCost = costPerMileData.reduce((sum, item) => sum + item.costPerMile, 0) / costPerMileData.length;
  const bestEfficiency = Math.max(...costPerMileData.map(item => item.efficiency));
  const currentEfficiency = costPerMileData[costPerMileData.length - 1]?.efficiency || 16.8;

  const isEfficient = currentCost < avgCost;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            Fuel Cost per Nautical Mile
          </CardTitle>
          <CardDescription>
            Economic efficiency based on fuel usage and current prices
          </CardDescription>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            ${currentCost}
          </div>
          <div className={`text-sm flex items-center gap-1 ${isEfficient ? 'text-green-600' : 'text-red-600'}`}>
            {isEfficient ? <TrendingDown className="h-3 w-3" /> : <TrendingDown className="h-3 w-3 rotate-180" />}
            vs Avg: ${avgCost.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={costPerMileData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm">Cost/Mile: <span className="font-medium">${data.costPerMile}</span></p>
                      <p className="text-sm">Speed: {data.speed} knots</p>
                      <p className="text-sm">Fuel Rate: {data.fuelRate} MT/day</p>
                      <p className="text-sm">Efficiency: {data.efficiency} nm/MT</p>
                      <p className="text-sm">Fuel Price: ${data.fuelPrice}/MT</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={avgCost} stroke="#6b7280" strokeDasharray="5 5" label="Average" />
            <Line 
              type="monotone" 
              dataKey="costPerMile" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Current:</span>
              <span className="ml-2 font-medium">${currentCost}/nm</span>
            </div>
            <div>
              <span className="text-gray-600">Average:</span>
              <span className="ml-2 font-medium">${avgCost.toFixed(2)}/nm</span>
            </div>
            <div>
              <span className="text-gray-600">Efficiency:</span>
              <span className="ml-2 font-medium">{currentEfficiency} nm/MT</span>
            </div>
            <div>
              <span className="text-gray-600">Best:</span>
              <span className="ml-2 font-medium text-green-600">{bestEfficiency} nm/MT</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Economic Analysis</span>
            </div>
            <p className="text-sm text-blue-800">
              Current route efficiency: {currentEfficiency} nautical miles per MT fuel. 
              {isEfficient ? 'Operating below average cost.' : 'Above average cost - consider route optimization.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}