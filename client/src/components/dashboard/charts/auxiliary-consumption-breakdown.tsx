import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Zap, Thermometer, Fan, Lightbulb } from "lucide-react";

interface AuxiliaryConsumptionBreakdownProps {
  data?: any;
}

export default function AuxiliaryConsumptionBreakdown({ data }: AuxiliaryConsumptionBreakdownProps) {
  // Generate auxiliary system consumption breakdown
  const auxiliaryBreakdown = [
    { 
      system: "HVAC", 
      consumption: 4.2, 
      percentage: 40, 
      icon: Fan,
      color: "#3b82f6",
      status: "normal"
    },
    { 
      system: "Pumps", 
      consumption: 3.1, 
      percentage: 30, 
      icon: Zap,
      color: "#10b981",
      status: "normal"
    },
    { 
      system: "Lighting", 
      consumption: 1.6, 
      percentage: 15, 
      icon: Lightbulb,
      color: "#f59e0b",
      status: "high"
    },
    { 
      system: "Galley", 
      consumption: 1.05, 
      percentage: 10, 
      icon: Thermometer,
      color: "#ef4444",
      status: "normal"
    },
    { 
      system: "Others", 
      consumption: 0.52, 
      percentage: 5, 
      icon: Zap,
      color: "#8b5cf6",
      status: "normal"
    }
  ];

  const totalConsumption = auxiliaryBreakdown.reduce((sum, item) => sum + item.consumption, 0);
  const highConsumptionSystems = auxiliaryBreakdown.filter(item => item.status === "high");

  // Trend data for the last 7 days
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${7-i}`,
    hvac: 4.2 + (Math.random() - 0.5) * 0.8,
    pumps: 3.1 + (Math.random() - 0.5) * 0.6,
    lighting: 1.6 + (Math.random() - 0.5) * 0.4,
    total: 0
  })).map(item => ({
    ...item,
    total: Number((item.hvac + item.pumps + item.lighting + 1.57).toFixed(1))
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            Auxiliary Engine Fuel Consumption
          </CardTitle>
          <CardDescription>
            Energy usage breakdown for non-propulsion systems
          </CardDescription>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {totalConsumption.toFixed(1)} MT/day
          </div>
          <div className="text-sm text-gray-600">Total Auxiliary Consumption</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div>
            <h4 className="font-medium mb-2">System Breakdown</h4>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={auxiliaryBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="consumption"
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  {auxiliaryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} MT/day`, 'Consumption']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* System List */}
          <div>
            <h4 className="font-medium mb-2">Systems</h4>
            <div className="space-y-2">
              {auxiliaryBreakdown.map((system, index) => {
                const Icon = system.icon;
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" style={{ color: system.color }} />
                      <span>{system.system}</span>
                      {system.status === "high" && (
                        <span className="text-xs bg-red-100 text-red-700 px-1 rounded">HIGH</span>
                      )}
                    </div>
                    <span className="font-medium">{system.consumption} MT</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 7-day Trend */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">7-Day Consumption Trend</h4>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} MT/day`, 'Total Consumption']} />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Optimization Suggestions */}
        {highConsumptionSystems.length > 0 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-900">Optimization Opportunity</span>
            </div>
            <p className="text-sm text-yellow-800">
              {highConsumptionSystems[0].system} consumption is higher than average. 
              Consider scheduling maintenance or optimizing usage patterns.
            </p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Peak System:</span>
            <span className="ml-2 font-medium">{auxiliaryBreakdown[0].system}</span>
          </div>
          <div>
            <span className="text-gray-600">Daily Cost:</span>
            <span className="ml-2 font-medium">${(totalConsumption * 600).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}