import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface HullCalculationResults {
  hullRoughnessIndex: number;
  hullEfficiency: number;
  performanceDegradation: number;
  recommendedAction: string;
  calculationMethod: string;
  weatherCorrected: boolean;
  economicImpact: {
    additionalFuelCost: number;
    annualExtraCost: number;
    paybackPeriod: number;
  };
}

export default function HullCalculator() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<HullCalculationResults | null>(null);
  const { toast } = useToast();

  const handleCalculate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCalculating(true);

    const formData = new FormData(e.currentTarget);
    const calculationData = {
      currentPower: parseFloat(formData.get('currentPower') as string),
      baselinePower: parseFloat(formData.get('baselinePower') as string),
      currentSpeed: parseFloat(formData.get('currentSpeed') as string),
      baselineSpeed: parseFloat(formData.get('baselineSpeed') as string),
      currentSfoc: parseFloat(formData.get('currentSfoc') as string),
      baselineSfoc: parseFloat(formData.get('baselineSfoc') as string),
      seaState: formData.get('seaState') ? parseInt(formData.get('seaState') as string) : undefined,
      windSpeed: formData.get('windSpeed') ? parseFloat(formData.get('windSpeed') as string) : undefined,
      waveHeight: formData.get('waveHeight') ? parseFloat(formData.get('waveHeight') as string) : undefined,
    };

    try {
      const response = await apiRequest('/api/calculate-hull-performance', {
        method: 'POST',
        body: JSON.stringify(calculationData),
      });
      
      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Hull Performance Calculated",
        description: "Analysis complete. Check results below.",
      });
    } catch (error) {
      toast({
        title: "Calculation Failed",
        description: "Please check your input values and try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getStatusColor = (hri: number) => {
    if (hri <= 110) return "text-green-600";
    if (hri <= 120) return "text-yellow-600";
    if (hri <= 140) return "text-orange-600";
    return "text-red-600";
  };

  const getStatusIcon = (hri: number) => {
    if (hri <= 110) return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (hri <= 120) return <TrendingDown className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Hull Performance Calculator
          </CardTitle>
          <CardDescription>
            Calculate hull roughness index and efficiency based on current vs. baseline performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Current Performance */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Current Performance</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPower">Engine Power (kW)</Label>
                    <Input 
                      id="currentPower" 
                      name="currentPower" 
                      type="number" 
                      step="0.1" 
                      placeholder="9200" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentSpeed">Speed (knots)</Label>
                    <Input 
                      id="currentSpeed" 
                      name="currentSpeed" 
                      type="number" 
                      step="0.1" 
                      placeholder="14.2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentSfoc">SFOC (g/kWh)</Label>
                    <Input 
                      id="currentSfoc" 
                      name="currentSfoc" 
                      type="number" 
                      step="0.1" 
                      placeholder="197" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Baseline Performance */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Baseline (Clean Hull)</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="baselinePower">Engine Power (kW)</Label>
                    <Input 
                      id="baselinePower" 
                      name="baselinePower" 
                      type="number" 
                      step="0.1" 
                      placeholder="8500" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baselineSpeed">Speed (knots)</Label>
                    <Input 
                      id="baselineSpeed" 
                      name="baselineSpeed" 
                      type="number" 
                      step="0.1" 
                      placeholder="14.2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baselineSfoc">SFOC (g/kWh)</Label>
                    <Input 
                      id="baselineSfoc" 
                      name="baselineSfoc" 
                      type="number" 
                      step="0.1" 
                      placeholder="182" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Conditions (Optional) */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Environmental Conditions (Optional)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="windSpeed">Wind Speed (knots)</Label>
                  <Input id="windSpeed" name="windSpeed" type="number" step="0.1" placeholder="15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waveHeight">Wave Height (m)</Label>
                  <Input id="waveHeight" name="waveHeight" type="number" step="0.1" placeholder="2.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seaState">Sea State (0-9)</Label>
                  <Input id="seaState" name="seaState" type="number" min="0" max="9" placeholder="3" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isCalculating} className="w-full">
              {isCalculating ? "Calculating..." : "Calculate Hull Performance"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(results.hullRoughnessIndex)}
              Hull Performance Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className={`text-2xl font-bold ${getStatusColor(results.hullRoughnessIndex)}`}>
                  {results.hullRoughnessIndex}
                </div>
                <div className="text-sm text-gray-600">Hull Roughness Index</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {results.hullEfficiency > 0 ? '+' : ''}{results.hullEfficiency}%
                </div>
                <div className="text-sm text-gray-600">Performance Change</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${results.economicImpact.additionalFuelCost.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Daily Extra Fuel Cost</div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Recommendation</h4>
              <p className="text-blue-800">{results.recommendedAction}</p>
            </div>

            {/* Economic Impact */}
            <div className="space-y-3">
              <h4 className="font-medium">Economic Impact</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Annual Extra Cost:</span>
                  <span className="ml-2 font-medium">${results.economicImpact.annualExtraCost.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Hull Cleaning ROI:</span>
                  <span className="ml-2 font-medium">{results.economicImpact.paybackPeriod} days</span>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>Calculation Method: {results.calculationMethod}</p>
              {results.weatherCorrected && <p>Weather corrections applied based on ISO 15016 principles</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}