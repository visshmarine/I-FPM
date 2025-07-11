import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Ship, Voyage } from "@shared/schema";

interface ControlPanelProps {
  ships: Ship[];
  selectedShipId: number;
  onShipChange: (shipId: number) => void;
  selectedVoyageId: string;
  onVoyageChange: (voyageId: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  engineType: string;
  onEngineTypeChange: (type: string) => void;
  voyages: Voyage[];
}

export default function ControlPanel({
  ships,
  selectedShipId,
  onShipChange,
  selectedVoyageId,
  onVoyageChange,
  dateRange,
  onDateRangeChange,
  engineType,
  onEngineTypeChange,
  voyages,
}: ControlPanelProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">Dashboard Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ship-select">Ship ID</Label>
            <Select 
              value={selectedShipId.toString()} 
              onValueChange={(value) => onShipChange(parseInt(value))}
            >
              <SelectTrigger id="ship-select">
                <SelectValue placeholder="Select ship" />
              </SelectTrigger>
              <SelectContent>
                {ships.map((ship) => (
                  <SelectItem key={ship.id} value={ship.id.toString()}>
                    {ship.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voyage-select">Voyage</Label>
            <Select value={selectedVoyageId} onValueChange={onVoyageChange}>
              <SelectTrigger id="voyage-select">
                <SelectValue placeholder="Select voyage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Voyages</SelectItem>
                {voyages.map((voyage) => (
                  <SelectItem key={voyage.id} value={voyage.id.toString()}>
                    {voyage.voyageNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-range-select">Date Range</Label>
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger id="date-range-select">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="voyage">This Voyage</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="engine-type-select">Engine Type</Label>
            <Select value={engineType} onValueChange={onEngineTypeChange}>
              <SelectTrigger id="engine-type-select">
                <SelectValue placeholder="Select engine type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Engines</SelectItem>
                <SelectItem value="main">Main Engine</SelectItem>
                <SelectItem value="auxiliary">Auxiliary Engine</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
