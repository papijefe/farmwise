import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Droplets, 
  Play,
  Pause,
  Settings,
  Thermometer,
  Gauge,
  Lightbulb,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface IrrigationModuleProps {
  onBack: () => void;
}

interface SensorData {
  soilMoisture: number;
  soilPH: number;
  temperature: number;
  lightIntensity: number;
  recommendation: string;
}

interface IrrigationZone {
  id: string;
  name: string;
  cropType: string;
  isActive: boolean;
  duration: number;
  moistureLevel: number;
  schedule: string;
}

export function IrrigationModule({ onBack }: IrrigationModuleProps) {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [irrigationZones, setIrrigationZones] = useState<IrrigationZone[]>([
    {
      id: 'zone1',
      name: 'Field A - North',
      cropType: 'Wheat',
      isActive: false,
      duration: 30,
      moistureLevel: 65,
      schedule: 'Every 2 days'
    },
    {
      id: 'zone2',
      name: 'Field B - South',
      cropType: 'Rice',
      isActive: true,
      duration: 45,
      moistureLevel: 80,
      schedule: 'Daily'
    },
    {
      id: 'zone3',
      name: 'Greenhouse 1',
      cropType: 'Tomatoes',
      isActive: false,
      duration: 20,
      moistureLevel: 55,
      schedule: 'Twice daily'
    }
  ]);

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSensorData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5d78fdfd/iot/sensors`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSensorData(data);
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleZone = (zoneId: string) => {
    setIrrigationZones(prev => 
      prev.map(zone => 
        zone.id === zoneId 
          ? { ...zone, isActive: !zone.isActive }
          : zone
      )
    );
  };

  const updateZoneDuration = (zoneId: string, duration: number) => {
    setIrrigationZones(prev => 
      prev.map(zone => 
        zone.id === zoneId 
          ? { ...zone, duration }
          : zone
      )
    );
  };

  const getMoistureStatus = (level: number) => {
    if (level < 40) return { status: 'Low', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (level < 70) return { status: 'Optimal', color: 'text-green-600', bgColor: 'bg-green-100' };
    return { status: 'High', color: 'text-blue-600', bgColor: 'bg-blue-100' };
  };

  const getPHStatus = (ph: number) => {
    if (ph < 6.0) return { status: 'Acidic', color: 'text-red-600' };
    if (ph > 7.5) return { status: 'Alkaline', color: 'text-blue-600' };
    return { status: 'Neutral', color: 'text-green-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <Droplets className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Smart Irrigation</h1>
                <p className="text-cyan-100 text-sm">IoT-powered water management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Auto Mode Control */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Auto Mode</span>
                </span>
                <Switch checked={autoMode} onCheckedChange={setAutoMode} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {autoMode 
                  ? 'System automatically manages irrigation based on sensor data and weather conditions.'
                  : 'Manual control enabled. Monitor and control each zone individually.'
                }
              </p>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${autoMode ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium">
                  {autoMode ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Zones</span>
                  <span className="font-medium text-blue-600">
                    {irrigationZones.filter(z => z.isActive).length}/{irrigationZones.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Water Pressure</span>
                  <Badge className="bg-green-100 text-green-800">Normal</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Update</span>
                  <span className="text-sm text-gray-600">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Start All Zones
              </Button>
              <Button variant="outline" className="w-full">
                <Pause className="h-4 w-4 mr-2" />
                Emergency Stop
              </Button>
              <Button variant="outline" className="w-full" onClick={fetchSensorData}>
                <svg className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sensor Data */}
        {sensorData && (
          <Card className="shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gauge className="h-5 w-5 text-purple-600" />
                <span>Real-time Sensor Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Soil Moisture */}
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-lg">{sensorData.soilMoisture}%</h3>
                  <p className="text-sm text-gray-600 mb-2">Soil Moisture</p>
                  <Badge className={getMoistureStatus(sensorData.soilMoisture).bgColor + ' ' + getMoistureStatus(sensorData.soilMoisture).color}>
                    {getMoistureStatus(sensorData.soilMoisture).status}
                  </Badge>
                </div>

                {/* Soil pH */}
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-sm font-bold">pH</span>
                  </div>
                  <h3 className="font-semibold text-lg">{sensorData.soilPH}</h3>
                  <p className="text-sm text-gray-600 mb-2">Soil pH</p>
                  <Badge className={`bg-gray-100 ${getPHStatus(Number(sensorData.soilPH)).color}`}>
                    {getPHStatus(Number(sensorData.soilPH)).status}
                  </Badge>
                </div>

                {/* Temperature */}
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Thermometer className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-lg">{sensorData.temperature}°C</h3>
                  <p className="text-sm text-gray-600 mb-2">Temperature</p>
                  <Badge className="bg-orange-100 text-orange-800">
                    {sensorData.temperature > 30 ? 'High' : sensorData.temperature < 15 ? 'Low' : 'Normal'}
                  </Badge>
                </div>

                {/* Light Intensity */}
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-lg">{Math.round(sensorData.lightIntensity / 1000)}k</h3>
                  <p className="text-sm text-gray-600 mb-2">Light (lux)</p>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {sensorData.lightIntensity > 50000 ? 'High' : sensorData.lightIntensity < 10000 ? 'Low' : 'Good'}
                  </Badge>
                </div>
              </div>

              {/* AI Recommendation */}
              <Alert className="mt-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Recommendation:</strong> {sensorData.recommendation}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Irrigation Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {irrigationZones.map((zone) => (
            <Card key={zone.id} className="shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${zone.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span>{zone.name}</span>
                  </CardTitle>
                  <Switch 
                    checked={zone.isActive} 
                    onCheckedChange={() => toggleZone(zone.id)}
                    disabled={autoMode}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Crop Type:</span>
                  <Badge variant="outline">{zone.cropType}</Badge>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Moisture Level:</span>
                    <span className="text-sm font-medium">{zone.moistureLevel}%</span>
                  </div>
                  <Progress value={zone.moistureLevel} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Duration (minutes):</span>
                    <span className="text-sm font-medium">{zone.duration}</span>
                  </div>
                  <Slider
                    value={[zone.duration]}
                    onValueChange={(value) => updateZoneDuration(zone.id, value[0])}
                    max={120}
                    min={5}
                    step={5}
                    className="w-full"
                    disabled={autoMode}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Schedule:</span>
                  <span className="text-sm font-medium">{zone.schedule}</span>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1" 
                    disabled={autoMode}
                    onClick={() => toggleZone(zone.id)}
                  >
                    {zone.isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schedule & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Irrigation Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '06:00 AM', zone: 'Field A - North', duration: '30 min', status: 'scheduled' },
                  { time: '07:30 AM', zone: 'Greenhouse 1', duration: '20 min', status: 'completed' },
                  { time: '06:00 PM', zone: 'Field B - South', duration: '45 min', status: 'scheduled' },
                  { time: '07:00 PM', zone: 'Greenhouse 1', duration: '20 min', status: 'scheduled' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium">{item.time}</p>
                      <p className="text-sm text-gray-600">{item.zone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.duration}</p>
                      <Badge className={item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Water Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1669196740673-2f19424fc1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxpcnJpZ2F0aW9uJTIwZmFybWluZ3xlbnwxfHx8fDE3NTgwODc3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Irrigation system"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-2xl font-bold">2,450L</p>
                  <p className="text-sm opacity-90">Today's Usage</p>
                </div>
                <div className="absolute bottom-4 right-4 text-white text-right">
                  <p className="font-semibold text-green-400">-15%</p>
                  <p className="text-sm opacity-90">vs Yesterday</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Weekly Average</span>
                  <span className="font-medium">2,850L/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Water Saved</span>
                  <span className="font-medium text-green-600">420L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Efficiency</span>
                  <Badge className="bg-green-100 text-green-800">95%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}