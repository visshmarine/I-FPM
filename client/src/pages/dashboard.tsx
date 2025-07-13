import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";
import Header from "@/components/dashboard/header";
import ControlPanel from "@/components/dashboard/control-panel";
import KpiCards from "@/components/dashboard/kpi-cards";
import SfocChart from "@/components/dashboard/charts/sfoc-chart";
import FuelSpeedChart from "@/components/dashboard/charts/fuel-speed-chart";
import EngineLoadChart from "@/components/dashboard/charts/engine-load-chart";
import HullResistanceChart from "@/components/dashboard/charts/hull-resistance-chart";
import AuxiliaryChart from "@/components/dashboard/charts/auxiliary-chart";
import EEOIChart from "@/components/dashboard/charts/eeoi-chart";
import TrimOptimizationChart from "@/components/dashboard/charts/trim-optimization-chart";
import WeatherFuelCorrelation from "@/components/dashboard/charts/weather-fuel-correlation";
import AuxiliaryConsumptionBreakdown from "@/components/dashboard/charts/auxiliary-consumption-breakdown";
import FuelCostNauticalMile from "@/components/dashboard/charts/fuel-cost-nautical-mile";
import AdvancedMetrics from "@/components/dashboard/advanced-metrics";
import HullCondition from "@/components/dashboard/hull-condition";
import Alerts from "@/components/dashboard/alerts";
import ExportActions from "@/components/dashboard/export-actions";
import DataInputForm from "@/components/dashboard/data-input-form";
import HullCalculator from "@/components/dashboard/hull-calculator";
import DataUploadTool from "@/components/dashboard/data-upload-tool";
import BaselineModelCard from "@/components/dashboard/baseline-model-card";
import RealTimeMonitoring from "@/components/dashboard/real-time-monitoring";
import AdvancedHullAnalytics from "@/components/dashboard/advanced-hull-analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Plus, Database, Calculator, Upload } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import type { Ship } from "@shared/schema";

export default function Dashboard() {
  const params = useParams();
  const [selectedShipId, setSelectedShipId] = useState<number>(parseInt(params.shipId || "1"));
  const [selectedVoyageId, setSelectedVoyageId] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7days");
  const [engineType, setEngineType] = useState<string>("all");
  const [showDataInput, setShowDataInput] = useState<boolean>(false);

  // Fetch ships for the dropdown
  const { data: ships = [], isLoading: shipsLoading } = useQuery({
    queryKey: ["/api/ships"],
  });

  // Fetch dashboard data for selected ship
  const { data: dashboardData, isLoading: dashboardLoading, error } = useQuery({
    queryKey: ["/api/dashboard", selectedShipId],
    enabled: !!selectedShipId,
  });

  // Fetch fuel data for charts
  const { data: fuelHistory = [] } = useQuery({
    queryKey: ["/api/fuel-data"],
    queryFn: async () => {
      const response = await fetch(`/api/fuel-data?shipId=${selectedShipId}&limit=7`);
      return response.json();
    },
    enabled: !!selectedShipId,
  });

  if (shipsLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-16 bg-maritime-blue"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-16 bg-maritime-blue"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load dashboard data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ControlPanel
          ships={ships}
          selectedShipId={selectedShipId}
          onShipChange={setSelectedShipId}
          selectedVoyageId={selectedVoyageId}
          onVoyageChange={setSelectedVoyageId}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          engineType={engineType}
          onEngineTypeChange={setEngineType}
          voyages={dashboardData?.voyages || []}
        />

        {/* Data Input Toggle Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowDataInput(!showDataInput)}
            className="bg-success-green hover:bg-green-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showDataInput ? 'Hide Tools' : 'Data Input & Tools'}
          </Button>
        </div>

        {/* Data Input and Tools */}
        {showDataInput && (
          <div className="mb-6">
            <Tabs defaultValue="input" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="input" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Data Input
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Bulk Upload
                </TabsTrigger>
                <TabsTrigger value="calculator" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Hull Calculator
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="input">
                <DataInputForm
                  ships={ships}
                  voyages={dashboardData?.voyages || []}
                  onDataAdded={() => {
                    setShowDataInput(false);
                    queryClient.invalidateQueries({ queryKey: ["/api/ships"] });
                    queryClient.invalidateQueries({ queryKey: ["/api/dashboard", selectedShipId] });
                    queryClient.invalidateQueries({ queryKey: ["/api/fuel-data"] });
                  }}
                />
              </TabsContent>
              
              <TabsContent value="upload">
                <DataUploadTool />
              </TabsContent>
              
              <TabsContent value="calculator">
                <HullCalculator />
              </TabsContent>
            </Tabs>
          </div>
        )}

        <KpiCards data={dashboardData?.current} />

        {/* Primary Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SfocChart data={fuelHistory} />
          <FuelSpeedChart data={fuelHistory} />
          <EngineLoadChart data={dashboardData?.current} />
          <HullResistanceChart data={fuelHistory} />
        </div>

        {/* Environmental and Efficiency Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <EEOIChart data={dashboardData} />
          <TrimOptimizationChart data={dashboardData} />
          <WeatherFuelCorrelation data={dashboardData} />
          <FuelCostNauticalMile data={dashboardData} />
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <AdvancedMetrics data={dashboardData?.current} />
          <AuxiliaryConsumptionBreakdown data={dashboardData} />
          <BaselineModelCard data={dashboardData} />
        </div>

        {/* Advanced Hull Analytics and Real-time Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <AdvancedHullAnalytics data={dashboardData} />
          <RealTimeMonitoring data={dashboardData} />
        </div>

        {/* Hull Condition and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <HullCondition data={dashboardData?.current?.hull} />
          <div className="space-y-6">
            <AuxiliaryChart data={dashboardData?.current?.auxiliary} />
            <Alerts data={dashboardData?.current} />
          </div>
        </div>

        <ExportActions 
          shipData={dashboardData?.ship}
          dashboardData={dashboardData}
          fuelHistory={fuelHistory}
        />
      </main>

      <footer className="bg-dark-gray text-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span>© 2024 I-FPM System. IMO Compliant Fuel Monitoring.</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span>Last Update: {new Date().toLocaleString("en-US", { timeZone: "UTC" })} UTC</span>
              <span className="text-success-green">● System Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
