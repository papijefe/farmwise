import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  Activity,
  DollarSign,
  Leaf
} from 'lucide-react';

interface DashboardProps {
  onBack?: () => void;
}

interface DashboardStats {
  totalReports: number;
  activeOutbreaks: number;
  farmersHelped: number;
  avgResponseTime: string;
  topDiseases: Array<{ name: string; count: number; trend: 'up' | 'down' }>;
  regionStats: Array<{ region: string; reports: number; severity: 'low' | 'medium' | 'high' }>;
  monthlyTrends: Array<{ month: string; reports: number; resolved: number }>;
}

export function Dashboard({ onBack }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 1247,
    activeOutbreaks: 23,
    farmersHelped: 856,
    avgResponseTime: '2.4 hours',
    topDiseases: [
      { name: 'Leaf Spot', count: 156, trend: 'up' },
      { name: 'Blight', count: 134, trend: 'down' },
      { name: 'Rust', count: 98, trend: 'up' },
      { name: 'Powdery Mildew', count: 87, trend: 'down' },
      { name: 'Root Rot', count: 76, trend: 'up' }
    ],
    regionStats: [
      { region: 'Punjab', reports: 342, severity: 'high' },
      { region: 'Haryana', reports: 298, severity: 'medium' },
      { region: 'Uttar Pradesh', reports: 267, severity: 'high' },
      { region: 'Madhya Pradesh', reports: 189, severity: 'low' },
      { region: 'Rajasthan', reports: 151, severity: 'medium' }
    ],
    monthlyTrends: [
      { month: 'Jan', reports: 89, resolved: 84 },
      { month: 'Feb', reports: 76, resolved: 72 },
      { month: 'Mar', reports: 134, resolved: 128 },
      { month: 'Apr', reports: 198, resolved: 185 },
      { month: 'May', reports: 234, resolved: 220 },
      { month: 'Jun', reports: 267, resolved: 248 }
    ]
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-red-600" /> : 
      <TrendingDown className="h-4 w-4 text-green-600" />;
  };

  const getResolutionRate = () => {
    const totalReports = stats.monthlyTrends.reduce((sum, month) => sum + month.reports, 0);
    const totalResolved = stats.monthlyTrends.reduce((sum, month) => sum + month.resolved, 0);
    return Math.round((totalResolved / totalReports) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to FarmWise Dashboard</h1>
        <p className="text-gray-600">Your comprehensive farming analytics and insights</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-3xl font-bold text-indigo-600">{stats.totalReports.toLocaleString()}</p>
                </div>
                <div className="bg-indigo-100 rounded-full p-3">
                  <Activity className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Outbreaks</p>
                  <p className="text-3xl font-bold text-red-600">{stats.activeOutbreaks}</p>
                </div>
                <div className="bg-red-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">-8% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Farmers Helped</p>
                  <p className="text-3xl font-bold text-green-600">{stats.farmersHelped.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+23% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Time</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.avgResponseTime}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">-15min improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="diseases">Disease Trends</TabsTrigger>
            <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Alerts */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Recent Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      location: 'Punjab, Ludhiana',
                      disease: 'Wheat Rust',
                      severity: 'high',
                      time: '2 hours ago',
                      farmers: 45
                    },
                    {
                      location: 'Haryana, Karnal',
                      disease: 'Rice Blast',
                      severity: 'medium',
                      time: '5 hours ago',
                      farmers: 23
                    },
                    {
                      location: 'UP, Meerut',
                      disease: 'Tomato Blight',
                      severity: 'high',
                      time: '8 hours ago',
                      farmers: 67
                    }
                  ].map((alert, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{alert.disease}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{alert.location}</span>
                        </div>
                        <span>{alert.farmers} farmers affected</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Disease Detection Accuracy</span>
                      <span className="text-sm font-bold">94.7%</span>
                    </div>
                    <Progress value={94.7} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Resolution Rate</span>
                      <span className="text-sm font-bold">{getResolutionRate()}%</span>
                    </div>
                    <Progress value={getResolutionRate()} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Farmer Satisfaction</span>
                      <span className="text-sm font-bold">96.2%</span>
                    </div>
                    <Progress value={96.2} className="h-2" />
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Uptime</span>
                      <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Load Time</span>
                      <Badge className="bg-blue-100 text-blue-800">1.2s</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Users</span>
                      <Badge className="bg-purple-100 text-purple-800">2,847</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends Chart */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Monthly Report Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {stats.monthlyTrends.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full space-y-1">
                        <div
                          className="bg-red-200 rounded-t"
                          style={{ height: `${(month.reports / 300) * 100}px` }}
                        ></div>
                        <div
                          className="bg-green-200 rounded-b"
                          style={{ height: `${(month.resolved / 300) * 100}px` }}
                        ></div>
                      </div>
                      <span className="text-xs mt-2 font-medium">{month.month}</span>
                      <span className="text-xs text-gray-500">{month.reports}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4 space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-200 rounded"></div>
                    <span className="text-sm">Reports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <span className="text-sm">Resolved</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disease Trends Tab */}
          <TabsContent value="diseases" className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Top Diseases by Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topDiseases.map((disease, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                        <div>
                          <h4 className="font-semibold">{disease.name}</h4>
                          <p className="text-sm text-gray-600">{disease.count} reports</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(disease.trend)}
                        <span className={`text-sm font-medium ${disease.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                          {disease.trend === 'up' ? '+' : '-'}{Math.floor(Math.random() * 20 + 5)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regional Analysis Tab */}
          <TabsContent value="regions" className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Regional Disease Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.regionStats.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-semibold">{region.region}</h4>
                          <p className="text-sm text-gray-600">{region.reports} reports</p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(region.severity)}>
                        {region.severity} risk
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Detection Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <h3 className="text-3xl font-bold text-green-600 mb-2">94.7%</h3>
                    <p className="text-sm text-gray-600">Overall Accuracy</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-xl font-bold text-blue-600">97.2%</h4>
                      <p className="text-xs text-gray-600">Precision</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h4 className="text-xl font-bold text-purple-600">92.1%</h4>
                      <p className="text-xs text-gray-600">Recall</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="font-bold">2,847</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Images Processed</span>
                    <span className="font-bold">12,456</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Chat Messages</span>
                    <span className="font-bold">8,923</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Weather Queries</span>
                    <span className="font-bold">5,671</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}