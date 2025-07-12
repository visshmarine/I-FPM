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
import AdvancedMetrics from "@/components/dashboard/advanced-metrics";
import HullCondition from "@/components/dashboard/hull-condition";
import Alerts from "@/components/dashboard/alerts";
import ExportActions from "@/components/dashboard/export-actions";
import DataInputForm from "@/components/dashboard/data-input-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Database } from "lucide-react";
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

        <KpiCards data={dashboardData?.current} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SfocChart data={fuelHistory} />
          <FuelSpeedChart data={fuelHistory} />
          <EngineLoadChart data={dashboardData?.current} />
          <HullResistanceChart data={fuelHistory} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <AdvancedMetrics data={dashboardData?.current} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <HullCondition data={dashboardData?.current?.hull} />
          <div className="space-y-6">
            <AuxiliaryChart data={dashboardData?.current?.auxiliary} />
            <Alerts data={dashboardData?.current} />
          </div>
        </div>

        <ExportActions />
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
