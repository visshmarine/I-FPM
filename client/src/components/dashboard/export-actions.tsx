import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Share2, Settings } from "lucide-react";

export default function ExportActions() {
  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Exporting PDF report...");
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.log("Exporting Excel data...");
  };

  const handleShareDashboard = () => {
    // TODO: Implement dashboard sharing
    console.log("Sharing dashboard...");
  };

  const handleConfigureAlerts = () => {
    // TODO: Implement alert configuration
    console.log("Configuring alerts...");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">Actions & Export</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={handleExportPDF}
            className="bg-maritime-blue hover:bg-deep-ocean text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF Report
          </Button>
          <Button 
            onClick={handleExportExcel}
            className="bg-teal hover:bg-dark-teal text-white"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel Data
          </Button>
          <Button 
            onClick={handleShareDashboard}
            className="bg-success-green hover:bg-green-600 text-white"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Dashboard
          </Button>
          <Button 
            onClick={handleConfigureAlerts}
            className="bg-warning-orange hover:bg-orange-600 text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
