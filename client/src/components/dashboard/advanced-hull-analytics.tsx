import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from "recharts";
import { Microscope, TrendingDown, AlertTriangle, Settings, RefreshCw } from "lucide-react";

interface AdvancedHullAnalyticsProps {
  data?: any;
}

export default function AdvancedHullAnalytics({ data }: AdvancedHullAnalyticsProps) {
  // CFD modeling data
  const cfdAnalysis = {
    lastUpdate: "2024-07-10",
    modelAccuracy: 96.3,
    processingTime: "4.2 hours",
    weatherCorrected: true
  };

  // Hull performance prediction data
  const hullTrendData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    baseline: 100,
    predicted: 100 + (i * 1.8) + Math.random() * 2,
    actual: 100 + (i * 1.6) + Math.random() * 3,
    foulingRate: 1.5 + (i * 0.15)
  }));

  // Weather correlation analysis
  const weatherCorrelation = Array.from({ length: 15 }, (_, i) => {
    const windSpeed = 5 + Math.random() * 20;
    const waveHeight = 1 + Math.random() * 3;
    const resistance = 100 + windSpeed * 0.8 + waveHeight * 2.5 + Math.random() * 5;
    
    return {
      windSpeed: Number(windSpeed.toFixed(1)),
      waveHeight: Number(waveHeight.toFixed(1)),
      resistance: Number(resistance.toFixed(1)),
      impact: Number(((resistance - 100) / 100 * 100).toFixed(1))
    };
  });

  // Fouling impact thresholds
  const fouliningImpact = weatherCorrelation.find(d => d.resistance > 110);
  const severeConditions = weatherCorrelation.filter(d => d.resistance > 115).length;

  // Anomaly detection alerts
  const anomalies = [
    {
      type: "resistance",
      severity: "medium",
      description: "6% deviation from baseline resistance",
      timestamp: "2 hours ago",
      recommendation: "Monitor hull condition"
    },
    {
      type: "fouling",
      severity: "high", 
      description: "Accelerated fouling detected",
      timestamp: "1 day ago",
      recommendation: "Schedule hull cleaning assessment"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Microscope className="h-4 w-4 text-purple-600" />
            Advanced Analytics
          </CardTitle>
          <CardDescription>
            CFD modeling, towing tank results, and predictive hull performance
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800">
            CFD Model: {cfdAnalysis.modelAccuracy}% accuracy
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cfd" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cfd">CFD Analysis</TabsTrigger>
            <TabsTrigger value="trends">Hull Trends</TabsTrigger>
            <TabsTrigger value="weather">Weather Impact</TabsTrigger>
            <TabsTrigger value="alerts">Anomaly Detection</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cfd" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">CFD Model Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Update:</span>
                    <span className="font-medium">{cfdAnalysis.lastUpdate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model Accuracy:</span>
                    <span className="font-medium text-green-600">{cfdAnalysis.modelAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-medium">{cfdAnalysis.processingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weather Correction:</span>
                    <span className="font-medium text-blue-600">
                      {cfdAnalysis.weatherCorrected ? 'Applied' : 'Not Applied'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Integration Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Weather data integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Resistance correction applied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Real-time fuel usage trends</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Towing tank results integrated</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                <strong>Advanced CFD Integration:</strong> Leveraging computational fluid dynamics models 
                for detailed hull performance predictions with real-time weather data correlation.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hullTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'baseline') return [`${value}`, 'Baseline'];
                  if (name === 'predicted') return [`${value}`, 'Predicted'];
                  if (name === 'actual') return [`${value}`, 'Actual'];
                  return [value, name];
                }} />
                <Line type="monotone" dataKey="baseline" stroke="#6b7280" strokeDasharray="5 5" name="baseline" />
                <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} name="predicted" />
                <Line type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={2} name="actual" />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Current Deviation:</span>
                <span className="ml-2 font-medium text-red-600">+8.3% vs baseline</span>
              </div>
              <div>
                <span className="text-gray-600">Predicted Trend:</span>
                <span className="ml-2 font-medium text-orange-600">Degrading</span>
              </div>
              <div>
                <span className="text-gray-600">Fouling Rate:</span>
                <span className="ml-2 font-medium">2.1%/month</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weather" className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart data={weatherCorrelation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="windSpeed" name="Wind Speed" unit=" kts" />
                <YAxis dataKey="resistance" name="Hull Resistance" unit="%" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'resistance') return [`${value}%`, 'Hull Resistance'];
                    return [value, name];
                  }}
                  labelFormatter={() => 'Weather Impact'}
                />
                <Scatter dataKey="resistance" fill="#3b82f6">
                  {weatherCorrelation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.resistance > 115 ? '#ef4444' : entry.resistance > 110 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Severe Conditions:</span>
                <span className="ml-2 font-medium text-red-600">{severeConditions} cases</span>
              </div>
              <div>
                <span className="text-gray-600">Max Impact:</span>
                <span className="ml-2 font-medium">+{Math.max(...weatherCorrelation.map(d => d.impact)).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-600">Avg Impact:</span>
                <span className="ml-2 font-medium">+{(weatherCorrelation.reduce((sum, d) => sum + d.impact, 0) / weatherCorrelation.length).toFixed(1)}%</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Anomaly Detection
              </h4>
              
              {anomalies.map((anomaly, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getSeverityColor(anomaly.severity)}>
                      {anomaly.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">{anomaly.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium mb-1">{anomaly.description}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Recommendation:</strong> {anomaly.recommendation}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Detection Features:</strong> Set thresholds for fouling impact (6% deviation from baseline), 
                trigger alerts for hull cleaning or propeller polishing recommendations.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Configure Alerts
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Analysis
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}