import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

interface AlertsProps {
  data?: {
    hull?: any;
    compliance?: any;
  };
}

export default function Alerts({ data }: AlertsProps) {
  const alerts = [
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Hull Cleaning Required",
      description: "Efficiency degraded by 4.5%",
      time: "2h ago",
      bgColor: "bg-yellow-50",
      textColor: "text-warning-orange",
    },
    {
      type: "info",
      icon: Info,
      title: "Trim Optimization Available",
      description: "Potential 2.3% fuel savings",
      time: "4h ago",
      bgColor: "bg-blue-50",
      textColor: "text-maritime-blue",
    },
    {
      type: "success",
      icon: CheckCircle,
      title: "CII Compliance Maintained",
      description: `Grade ${data?.compliance?.ciiRating || "B"} rating confirmed`,
      time: "6h ago",
      bgColor: "bg-green-50",
      textColor: "text-success-green",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">Active Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <Alert key={index} className={`${alert.bgColor} border-${alert.textColor.replace('text-', '')}`}>
              <alert.icon className={`h-4 w-4 ${alert.textColor}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{alert.title}</div>
                <AlertDescription className="text-gray-600">
                  {alert.description}
                </AlertDescription>
              </div>
              <span className="text-xs text-gray-500 ml-auto">{alert.time}</span>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
