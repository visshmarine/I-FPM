import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Share2, Settings, Loader2, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ExportActionsProps {
  shipData?: any;
  dashboardData?: any;
  fuelHistory?: any[];
}

export default function ExportActions({ shipData, dashboardData, fuelHistory = [] }: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsExporting('pdf');
    console.log("Exporting PDF report...");
    
    try {
      // Generate PDF report content
      const reportData = {
        ship: shipData || dashboardData?.ship,
        currentMetrics: dashboardData?.current,
        fuelHistory: fuelHistory,
        generatedAt: new Date().toISOString(),
        reportTitle: `I-FPM Performance Report - ${shipData?.name || 'Vessel'}`
      };

      // Create PDF content as HTML for now (could be enhanced with PDF libraries)
      const htmlContent = generatePDFContent(reportData);
      
      // Create downloadable HTML file (PDF alternative)
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `I-FPM_Report_${shipData?.name || 'Vessel'}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "PDF Report Generated",
        description: "Performance report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting('excel');
    console.log("Exporting Excel data...");
    
    try {
      // Generate CSV data (Excel alternative)
      const csvData = generateCSVData(dashboardData, fuelHistory);
      
      // Create downloadable CSV file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `I-FPM_Data_${shipData?.name || 'Vessel'}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Excel Data Exported",
        description: "Performance data has been downloaded as CSV.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export Excel data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleShareDashboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Dashboard Link Copied",
        description: "Dashboard URL copied to clipboard for sharing.",
      });
    }).catch(() => {
      toast({
        title: "Share Failed",
        description: "Could not copy link. Please copy the URL manually.",
        variant: "destructive",
      });
    });
  };

  const handleConfigureAlerts = () => {
    toast({
      title: "Alert Configuration",
      description: "Alert configuration panel will be available in the next update.",
    });
  };

  const generatePDFContent = (data: any) => {
    const ship = data.ship;
    const metrics = data.currentMetrics;
    const history = data.fuelHistory;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${data.reportTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #1e40af; color: white; padding: 20px; margin-bottom: 20px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .metric-label { font-weight: bold; color: #374151; }
        .metric-value { font-size: 1.2em; color: #1e40af; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; }
        .footer { margin-top: 30px; font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.reportTitle}</h1>
        <p>Generated: ${new Date(data.generatedAt).toLocaleString()}</p>
    </div>
    
    <div class="section">
        <h2>Vessel Information</h2>
        <div class="metric">
            <div class="metric-label">Ship Name</div>
            <div class="metric-value">${ship?.name || 'N/A'}</div>
        </div>
        <div class="metric">
            <div class="metric-label">IMO Number</div>
            <div class="metric-value">${ship?.imo || 'N/A'}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Type</div>
            <div class="metric-value">${ship?.type || 'N/A'}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Deadweight</div>
            <div class="metric-value">${ship?.deadweight || 'N/A'} MT</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Current Performance Metrics</h2>
        <div class="metric">
            <div class="metric-label">SFOC</div>
            <div class="metric-value">${metrics?.fuel?.sfoc || 'N/A'} g/kWh</div>
        </div>
        <div class="metric">
            <div class="metric-label">Fuel Consumption</div>
            <div class="metric-value">${metrics?.fuel?.fuelConsumptionRate || 'N/A'} MT/day</div>
        </div>
        <div class="metric">
            <div class="metric-label">Engine Load</div>
            <div class="metric-value">${metrics?.fuel?.engineLoadFactor || 'N/A'}%</div>
        </div>
        <div class="metric">
            <div class="metric-label">CO2 Emissions</div>
            <div class="metric-value">${metrics?.fuel?.co2Emissions || 'N/A'} tons/day</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Fuel Performance History (Last 7 Days)</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>SFOC (g/kWh)</th>
                    <th>Fuel Rate (MT/day)</th>
                    <th>Engine Load (%)</th>
                    <th>Speed (kn)</th>
                </tr>
            </thead>
            <tbody>
                ${history.map((record: any) => `
                    <tr>
                        <td>${new Date(record.timestamp).toLocaleDateString()}</td>
                        <td>${record.sfoc || 'N/A'}</td>
                        <td>${record.fuelConsumptionRate || 'N/A'}</td>
                        <td>${record.engineLoadFactor || 'N/A'}</td>
                        <td>${record.speedThroughWater || 'N/A'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    
    <div class="footer">
        <p>Report generated by I-FPM (Intelligent Fuel Performance Monitoring) System</p>
        <p>This report contains confidential vessel performance data</p>
    </div>
</body>
</html>`;
  };

  const generateCSVData = (dashboardData: any, fuelHistory: any[]) => {
    const headers = [
      'Date',
      'Ship Name',
      'SFOC (g/kWh)',
      'Fuel Consumption (MT/day)',
      'Engine Load (%)',
      'Speed Through Water (kn)',
      'Speed Over Ground (kn)',
      'Engine Power (kW)',
      'Fuel Type',
      'CO2 Emissions (tons/day)'
    ];
    
    const rows = fuelHistory.map(record => [
      new Date(record.timestamp).toISOString().split('T')[0],
      dashboardData?.ship?.name || '',
      record.sfoc || '',
      record.fuelConsumptionRate || '',
      record.engineLoadFactor || '',
      record.speedThroughWater || '',
      record.speedOverGround || '',
      record.enginePower || '',
      record.fuelType || '',
      record.co2Emissions || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\\n');
    
    return csvContent;
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
            disabled={isExporting === 'pdf'}
            className="bg-maritime-blue hover:bg-deep-ocean text-white disabled:opacity-50"
          >
            {isExporting === 'pdf' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            {isExporting === 'pdf' ? 'Generating...' : 'Export PDF Report'}
          </Button>
          <Button 
            onClick={handleExportExcel}
            disabled={isExporting === 'excel'}
            className="bg-teal hover:bg-dark-teal text-white disabled:opacity-50"
          >
            {isExporting === 'excel' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            {isExporting === 'excel' ? 'Generating...' : 'Export Excel Data'}
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
