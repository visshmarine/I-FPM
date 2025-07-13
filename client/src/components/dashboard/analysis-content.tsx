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
import HullCondition from "@/components/dashboard/hull-condition";
import AdvancedHullAnalytics from "@/components/dashboard/advanced-hull-analytics";
import BaselineModelCard from "@/components/dashboard/baseline-model-card";
import RealTimeMonitoring from "@/components/dashboard/real-time-monitoring";
import AdvancedMetrics from "@/components/dashboard/advanced-metrics";
import HullCalculator from "@/components/dashboard/hull-calculator";
import CIICalculator from "@/components/dashboard/cii-calculator";
import DatabaseAdmin from "@/components/dashboard/database-admin";

interface AnalysisContentProps {
  activeSection: string;
  data?: any;
  fuelHistory?: any[];
}

export default function AnalysisContent({ activeSection, data, fuelHistory }: AnalysisContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      // FUEL ANALYSIS SECTIONS
      case 'fuel':
      case 'fuel-fuel-performance':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SfocChart data={fuelHistory} />
            <FuelSpeedChart data={fuelHistory} />
            <EEOIChart data={data} />
            <FuelCostNauticalMile data={data} />
          </div>
        );
      
      case 'fuel-fuel-consumption':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FuelCostNauticalMile data={data} />
            <AuxiliaryConsumptionBreakdown data={data} />
            <AdvancedMetrics data={data?.current} />
          </div>
        );
      
      case 'fuel-fuel-cost':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FuelCostNauticalMile data={data} />
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Cost Analysis Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Daily Fuel Cost:</span>
                  <span className="ml-2 font-medium text-lg">${(18.5 * 600).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Cost per Mile:</span>
                  <span className="ml-2 font-medium text-lg">$32.50</span>
                </div>
                <div>
                  <span className="text-gray-600">Monthly Projection:</span>
                  <span className="ml-2 font-medium text-lg">${(18.5 * 600 * 30).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Efficiency Rating:</span>
                  <span className="ml-2 font-medium text-lg text-green-600">Good</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'fuel-fuel-eeoi':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EEOIChart data={data} />
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">EEOI Compliance Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Current EEOI:</span>
                  <span className="font-bold text-xl">12.3 g CO2/tonne-mile</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Target EEOI:</span>
                  <span className="font-bold text-xl text-green-600">11.8 g CO2/tonne-mile</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Compliance Status:</span>
                  <span className="font-bold text-xl text-yellow-600">Above Target</span>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                  <strong>Recommendation:</strong> Implement fuel optimization measures to achieve 4.2% reduction needed for compliance.
                </div>
              </div>
            </div>
          </div>
        );

      // HULL PERFORMANCE SECTIONS
      case 'hull':
      case 'hull-hull-condition':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HullCondition data={data?.current?.hull} />
            <HullResistanceChart data={fuelHistory} />
            <BaselineModelCard data={data} />
          </div>
        );
      
      case 'hull-hull-resistance':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HullResistanceChart data={fuelHistory} />
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Hull Resistance Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Current Resistance:</span>
                  <span className="font-bold">108.3% of baseline</span>
                </div>
                <div className="flex justify-between">
                  <span>Fouling Factor:</span>
                  <span className="font-bold text-red-600">1.083</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Clean Hull:</span>
                  <span className="font-bold text-green-600">100% baseline</span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
                  <strong>Alert:</strong> Hull resistance 8.3% above baseline. Consider hull cleaning to restore efficiency.
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'hull-hull-calculator':
        return (
          <div className="max-w-4xl">
            <HullCalculator />
          </div>
        );
      
      case 'hull-hull-analytics':
        return (
          <div className="grid grid-cols-1 gap-6">
            <AdvancedHullAnalytics data={data} />
          </div>
        );

      // ENGINE SYSTEMS SECTIONS
      case 'engine':
      case 'engine-engine-performance':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EngineLoadChart data={data?.current} />
            <AdvancedMetrics data={data?.current} />
            <SfocChart data={fuelHistory} />
          </div>
        );
      
      case 'engine-engine-load':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EngineLoadChart data={data?.current} />
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Engine Load Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Current Load:</span>
                  <span className="font-bold">78.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Optimal Range:</span>
                  <span className="font-bold text-green-600">75-85%</span>
                </div>
                <div className="flex justify-between">
                  <span>Power Output:</span>
                  <span className="font-bold">9,200 kW</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                  <strong>Status:</strong> Engine operating within optimal load range for fuel efficiency.
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'engine-auxiliary-systems':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AuxiliaryChart data={data?.current?.auxiliary} />
            <AuxiliaryConsumptionBreakdown data={data} />
          </div>
        );
      
      case 'engine-trim-optimization':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrimOptimizationChart data={data} />
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Trim Optimization Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Current Trim:</span>
                  <span className="font-bold">2.1m</span>
                </div>
                <div className="flex justify-between">
                  <span>Recommended Trim:</span>
                  <span className="font-bold text-green-600">1.8m</span>
                </div>
                <div className="flex justify-between">
                  <span>Potential Savings:</span>
                  <span className="font-bold text-green-600">3.2%</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                  <strong>Recommendation:</strong> Adjust trim to 1.8m for optimal fuel efficiency.
                </div>
              </div>
            </div>
          </div>
        );

      // ENVIRONMENTAL SECTIONS
      case 'environment':
      case 'environment-weather-correlation':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherFuelCorrelation data={data} />
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Weather Impact Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Current Conditions:</span>
                  <span className="font-bold">Moderate</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel Impact:</span>
                  <span className="font-bold text-orange-600">+5.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Wind Speed:</span>
                  <span className="font-bold">15.3 knots</span>
                </div>
                <div className="flex justify-between">
                  <span>Wave Height:</span>
                  <span className="font-bold">2.1m</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'environment-environmental-data':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Environmental Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Wind Speed:</span>
                  <span className="ml-2 font-bold">15.3 knots</span>
                </div>
                <div>
                  <span className="text-gray-600">Wind Direction:</span>
                  <span className="ml-2 font-bold">245°</span>
                </div>
                <div>
                  <span className="text-gray-600">Wave Height:</span>
                  <span className="ml-2 font-bold">2.1m</span>
                </div>
                <div>
                  <span className="text-gray-600">Sea State:</span>
                  <span className="ml-2 font-bold">4</span>
                </div>
                <div>
                  <span className="text-gray-600">Temperature:</span>
                  <span className="ml-2 font-bold">22°C</span>
                </div>
                <div>
                  <span className="text-gray-600">Visibility:</span>
                  <span className="ml-2 font-bold">8 nm</span>
                </div>
              </div>
            </div>
            <WeatherFuelCorrelation data={data} />
          </div>
        );
      
      case 'environment-compliance':
        return (
          <div className="grid grid-cols-1 gap-6">
            <CIICalculator />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EEOIChart data={data} />
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <span>CII Rating:</span>
                      <span className="font-bold text-yellow-600">C</span>
                    </div>
                    <div className="text-sm text-gray-600">Carbon Intensity Indicator</div>
                  </div>
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <span>EEOI:</span>
                      <span className="font-bold text-yellow-600">Above Target</span>
                    </div>
                    <div className="text-sm text-gray-600">Energy Efficiency Operational Index</div>
                  </div>
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <span>MRV Compliance:</span>
                      <span className="font-bold text-green-600">Compliant</span>
                    </div>
                    <div className="text-sm text-gray-600">Monitoring, Reporting, Verification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'environment-real-time-monitoring':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeMonitoring data={data} />
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">IoT Sensor Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Hull Sensors:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Weather Station:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Engine Sensors:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>GPS/AIS:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                  <strong>Data Quality:</strong> 98.7% - All systems operating normally
                </div>
              </div>
            </div>
          </div>
        );

      // DATABASE ADMINISTRATION
      case 'database':
      case 'database-admin':
        return (
          <div className="grid grid-cols-1 gap-6">
            <DatabaseAdmin />
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SfocChart data={fuelHistory} />
            <FuelSpeedChart data={fuelHistory} />
            <EngineLoadChart data={data?.current} />
            <HullResistanceChart data={fuelHistory} />
          </div>
        );
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {renderContent()}
    </div>
  );
}