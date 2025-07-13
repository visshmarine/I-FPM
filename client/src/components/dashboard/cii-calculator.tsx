import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Info, Anchor, Fuel } from "lucide-react";

interface CIICalculationResult {
  attainedCII: number;
  requiredCII: number;
  rating: 'A' | 'B' | 'C' | 'D' | 'E';
  reductionFromBaseline: number;
  complianceStatus: string;
  nextYearTarget: number;
}

export default function CIICalculator() {
  const [inputs, setInputs] = useState({
    shipType: 'Bulk carrier',
    deadweight: 50000,
    fuelConsumption: 6570, // MT/year
    distanceTravelled: 120000, // nautical miles/year
    calculationYear: 2024
  });

  const [result, setResult] = useState<CIICalculationResult | null>(null);

  // IMO CII reference line parameters by ship type
  const ciiParameters = {
    'Bulk carrier': { a: 4745, c: 0.622 },
    'Gas tanker': { a: 14016, c: 2.071 },
    'Tanker': { a: 5247, c: 0.610 },
    'Container ship': { a: 1984, c: 0.489 },
    'General cargo ship': { a: 31948, c: 0.792 },
    'Refrigerated cargo carrier': { a: 4745, c: 0.622 },
    'Combination carrier': { a: 4745, c: 0.622 },
    'LNG carrier': { a: 9827, c: 0.000 },
    'Ro-ro cargo ship': { a: 5739, c: 0.000 },
    'Ro-ro cargo ship (vehicle carrier)': { a: 31948, c: 0.792 },
    'Ro-ro passenger ship': { a: 7540, c: 0.587 },
    'Cruise passenger ship': { a: 930, c: 0.383 }
  };

  // CII rating boundaries (percentage reduction from reference line)
  const getRatingBoundaries = (year: number) => {
    // Annual reduction factor: 2% per year from 2019 baseline
    const reductionFactor = 1 - (0.02 * (year - 2019));
    
    return {
      A: { min: 0, max: 0.85 * reductionFactor }, // Superior (≤15% better than required)
      B: { min: 0.85 * reductionFactor, max: 0.95 * reductionFactor }, // Good (5-15% better)
      C: { min: 0.95 * reductionFactor, max: 1.05 * reductionFactor }, // Satisfactory (±5%)
      D: { min: 1.05 * reductionFactor, max: 1.25 * reductionFactor }, // Poor (5-25% worse)
      E: { min: 1.25 * reductionFactor, max: Infinity } // Inferior (>25% worse)
    };
  };

  const calculateCII = () => {
    const { shipType, deadweight, fuelConsumption, distanceTravelled, calculationYear } = inputs;
    
    // Step 1: Calculate Attained CII
    // Formula: Attained CII = (FCj × CFj) / (Capacity × Distance travelled)
    // Where FCj = fuel consumption, CFj = fuel conversion factor, Capacity = DWT
    
    const fuelConversionFactor = 3.114; // tCO2/tFuel for HFO (most common)
    const co2Emissions = fuelConsumption * fuelConversionFactor;
    const attainedCII = co2Emissions / (deadweight * distanceTravelled);

    // Step 2: Calculate Required CII (Reference Line)
    // Formula: CII ref = a × DWT^(-c)
    const params = ciiParameters[shipType as keyof typeof ciiParameters];
    const referenceCII = params.a * Math.pow(deadweight, -params.c);
    
    // Step 3: Apply annual reduction factor
    const annualReductionFactor = 1 - (0.02 * (calculationYear - 2019));
    const requiredCII = referenceCII * annualReductionFactor;

    // Step 4: Determine rating
    const boundaries = getRatingBoundaries(calculationYear);
    const ratio = attainedCII / requiredCII;
    
    let rating: 'A' | 'B' | 'C' | 'D' | 'E' = 'E';
    if (ratio <= boundaries.A.max) rating = 'A';
    else if (ratio <= boundaries.B.max) rating = 'B';
    else if (ratio <= boundaries.C.max) rating = 'C';
    else if (ratio <= boundaries.D.max) rating = 'D';

    // Step 5: Calculate performance metrics
    const reductionFromBaseline = ((referenceCII - attainedCII) / referenceCII) * 100;
    const nextYearTarget = referenceCII * (1 - (0.02 * (calculationYear + 1 - 2019)));

    const complianceStatus = rating === 'A' || rating === 'B' || rating === 'C' 
      ? 'Compliant' 
      : 'Non-Compliant';

    setResult({
      attainedCII,
      requiredCII,
      rating,
      reductionFromBaseline,
      complianceStatus,
      nextYearTarget
    });
  };

  useEffect(() => {
    calculateCII();
  }, [inputs]);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A': return 'bg-green-100 text-green-800 border-green-300';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'E': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRatingDescription = (rating: string) => {
    switch (rating) {
      case 'A': return 'Superior - Major improvement needed';
      case 'B': return 'Good - Minor improvement needed';
      case 'C': return 'Satisfactory - On target';
      case 'D': return 'Poor - Significant improvement needed';
      case 'E': return 'Inferior - Major improvement needed';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            CII (Carbon Intensity Indicator) Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Ship Type</Label>
              <select 
                className="w-full border rounded px-3 py-2 text-sm"
                value={inputs.shipType}
                onChange={(e) => setInputs({...inputs, shipType: e.target.value})}
              >
                {Object.keys(ciiParameters).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label>Deadweight (DWT)</Label>
              <Input
                type="number"
                value={inputs.deadweight}
                onChange={(e) => setInputs({...inputs, deadweight: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <Label>Annual Fuel Consumption (MT)</Label>
              <Input
                type="number"
                value={inputs.fuelConsumption}
                onChange={(e) => setInputs({...inputs, fuelConsumption: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <Label>Distance Travelled (nautical miles)</Label>
              <Input
                type="number"
                value={inputs.distanceTravelled}
                onChange={(e) => setInputs({...inputs, distanceTravelled: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <Label>Calculation Year</Label>
              <Input
                type="number"
                value={inputs.calculationYear}
                onChange={(e) => setInputs({...inputs, calculationYear: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <Button onClick={calculateCII} className="w-full md:w-auto">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate CII Rating
          </Button>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>CII Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.attainedCII.toFixed(3)}
                </div>
                <div className="text-sm text-gray-600">Attained CII</div>
                <div className="text-xs text-gray-500">gCO₂/tonne-mile</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {result.requiredCII.toFixed(3)}
                </div>
                <div className="text-sm text-gray-600">Required CII</div>
                <div className="text-xs text-gray-500">gCO₂/tonne-mile</div>
              </div>
              
              <div className="text-center">
                <Badge className={`text-2xl font-bold px-4 py-2 ${getRatingColor(result.rating)}`}>
                  {result.rating}
                </Badge>
                <div className="text-sm text-gray-600 mt-2">{getRatingDescription(result.rating)}</div>
                <div className="text-xs text-gray-500">{result.complianceStatus}</div>
              </div>
            </div>

            <Separator />

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Performance Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Reduction from Baseline:</span>
                    <span className={`font-bold ${result.reductionFromBaseline > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.reductionFromBaseline.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Year Target:</span>
                    <span className="font-bold">{result.nextYearTarget.toFixed(3)} gCO₂/tonne-mile</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gap to Target:</span>
                    <span className={`font-bold ${result.attainedCII <= result.requiredCII ? 'text-green-600' : 'text-red-600'}`}>
                      {((result.attainedCII - result.requiredCII) / result.requiredCII * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Rating Boundaries ({inputs.calculationYear})</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(getRatingBoundaries(inputs.calculationYear)).map(([rating, boundary]) => (
                    <div key={rating} className="flex justify-between">
                      <span className={`px-2 py-1 rounded ${getRatingColor(rating)}`}>
                        {rating}
                      </span>
                      <span className="font-mono">
                        {boundary.max === Infinity ? `&gt; ${(boundary.min * result.requiredCII).toFixed(3)}` : 
                         `${(boundary.min * result.requiredCII).toFixed(3)} - ${(boundary.max * result.requiredCII).toFixed(3)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formula Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            CII Calculation Formula & Logic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Step 1: Attained CII Calculation</h4>
              <div className="bg-blue-50 p-4 rounded border">
                <div className="font-mono text-sm mb-2">
                  Attained CII = (FCⱼ × CFⱼ) / (Capacity × Distance)
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• FCⱼ = Fuel consumption in reporting period (mass of fuel)</p>
                  <p>• CFⱼ = Fuel mass to CO₂ mass conversion factor (3.114 for HFO)</p>
                  <p>• Capacity = Ship's deadweight tonnage (DWT)</p>
                  <p>• Distance = Total distance travelled (nautical miles)</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-orange-600 mb-2">Step 2: Required CII (Reference Line)</h4>
              <div className="bg-orange-50 p-4 rounded border">
                <div className="font-mono text-sm mb-2">
                  CII_ref = a × DWT^(-c)
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• a, c = Ship type specific parameters from IMO guidelines</p>
                  <p>• DWT = Deadweight tonnage</p>
                  <p>• Values vary by ship type (e.g., Bulk carrier: a=4745, c=0.622)</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-green-600 mb-2">Step 3: Annual Reduction Factor</h4>
              <div className="bg-green-50 p-4 rounded border">
                <div className="font-mono text-sm mb-2">
                  Required CII = CII_ref × (1 - 0.02 × (Year - 2019))
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• 2% annual reduction from 2019 baseline</p>
                  <p>• Progressive tightening of requirements each year</p>
                  <p>• Supports IMO's decarbonization goals</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-purple-600 mb-2">Step 4: Rating Assignment</h4>
              <div className="bg-purple-50 p-4 rounded border">
                <div className="font-mono text-sm mb-2">
                  Rating = f(Attained CII / Required CII)
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• A: ≤85% of required (Superior performance)</p>
                  <p>• B: 85-95% of required (Good performance)</p>
                  <p>• C: 95-105% of required (Satisfactory - compliant)</p>
                  <p>• D: 105-125% of required (Poor - non-compliant)</p>
                  <p>• E: &gt;125% of required (Inferior - non-compliant)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Anchor className="h-4 w-4" />
              IMO Regulatory Framework
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• <strong>MARPOL Annex VI:</strong> Mandatory CII calculation and reporting</p>
              <p>• <strong>SEEMP:</strong> Ship Energy Efficiency Management Plan updates required</p>
              <p>• <strong>DCS:</strong> Data Collection System for fuel consumption</p>
              <p>• <strong>Enforcement:</strong> Port State Control and flag state oversight</p>
              <p>• <strong>Timeline:</strong> Mandatory from January 1, 2023</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}