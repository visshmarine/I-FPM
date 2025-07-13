import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle, AlertCircle, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadResult {
  success: boolean;
  message: string;
  recordsProcessed: number;
  errors: string[];
  data?: Record<string, number>;
}

export default function DataUploadTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<string>('fuel');
  const [customMapping, setCustomMapping] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [sampleMappings, setSampleMappings] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Sample mapping configurations
  const defaultMappings = {
    ships: {
      'Vessel Name': 'name',
      'IMO Number': 'imo',
      'Ship Type': 'shipType',
      'Deadweight (MT)': 'deadweight',
      'Engine Power (kW)': 'enginePower',
      'Length (m)': 'length',
      'Beam (m)': 'beam',
      'Draught (m)': 'draught'
    },
    voyages: {
      'Ship ID': 'shipId',
      'Voyage Number': 'voyageNumber',
      'Departure Port': 'departurePort',
      'Arrival Port': 'arrivalPort',
      'Start Date': 'startDate',
      'End Date': 'endDate'
    },
    fuel: {
      'Ship ID': 'shipId',
      'Voyage ID': 'voyageId',
      'Date': 'timestamp',
      'SFOC (g/kWh)': 'sfoc',
      'Fuel Rate (MT/day)': 'fuelConsumptionRate',
      'Engine Load (%)': 'engineLoadFactor',
      'Speed STW (knots)': 'speedThroughWater',
      'Speed SOG (knots)': 'speedOverGround',
      'Engine Power (kW)': 'enginePower',
      'Fuel Type': 'fuelType',
      'CO2 Emissions (MT/day)': 'co2Emissions'
    },
    environmental: {
      'Ship ID': 'shipId',
      'Voyage ID': 'voyageId',
      'Date': 'timestamp',
      'Wind Speed (knots)': 'windSpeed',
      'Wave Height (m)': 'waveHeight',
      'Wind Direction (deg)': 'windDirection',
      'Sea State': 'seaState',
      'Weather Impact (%)': 'weatherImpact'
    },
    hull: {
      'Ship ID': 'shipId',
      'Date': 'timestamp',
      'Hull Roughness Index': 'roughnessIndex',
      'Propeller Slip (%)': 'propellerSlip',
      'Hull Efficiency (%)': 'hullEfficiency',
      'Days Since Cleaning': 'daysSinceLastCleaning',
      'Last Cleaning Date': 'lastCleaningDate'
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'application/csv'
      ];
      
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an Excel (.xlsx, .xls) or CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('dataFile', selectedFile);
      
      // Prepare mapping configuration
      let mappingConfig;
      if (customMapping.trim()) {
        try {
          mappingConfig = JSON.parse(customMapping);
        } catch (error) {
          throw new Error('Invalid JSON in custom mapping configuration');
        }
      } else {
        mappingConfig = {
          dataType,
          columnMappings: defaultMappings[dataType as keyof typeof defaultMappings] || defaultMappings.fuel,
          skipRows: 1
        };
      }
      
      formData.append('mappingConfig', JSON.stringify(mappingConfig));

      const response = await fetch('/api/upload-data', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setUploadResult(result);
        toast({
          title: result.success ? "Upload Successful" : "Upload Completed with Errors",
          description: result.message,
          variant: result.success ? "default" : "destructive",
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleTemplate = (templateType: string) => {
    const mapping = defaultMappings[templateType as keyof typeof defaultMappings];
    if (!mapping) return;

    const headers = Object.keys(mapping);
    const csvContent = headers.join(',') + '\n' + 
                      headers.map(() => 'sample_value').join(',');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateType}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getCurrentMapping = () => {
    if (customMapping.trim()) {
      try {
        return JSON.parse(customMapping);
      } catch {
        return null;
      }
    }
    return defaultMappings[dataType as keyof typeof defaultMappings];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Excel/CSV Data Upload Tool
        </CardTitle>
        <CardDescription>
          Upload historical raw data from Excel spreadsheets or CSV files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="mapping">Column Mapping</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            {/* File Selection */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            {/* Data Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="data-type">Data Type</Label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ships">Ships</SelectItem>
                  <SelectItem value="voyages">Voyages</SelectItem>
                  <SelectItem value="fuel">Fuel Performance</SelectItem>
                  <SelectItem value="environmental">Environmental Data</SelectItem>
                  <SelectItem value="hull">Hull Condition</SelectItem>
                  <SelectItem value="trim">Trim Data</SelectItem>
                  <SelectItem value="compliance">Compliance Data</SelectItem>
                  <SelectItem value="auxiliary">Auxiliary Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload Button */}
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload and Process Data
                </>
              )}
            </Button>

            {/* Upload Results */}
            {uploadResult && (
              <div className={`border rounded-lg p-4 ${uploadResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {uploadResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {uploadResult.success ? 'Upload Successful' : 'Upload Completed with Errors'}
                  </span>
                </div>
                
                <p className="text-sm mb-3">{uploadResult.message}</p>
                
                {uploadResult.data && (
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    {Object.entries(uploadResult.data).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-600">{key}:</span>
                        <span className="ml-2 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {uploadResult.errors.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-red-600">Errors:</p>
                    <div className="max-h-32 overflow-y-auto text-xs space-y-1">
                      {uploadResult.errors.map((error, index) => (
                        <div key={index} className="text-red-600">{error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-mapping">Custom Column Mapping (JSON)</Label>
              <Textarea
                id="custom-mapping"
                placeholder={`Leave empty to use default mapping for ${dataType} data, or enter custom JSON mapping...`}
                value={customMapping}
                onChange={(e) => setCustomMapping(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Current Mapping Preview</Label>
              <div className="bg-gray-50 border rounded p-3 text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(getCurrentMapping(), null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Download sample templates with the correct column headers for each data type.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(defaultMappings).map((templateType) => (
                  <Button
                    key={templateType}
                    variant="outline"
                    onClick={() => downloadSampleTemplate(templateType)}
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {templateType.charAt(0).toUpperCase() + templateType.slice(1)} Template
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Required Columns by Data Type</h4>
              {Object.entries(defaultMappings).map(([type, mapping]) => (
                <div key={type} className="border rounded p-3">
                  <div className="font-medium mb-2 capitalize">{type}</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(mapping).map((col) => (
                      <Badge key={col} variant="outline" className="text-xs">
                        {col}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}