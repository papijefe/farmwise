import React, { useState, useEffect } from 'react';
import { 
  Thermometer, Droplets, Wind, Sun, Cloud, TrendingUp, TrendingDown, 
  Leaf, Bug, Bell, Calendar, MapPin, Activity, BarChart3, PieChart,
  Lightbulb, AlertTriangle, CheckCircle, ArrowUp, ArrowDown, Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ModernDashboard({ language = 'english' }) {
  const [weatherData, setWeatherData] = useState(null);
  const [plantHealth, setPlantHealth] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  const translations = {
    english: {
      title: 'Dashboard',
      subtitle: 'Your Farm Overview',
      weather: 'Weather Today',
      plantHealth: 'Plant Health',
      soilCondition: 'Soil Condition',
      weeklyInsights: 'Weekly Insights',
      marketPrices: 'Market Prices',
      alerts: 'Alerts',
      recommendations: 'Recommendations',
      growthRate: 'Growth Rate',
      diseaseRisk: 'Disease Risk',
      fieldDetails: 'Field Details',
      temperature: 'Temperature',
      humidity: 'Humidity',
      soilMoisture: 'Soil Moisture',
      lightIntensity: 'Light Intensity',
      optimal: 'Optimal',
      good: 'Good',
      warning: 'Warning',
      critical: 'Critical',
      viewDetails: 'View Details',
      refresh: 'Refresh Data'
    },
    hindi: {
      title: 'डैशबोर्ड',
      subtitle: 'आपके खेत का अवलोकन',
      weather: 'आज का मौसम',
      plantHealth: 'पौधों का स्वास्थ्य',
      soilCondition: 'मिट्टी की स्थिति',
      weeklyInsights: 'साप्ताहिक अंतर्दृष्टि',
      marketPrices: 'बाजार भाव',
      alerts: 'चेतावनियां',
      recommendations: 'सुझाव',
      growthRate: 'वृद���धि दर',
      diseaseRisk: 'रोग जोखिम',
      fieldDetails: 'खेत विवरण',
      temperature: 'तापमान',
      humidity: 'नमी',
      soilMoisture: 'मिट्टी की नमी',
      lightIntensity: 'प्रकाश तीव्रता',
      optimal: 'इष्टतम',
      good: 'अच्छा',
      warning: 'चेतावनी',
      critical: 'गंभीर',
      viewDetails: 'विवरण देखें',
      refresh: 'डेटा रीफ्रेश करें'
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Set mock data immediately to avoid empty states
    const mockWeatherData = {
      temperature: 25,
      condition: 'Partly Cloudy',
      location: 'Punjab, India',
      humidity: 65,
      windSpeed: 12
    };
    
    const mockSensorData = {
      soilMoisture: 45,
      soilPH: 6.8,
      recommendation: 'Soil conditions are optimal'
    };
    
    const mockMarketData = [
      { name: 'Wheat', price: 2200, change: '+2.5%', trend: 'up' },
      { name: 'Rice', price: 3200, change: '-1.2%', trend: 'down' },
      { name: 'Tomato', price: 4500, change: '+5.8%', trend: 'up' },
      { name: 'Cotton', price: 6200, change: '+1.8%', trend: 'up' },
      { name: 'Onion', price: 2800, change: '-3.2%', trend: 'down' },
      { name: 'Sugarcane', price: 350, change: '+0.5%', trend: 'up' }
    ];
    
    const mockPlantHealth = {
      overall: 85,
      growth: 92,
      disease: 15,
      nutrition: 78
    };
    
    // Set mock data first
    setWeatherData(mockWeatherData);
    setSensorData(mockSensorData);
    setMarketData(mockMarketData);
    setPlantHealth(mockPlantHealth);
    
    try {
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-5d78fdfd`;
      
      console.log('Attempting to load dashboard data from:', baseUrl);
      
      // Try to fetch real data with timeout
      const fetchWithTimeout = (url, options, timeout = 5000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };
      
      const requests = [
        fetchWithTimeout(`${baseUrl}/weather/current`, {
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }).then(res => ({ type: 'weather', response: res })).catch(err => ({ type: 'weather', error: err })),
        
        fetchWithTimeout(`${baseUrl}/iot/sensors`, {
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }).then(res => ({ type: 'sensors', response: res })).catch(err => ({ type: 'sensors', error: err })),
        
        fetchWithTimeout(`${baseUrl}/market/prices`, {
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }).then(res => ({ type: 'market', response: res })).catch(err => ({ type: 'market', error: err }))
      ];
      
      const results = await Promise.allSettled(requests);
      
      results.forEach(async (result) => {
        if (result.status === 'fulfilled') {
          const { type, response, error } = result.value;
          
          if (error) {
            console.log(`${type} API unavailable:`, error.message);
            return;
          }
          
          if (response && response.ok) {
            try {
              const data = await response.json();
              console.log(`${type} data loaded from API:`, data);
              
              switch (type) {
                case 'weather':
                  setWeatherData(data);
                  break;
                case 'sensors':
                  setSensorData(data);
                  break;
                case 'market':
                  setMarketData(data);
                  break;
              }
            } catch (parseError) {
              console.log(`Failed to parse ${type} response:`, parseError);
            }
          } else {
            console.log(`${type} API returned error:`, response?.status || 'Unknown');
          }
        }
      });

    } catch (error) {
      console.log('Dashboard data fetch failed, using mock data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const plantGrowthData = [
    { week: 'W1', growth: 20 },
    { week: 'W2', growth: 35 },
    { week: 'W3', growth: 58 },
    { week: 'W4', growth: 75 },
    { week: 'W5', growth: 85 },
    { week: 'W6', growth: 92 }
  ];

  const diseaseDistribution = [
    { name: 'Healthy', value: 85, color: '#10b981' },
    { name: 'At Risk', value: 10, color: '#f59e0b' },
    { name: 'Infected', value: 5, color: '#ef4444' }
  ];

  const WeatherCard = () => (
    <Card className="bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-blue-900">
          <Cloud className="h-5 w-5 mr-2" />
          {t.weather}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weatherData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-900">
                  {weatherData.temperature}°C
                </div>
                <div className="text-sm text-blue-700">
                  {weatherData.condition}
                </div>
              </div>
              <div className="text-right">
                <Sun className="h-8 w-8 text-yellow-500 mb-1" />
                <div className="text-xs text-blue-600">
                  {weatherData.location}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-blue-800">{weatherData.humidity}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <span className="text-blue-800">{weatherData.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-blue-200 rounded w-24"></div>
            <div className="h-4 bg-blue-200 rounded w-32"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const PlantHealthCard = () => (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-green-900">
          <Leaf className="h-5 w-5 mr-2" />
          {t.plantHealth}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {plantHealth ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-900 mb-1">
                {plantHealth.overall}%
              </div>
              <div className="text-sm text-green-700">Overall Health</div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-800">{t.growthRate}</span>
                  <span className="text-green-600">{plantHealth.growth}%</span>
                </div>
                <Progress value={plantHealth.growth} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-800">Nutrition</span>
                  <span className="text-green-600">{plantHealth.nutrition}%</span>
                </div>
                <Progress value={plantHealth.nutrition} className="h-2" />
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-green-200 rounded w-16 mx-auto"></div>
            <div className="h-2 bg-green-200 rounded"></div>
            <div className="h-2 bg-green-200 rounded"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const SoilConditionCard = () => (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-amber-900">
          <Activity className="h-5 w-5 mr-2" />
          {t.soilCondition}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sensorData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-900">
                  {sensorData.soilMoisture}%
                </div>
                <div className="text-xs text-amber-700">{t.soilMoisture}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-900">
                  {sensorData.soilPH}
                </div>
                <div className="text-xs text-amber-700">pH Level</div>
              </div>
            </div>
            
            <div className="bg-amber-200/50 rounded-lg p-2 text-center">
              <div className="text-sm font-medium text-amber-800">
                {sensorData.recommendation}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-6 bg-amber-200 rounded"></div>
              <div className="h-6 bg-amber-200 rounded"></div>
            </div>
            <div className="h-8 bg-amber-200 rounded"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const GrowthChart = () => (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          {t.weeklyInsights}
        </CardTitle>
        <CardDescription>Plant growth over the past 6 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={plantGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="growth" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const DiseaseRiskChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bug className="h-5 w-5 mr-2 text-red-600" />
          {t.diseaseRisk}
        </CardTitle>
        <CardDescription>Current field health status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                dataKey="value"
                data={diseaseDistribution}
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={30}
              >
                {diseaseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {diseaseDistribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const MarketCard = () => (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          {t.marketPrices}
        </CardTitle>
        <CardDescription>Today's market rates</CardDescription>
      </CardHeader>
      <CardContent>
        {marketData ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {marketData.slice(0, 6).map((crop, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">{crop.name}</div>
                <div className="text-lg font-bold text-gray-800">₹{crop.price}</div>
                <div className={`text-sm flex items-center justify-center space-x-1 ${
                  crop.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {crop.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  <span>{crop.change}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const AlertsCard = () => (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-orange-600" />
          {t.alerts}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-yellow-800">Irrigation Needed</div>
            <div className="text-xs text-yellow-700">Soil moisture below optimal level</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-green-800">Weather Optimal</div>
            <div className="text-xs text-green-700">Good conditions for field work</div>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-blue-800">Market Update</div>
            <div className="text-xs text-blue-700">Wheat prices trending upward</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline" className="mt-4 sm:mt-0">
          <Activity className="h-4 w-4 mr-2" />
          {t.refresh}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WeatherCard />
        <PlantHealthCard />
        <SoilConditionCard />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GrowthChart />
        <DiseaseRiskChart />
      </div>

      {/* Market Data */}
      <MarketCard />

      {/* Alerts and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AlertsCard />
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-purple-600" />
              {t.recommendations}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Optimal Planting Window</h4>
                <p className="text-sm text-green-700">
                  Current weather conditions are ideal for planting. Soil temperature and moisture levels are optimal.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Irrigation Schedule</h4>
                <p className="text-sm text-blue-700">
                  Based on weather forecast and soil moisture, next irrigation recommended in 2-3 days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}