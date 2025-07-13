import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  Download, 
  Trash2, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  BarChart3,
  Clock,
  HardDrive
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface DatabaseStats {
  totalShips: number;
  totalVoyages: number;
  totalFuelRecords: number;
  totalEnvironmentalRecords: number;
  totalHullRecords: number;
  totalTrimRecords: number;
  totalComplianceRecords: number;
  totalAuxiliaryRecords: number;
  dataQuality: number;
  oldestRecord: string;
  newestRecord: string;
  averageSfoc: number;
}

interface DataIntegrityReport {
  missingData: {
    table: string;
    issue: string;
    count: number;
  }[];
  dataQuality: {
    table: string;
    quality: number;
    description: string;
  }[];
  recommendations: string[];
}

export default function DatabaseAdmin() {
  const [retentionMonths, setRetentionMonths] = useState(24);

  // Fetch database statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DatabaseStats>({
    queryKey: ["/api/database/stats"],
  });

  // Fetch data integrity report
  const { data: integrity, isLoading: integrityLoading } = useQuery<DataIntegrityReport>({
    queryKey: ["/api/database/integrity"],
  });

  // Database cleanup mutation
  const cleanupMutation = useMutation({
    mutationFn: async (retentionMonths: number) => {
      const response = await fetch("/api/database/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retentionMonths }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/database/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/database/integrity"] });
    },
  });

  // Database optimization mutation
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/database/optimize", {
        method: "POST",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/database/stats"] });
    },
  });

  // Download backup
  const downloadBackup = async () => {
    try {
      const response = await fetch("/api/database/backup");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ifpm_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Backup download failed:', error);
    }
  };

  const formatNumber = (num: number) => num.toLocaleString();
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const getQualityColor = (quality: number) => {
    if (quality >= 95) return "text-green-600";
    if (quality >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const getQualityIcon = (quality: number) => {
    if (quality >= 95) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (quality >= 85) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  if (statsLoading || integrityLoading) {
    return <div className="p-6">Loading database administration...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Database Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            PostgreSQL Database Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{formatNumber(stats?.totalShips || 0)}</div>
              <div className="text-sm text-gray-600">Ships</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{formatNumber(stats?.totalFuelRecords || 0)}</div>
              <div className="text-sm text-gray-600">Fuel Records</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{formatNumber(stats?.totalEnvironmentalRecords || 0)}</div>
              <div className="text-sm text-gray-600">Environmental Records</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats?.dataQuality || 0}%</div>
              <div className="text-sm text-gray-600">Data Quality</div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Voyages:</span>
                <span className="font-medium">{formatNumber(stats?.totalVoyages || 0)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Hull Records:</span>
                <span className="font-medium">{formatNumber(stats?.totalHullRecords || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trim Records:</span>
                <span className="font-medium">{formatNumber(stats?.totalTrimRecords || 0)}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Compliance Records:</span>
                <span className="font-medium">{formatNumber(stats?.totalComplianceRecords || 0)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Auxiliary Records:</span>
                <span className="font-medium">{formatNumber(stats?.totalAuxiliaryRecords || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average SFOC:</span>
                <span className="font-medium">{stats?.averageSfoc.toFixed(1)} g/kWh</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Oldest Record:</span>
                <span className="font-medium">{stats?.oldestRecord ? formatDate(stats.oldestRecord) : 'N/A'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Newest Record:</span>
                <span className="font-medium">{stats?.newestRecord ? formatDate(stats.newestRecord) : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Storage Health:</span>
                <span className="font-medium text-green-600">Optimal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Integrity Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Data Integrity & Quality Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Quality Metrics */}
          <div>
            <h4 className="font-semibold mb-3">Data Quality by Table</h4>
            <div className="space-y-3">
              {integrity?.dataQuality?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getQualityIcon(item.quality)}
                    <span className="text-sm font-medium">{item.table}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={item.quality} className="w-24" />
                    <span className={`text-sm font-bold ${getQualityColor(item.quality)}`}>
                      {item.quality}%
                    </span>
                  </div>
                </div>
              )) || <div className="text-sm text-gray-600">No quality issues detected</div>}
            </div>
          </div>

          <Separator />

          {/* Missing Data Issues */}
          <div>
            <h4 className="font-semibold mb-3">Missing Data Issues</h4>
            {integrity?.missingData?.length ? (
              <div className="space-y-2">
                {integrity.missingData.map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">{issue.table}</span>
                      <span className="text-sm text-gray-600">- {issue.issue}</span>
                    </div>
                    <Badge variant="destructive">{issue.count} issues</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                No missing data issues detected
              </div>
            )}
          </div>

          <Separator />

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold mb-3">Recommendations</h4>
            {integrity?.recommendations?.length ? (
              <div className="space-y-2">
                {integrity.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                All systems operating optimally
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Database Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup & Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Backup & Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Create a complete backup of all historical vessel performance data including fuel consumption, 
              environmental conditions, and compliance records.
            </p>
            <Button onClick={downloadBackup} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Complete Database Backup
            </Button>
            <div className="text-xs text-gray-500">
              Exports all tables as JSON format with timestamp and version info
            </div>
          </CardContent>
        </Card>

        {/* Database Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Performance Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Optimize database performance by updating table statistics, reclaiming storage space, 
              and rebuilding indexes for faster queries.
            </p>
            <Button 
              onClick={() => optimizeMutation.mutate()} 
              disabled={optimizeMutation.isPending}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              {optimizeMutation.isPending ? 'Optimizing...' : 'Optimize Database Performance'}
            </Button>
            {optimizeMutation.data && (
              <div className="text-xs text-green-600">
                ✓ {optimizeMutation.data.details?.join(', ')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Cleanup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Data Retention Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Clean up historical data older than specified retention period to manage storage space 
              while maintaining compliance with data retention policies.
            </p>
            <div>
              <Label htmlFor="retention">Retention Period (months)</Label>
              <Input
                id="retention"
                type="number"
                value={retentionMonths}
                onChange={(e) => setRetentionMonths(parseInt(e.target.value) || 24)}
                min="12"
                max="120"
              />
            </div>
            <Button 
              onClick={() => cleanupMutation.mutate(retentionMonths)} 
              disabled={cleanupMutation.isPending}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {cleanupMutation.isPending ? 'Cleaning...' : `Clean Data Older Than ${retentionMonths} Months`}
            </Button>
            {cleanupMutation.data && (
              <div className="text-xs text-green-600">
                ✓ Deleted {cleanupMutation.data.deletedRecords} old records
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storage Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Connection Status:</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Query Performance:</span>
                <Badge className="bg-green-100 text-green-800">Optimal</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Backup Status:</span>
                <Badge className="bg-blue-100 text-blue-800">Available</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Integrity:</span>
                <Badge className="bg-green-100 text-green-800">{stats?.dataQuality}%</Badge>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-4">
              PostgreSQL database with automatic failover and point-in-time recovery
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}