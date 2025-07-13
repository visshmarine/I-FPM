import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, Satellite, AlertCircle, CheckCircle, Clock, Gauge } from "lucide-react";

interface RealTimeMonitoringProps {
  data?: any;
}

export default function RealTimeMonitoring({ data }: RealTimeMonitoringProps) {
  // IoT sensor status and real-time data
  const sensorStatus = [
    { 
      name: "Hull Roughness", 
      status: "active", 
      lastUpdate: "2 min ago", 
      value: "125.8", 
      unit: "index",
      trend: "stable"
    },
    { 
      name: "Speed (STW)", 
      status: "active", 
      lastUpdate: "1 min ago", 
      value: "14.2", 
      unit: "knots",
      trend: "increasing"
    },
    { 
      name: "Speed (SOG)", 
      status: "active", 
      lastUpdate: "1 min ago", 
      value: "13.8", 
      unit: "knots",
      trend: "stable"
    },
    { 
      name: "Propeller Slip", 
      status: "warning", 
      lastUpdate: "5 min ago", 
      value: "16.2", 
      unit: "%",
      trend: "increasing"
    }
  ];

  const connectionStatus = {
    iot: "connected",
    satellite: "connected",
    dataRate: "98.7%",
    lastSync: "30 sec ago"
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      default: return '→';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Satellite className="h-4 w-4 text-green-600" />
            Real-Time Monitoring
          </CardTitle>
          <CardDescription>
            Live IoT sensor data with satellite connectivity
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={connectionStatus.iot === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            <Wifi className="h-3 w-3 mr-1" />
            IoT: {connectionStatus.iot}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Data Rate:</span>
            <span className="ml-2 font-medium text-green-600">{connectionStatus.dataRate}</span>
          </div>
          <div>
            <span className="text-gray-600">Last Sync:</span>
            <span className="ml-2 font-medium">{connectionStatus.lastSync}</span>
          </div>
          <div>
            <span className="text-gray-600">Satellite:</span>
            <span className="ml-2 font-medium text-green-600">Connected</span>
          </div>
        </div>

        {/* Live Sensor Data */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Live Sensor Readings
          </h4>
          
          <div className="space-y-2">
            {sensorStatus.map((sensor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(sensor.status)}
                  <span className="font-medium text-sm">{sensor.name}</span>
                  <Badge className={getStatusColor(sensor.status)} variant="outline">
                    {sensor.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono">
                    {sensor.value} {sensor.unit}
                  </span>
                  <span className="text-gray-500">
                    {getTrendIcon(sensor.trend)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {sensor.lastUpdate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slip Monitoring Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-yellow-900">Propeller Efficiency Alert</span>
          </div>
          <p className="text-sm text-yellow-800">
            Propeller slip at 16.2% - monitor for efficiency trends and potential maintenance needs.
          </p>
        </div>

        {/* Real-time Features */}
        <div className="space-y-2">
          <h4 className="font-medium">Monitoring Features</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Incorporate IoT sensors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Hull roughness measurements</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Speed through water (STW)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Speed over ground (SOG)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Satellite className="h-4 w-4 mr-2" />
            Sensor Config
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Gauge className="h-4 w-4 mr-2" />
            Calibrate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}