import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Ship, Voyage } from "@shared/schema";
import { Loader2, Plus, Ship as ShipIcon, Fuel, Gauge } from "lucide-react";

interface DataInputFormProps {
  ships: Ship[];
  voyages: Voyage[];
  onDataAdded: () => void;
}

export default function DataInputForm({ ships, voyages, onDataAdded }: DataInputFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShipSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const shipData = {
      name: formData.get('name') as string,
      imo: formData.get('imo') as string,
      type: formData.get('type') as string,
      deadweight: formData.get('deadweight') as string,
      enginePower: formData.get('enginePower') as string,
    };

    try {
      await apiRequest('/api/ships', {
        method: 'POST',
        body: JSON.stringify(shipData),
      });
      
      toast({
        title: "Ship Added Successfully",
        description: `${shipData.name} has been added to your fleet.`,
      });
      
      (e.target as HTMLFormElement).reset();
      onDataAdded();
    } catch (error) {
      toast({
        title: "Error Adding Ship",
        description: "Failed to add ship. Please check the data and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoyageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const voyageData = {
      shipId: parseInt(formData.get('shipId') as string),
      voyageNumber: formData.get('voyageNumber') as string,
      origin: formData.get('origin') as string,
      destination: formData.get('destination') as string,
      departureDate: new Date(formData.get('departureDate') as string).toISOString(),
      status: 'active',
    };

    try {
      await apiRequest('/api/voyages', {
        method: 'POST',
        body: JSON.stringify(voyageData),
      });
      
      toast({
        title: "Voyage Created Successfully",
        description: `Voyage ${voyageData.voyageNumber} has been created.`,
      });
      
      (e.target as HTMLFormElement).reset();
      onDataAdded();
    } catch (error) {
      toast({
        title: "Error Creating Voyage",
        description: "Failed to create voyage. Please check the data and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFuelDataSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const fuelData = {
      shipId: parseInt(formData.get('shipId') as string),
      voyageId: formData.get('voyageId') ? parseInt(formData.get('voyageId') as string) : null,
      timestamp: new Date().toISOString(),
      sfoc: formData.get('sfoc') as string,
      fuelConsumptionRate: formData.get('fuelConsumptionRate') as string,
      engineLoadFactor: formData.get('engineLoadFactor') as string,
      speedThroughWater: formData.get('speedThroughWater') as string,
      speedOverGround: formData.get('speedOverGround') as string,
      enginePower: formData.get('enginePower') as string,
      fuelType: formData.get('fuelType') as string,
      co2Emissions: formData.get('co2Emissions') as string,
    };

    try {
      await apiRequest('/api/fuel-data', {
        method: 'POST',
        body: JSON.stringify(fuelData),
      });
      
      toast({
        title: "Fuel Data Added Successfully",
        description: "Performance data has been recorded.",
      });
      
      (e.target as HTMLFormElement).reset();
      onDataAdded();
    } catch (error) {
      toast({
        title: "Error Adding Fuel Data",
        description: "Failed to add fuel data. Please check the values and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Data to I-FPM System
        </CardTitle>
        <CardDescription>
          Input vessel information, voyages, and performance data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ships" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ships" className="flex items-center gap-2">
              <ShipIcon className="h-4 w-4" />
              Ships
            </TabsTrigger>
            <TabsTrigger value="voyages" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Voyages
            </TabsTrigger>
            <TabsTrigger value="fuel" className="flex items-center gap-2">
              <Fuel className="h-4 w-4" />
              Fuel Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ships" className="space-y-4">
            <form onSubmit={handleShipSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ship Name</Label>
                  <Input id="name" name="name" placeholder="MV Your Ship Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imo">IMO Number</Label>
                  <Input id="imo" name="imo" placeholder="IMO1234567" required />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Ship Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Container Ship">Container Ship</SelectItem>
                      <SelectItem value="Bulk Carrier">Bulk Carrier</SelectItem>
                      <SelectItem value="Tanker">Tanker</SelectItem>
                      <SelectItem value="General Cargo">General Cargo</SelectItem>
                      <SelectItem value="Research Vessel">Research Vessel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadweight">Deadweight (MT)</Label>
                  <Input id="deadweight" name="deadweight" type="number" placeholder="85000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enginePower">Engine Power (kW)</Label>
                  <Input id="enginePower" name="enginePower" type="number" placeholder="22000" />
                </div>
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Ship
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="voyages" className="space-y-4">
            <form onSubmit={handleVoyageSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipId">Select Ship</Label>
                  <Select name="shipId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose ship" />
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
                  <Label htmlFor="voyageNumber">Voyage Number</Label>
                  <Input id="voyageNumber" name="voyageNumber" placeholder="VOY-2025-001" required />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin Port</Label>
                  <Input id="origin" name="origin" placeholder="Singapore" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination Port</Label>
                  <Input id="destination" name="destination" placeholder="Hamburg" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input id="departureDate" name="departureDate" type="datetime-local" required />
                </div>
              </div>
              
              <Button type="submit" disabled={isLoading || ships.length === 0} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Voyage
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="fuel" className="space-y-4">
            <form onSubmit={handleFuelDataSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelShipId">Select Ship</Label>
                  <Select name="shipId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose ship" />
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
                  <Label htmlFor="voyageId">Voyage (Optional)</Label>
                  <Select name="voyageId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select voyage" />
                    </SelectTrigger>
                    <SelectContent>
                      {voyages.map((voyage) => (
                        <SelectItem key={voyage.id} value={voyage.id.toString()}>
                          {voyage.voyageNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sfoc">SFOC (g/kWh)</Label>
                  <Input id="sfoc" name="sfoc" type="number" step="0.1" placeholder="185.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelConsumptionRate">Fuel Rate (MT/day)</Label>
                  <Input id="fuelConsumptionRate" name="fuelConsumptionRate" type="number" step="0.1" placeholder="25.8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineLoadFactor">Engine Load (%)</Label>
                  <Input id="engineLoadFactor" name="engineLoadFactor" type="number" step="0.1" placeholder="78.5" />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="speedThroughWater">Speed STW (kn)</Label>
                  <Input id="speedThroughWater" name="speedThroughWater" type="number" step="0.1" placeholder="15.2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speedOverGround">Speed SOG (kn)</Label>
                  <Input id="speedOverGround" name="speedOverGround" type="number" step="0.1" placeholder="14.8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enginePower">Engine Power (kW)</Label>
                  <Input id="enginePower" name="enginePower" type="number" step="1" placeholder="15700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co2Emissions">CO2 (tons/day)</Label>
                  <Input id="co2Emissions" name="co2Emissions" type="number" step="0.1" placeholder="80.4" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select name="fuelType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HFO">Heavy Fuel Oil (HFO)</SelectItem>
                    <SelectItem value="MDO">Marine Diesel Oil (MDO)</SelectItem>
                    <SelectItem value="LNG">Liquefied Natural Gas (LNG)</SelectItem>
                    <SelectItem value="MGO">Marine Gas Oil (MGO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" disabled={isLoading || ships.length === 0} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Fuel Data
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}