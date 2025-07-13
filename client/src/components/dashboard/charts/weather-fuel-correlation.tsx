import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CloudRain, Wind, TrendingUp } from "lucide-react";

interface WeatherFuelCorrelationProps {
  data?: any;
}

export default function WeatherFuelCorrelation({ data }: WeatherFuelCorrelationProps) {
  // Generate weather-fuel correlation data
  const correlationData = Array.from({ length: 20 }, (_, i) => {
    const windSpeed = 5 + Math.random() * 25; // 5-30 knots
    const waveHeight = 0.5 + Math.random() * 4; // 0.5-4.5m
    const weatherImpact = windSpeed * 0.3 + waveHeight * 1.2 + Math.random() * 2;
    const fuelIncrease = Math.max(0, weatherImpact - 8) * 0.8 + Math.random() * 1.5;
    
    return {
      windSpeed: Number(windSpeed.toFixed(1)),
      waveHeight: Number(waveHeight.toFixed(1)),
      fuelIncrease: Number(fuelIncrease.toFixed(1)),
      severity: weatherImpact > 15 ? 'high' : weatherImpact > 10 ? 'medium' : 'low'
    };
  }).sort((a, b) => a.windSpeed - b.windSpeed);

  const getColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const avgFuelIncrease = correlationData.reduce((sum, item) => sum + item.fuelIncrease, 0) / correlationData.length;
  const maxImpact = Math.max(...correlationData.map(item => item.fuelIncrease));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <CloudRain className="h-4 w-4 text-blue-600" />
            Weather-Adjusted Fuel Efficiency
          </CardTitle>
          <CardDescription>
            Correlation between weather conditions and fuel consumption
          </CardDescription>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">
            +{avgFuelIncrease.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Avg Weather Impact</div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart data={correlationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="windSpeed" 
              name="Wind Speed"
              unit=" kts"
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <YAxis 
              dataKey="fuelIncrease" 
              name="Fuel Increase"
              unit="%"
              domain={['dataMin - 0.5', 'dataMax + 0.5']}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'windSpeed') return [`${value} knots`, 'Wind Speed'];
                if (name === 'fuelIncrease') return [`+${value}%`, 'Fuel Increase'];
                if (name === 'waveHeight') return [`${value}m`, 'Wave Height'];
                return [value, name];
              }}
              labelFormatter={() => 'Weather Impact'}
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-medium">Weather Conditions</p>
                      <p className="text-sm">Wind: {data.windSpeed} knots</p>
                      <p className="text-sm">Waves: {data.waveHeight}m</p>
                      <p className="text-sm font-medium text-orange-600">
                        Fuel Impact: +{data.fuelIncrease}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter dataKey="fuelIncrease" fill="#8884d8">
              {correlationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.severity)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {correlationData.filter(d => d.severity === 'low').length}
              </div>
              <div className="text-gray-600">Good Conditions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                {correlationData.filter(d => d.severity === 'medium').length}
              </div>
              <div className="text-gray-600">Moderate Impact</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {correlationData.filter(d => d.severity === 'high').length}
              </div>
              <div className="text-gray-600">Severe Impact</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Weather Alert</span>
            </div>
            <p className="text-sm text-blue-800">
              Maximum impact: +{maxImpact.toFixed(1)}% fuel increase during adverse conditions
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}