import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Fuel, 
  Ship, 
  Cog, 
  CloudRain, 
  BarChart3, 
  TrendingUp,
  Gauge,
  Wind,
  Zap,
  Settings
} from "lucide-react";

interface SidebarNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  data?: any;
}

interface AnalysisSection {
  id: string;
  name: string;
  icon: any;
  color: string;
  metrics: {
    label: string;
    value: string;
    status: 'good' | 'warning' | 'critical';
  }[];
  subsections: {
    id: string;
    name: string;
    icon: any;
  }[];
}

export default function SidebarNavigation({ activeSection, onSectionChange, data }: SidebarNavigationProps) {
  const [expandedSection, setExpandedSection] = useState<string>(activeSection);

  const analysisSections: AnalysisSection[] = [
    {
      id: 'fuel',
      name: 'FUEL ANALYSIS',
      icon: Fuel,
      color: 'bg-orange-500',
      metrics: [
        { label: 'SFOC', value: '197.2 g/kWh', status: 'warning' },
        { label: 'Consumption', value: '18.5 MT/day', status: 'good' },
        { label: 'Efficiency', value: '84.2%', status: 'good' }
      ],
      subsections: [
        { id: 'fuel-performance', name: 'Performance Trends', icon: TrendingUp },
        { id: 'fuel-consumption', name: 'Consumption Analysis', icon: BarChart3 },
        { id: 'fuel-cost', name: 'Cost per Mile', icon: Gauge },
        { id: 'fuel-eeoi', name: 'EEOI Tracking', icon: TrendingUp }
      ]
    },
    {
      id: 'hull',
      name: 'HULL PERFORMANCE',
      icon: Ship,
      color: 'bg-blue-500',
      metrics: [
        { label: 'Hull Roughness', value: '125.8 index', status: 'warning' },
        { label: 'Efficiency', value: '91.3%', status: 'good' },
        { label: 'Fouling Rate', value: '2.1%/month', status: 'critical' }
      ],
      subsections: [
        { id: 'hull-condition', name: 'Hull Condition', icon: Ship },
        { id: 'hull-resistance', name: 'Resistance Analysis', icon: Gauge },
        { id: 'hull-calculator', name: 'Hull Calculator', icon: Settings },
        { id: 'hull-analytics', name: 'Advanced Analytics', icon: BarChart3 }
      ]
    },
    {
      id: 'engine',
      name: 'ENGINE SYSTEMS',
      icon: Cog,
      color: 'bg-green-500',
      metrics: [
        { label: 'Engine Load', value: '78.5%', status: 'good' },
        { label: 'Power Output', value: '9,200 kW', status: 'good' },
        { label: 'Auxiliary Load', value: '10.5 MT/day', status: 'warning' }
      ],
      subsections: [
        { id: 'engine-performance', name: 'Main Engine', icon: Cog },
        { id: 'engine-load', name: 'Load Analysis', icon: Gauge },
        { id: 'auxiliary-systems', name: 'Auxiliary Systems', icon: Zap },
        { id: 'trim-optimization', name: 'Trim Optimization', icon: TrendingUp }
      ]
    },
    {
      id: 'environment',
      name: 'ENVIRONMENTAL',
      icon: CloudRain,
      color: 'bg-purple-500',
      metrics: [
        { label: 'Weather Impact', value: '+5.2%', status: 'warning' },
        { label: 'Wind Speed', value: '15.3 knots', status: 'good' },
        { label: 'Wave Height', value: '2.1 m', status: 'good' }
      ],
      subsections: [
        { id: 'weather-correlation', name: 'Weather Impact', icon: CloudRain },
        { id: 'environmental-data', name: 'Environmental Data', icon: Wind },
        { id: 'compliance', name: 'Compliance Tracking', icon: BarChart3 },
        { id: 'real-time-monitoring', name: 'Real-time Monitoring', icon: Gauge }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSectionClick = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection('');
    } else {
      setExpandedSection(sectionId);
      onSectionChange(sectionId);
    }
  };

  const handleSubsectionClick = (sectionId: string, subsectionId: string) => {
    onSectionChange(`${sectionId}-${subsectionId}`);
  };

  return (
    <div className="w-80 h-full bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Analysis Center</h2>
        <p className="text-sm text-gray-600 mb-4">Performance monitoring by category</p>
        
        <div className="space-y-3">
          {analysisSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;
            const isActive = activeSection.startsWith(section.id);
            
            return (
              <Card key={section.id} className={`transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-0">
                  {/* Main Section Header */}
                  <Button
                    variant="ghost"
                    onClick={() => handleSectionClick(section.id)}
                    className={`w-full justify-start p-4 h-auto rounded-none ${isActive ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${section.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{section.name}</div>
                          <div className="text-xs text-gray-500">
                            {section.subsections.length} modules
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {isExpanded ? '−' : '+'}
                      </div>
                    </div>
                  </Button>

                  {/* Key Metrics */}
                  {isExpanded && (
                    <div className="px-4 pb-2">
                      <div className="grid grid-cols-1 gap-2 mb-3">
                        {section.metrics.map((metric, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">{metric.label}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{metric.value}</span>
                              <Badge className={`${getStatusColor(metric.status)} text-xs px-1 py-0`}>
                                {metric.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Separator className="my-2" />
                      
                      {/* Subsections */}
                      <div className="space-y-1">
                        {section.subsections.map((subsection) => {
                          const SubIcon = subsection.icon;
                          const subsectionId = `${section.id}-${subsection.id}`;
                          const isSubActive = activeSection === subsectionId;
                          
                          return (
                            <Button
                              key={subsection.id}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSubsectionClick(section.id, subsection.id)}
                              className={`w-full justify-start text-xs h-8 ${isSubActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                              <SubIcon className="h-3 w-3 mr-2" />
                              {subsection.name}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Status Summary */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-medium text-sm mb-3">System Status</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Data Quality:</span>
                <Badge className="bg-green-100 text-green-800">98.7%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Update:</span>
                <span className="font-medium">2 min ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Alerts:</span>
                <Badge className="bg-yellow-100 text-yellow-800">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}