import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, MapPin, Calendar, Clock, AlertTriangle, Sunrise, Sunset, Compass } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import DivTooltipContainer from '../imports/DivTooltipContainer';
import DivContainer from '../imports/DivContainer';
import DivCard from '../imports/DivCard';
import FigmaButton from '../imports/Button';

export function WeatherModule({ language }) {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('Punjab, India');
  const [loading, setLoading] = useState(false);

  const translations = {
    english: {
      title: 'Weather Insights',
      subtitle: 'Get accurate weather forecasts for better farming decisions',
      currentWeather: 'Current Weather',
      forecast: '7-Day Forecast',
      searchLocation: 'Search location...',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      visibility: 'Visibility',
      uvIndex: 'UV Index',
      pressure: 'Pressure',
      feelsLike: 'Feels Like',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      today: 'Today',
      tomorrow: 'Tomorrow',
      alerts: 'Weather Alerts',
      recommendations: 'Farming Recommendations',
      irrigationAdvice: 'Irrigation Advice',
      plantingConditions: 'Planting Conditions',
      harvestingConditions: 'Harvesting Conditions',
      noAlerts: 'No weather alerts for your area',
      rainyDay: 'Rainy Day',
      sunnyDay: 'Sunny Day',
      cloudyDay: 'Cloudy Day',
      stormyDay: 'Stormy Day',
      goodConditions: 'Good conditions for farming activities',
      avoidIrrigation: 'Avoid irrigation due to expected rainfall',
      idealPlanting: 'Ideal conditions for planting',
      delayHarvest: 'Consider delaying harvest due to weather'
    },
    hindi: {
      title: 'मौसम जानकारी',
      subtitle: 'बेहतर कृषि निर्णयों के लिए सटीक मौसम पूर्वानुमान प्राप्त करें',
      currentWeather: 'वर्तमान मौसम',
      forecast: '7-दिन का पूर्वानुमान',
      searchLocation: 'स्थान खोजें...',
      temperature: 'तापमान',
      humidity: 'नमी',
      windSpeed: 'हवा की गति',
      visibility: 'दृश्यता',
      uvIndex: 'यूवी इंडेक्स',
      pressure: 'दबाव',
      feelsLike: 'महसूस होता है',
      sunrise: 'सूर्योदय',
      sunset: 'सूर्यास्त',
      today: 'आज',
      tomorrow: 'कल',
      alerts: 'मौसम चेतावनियां',
      recommendations: 'कृषि सुझाव',
      irrigationAdvice: 'सिंचाई सलाह',
      plantingConditions: 'बुआई की स्थिति',
      harvestingConditions: 'कटाई की स्थिति',
      noAlerts: 'आपके क्षेत्र के लिए कोई मौसम चेतावनी नहीं',
      rainyDay: 'बारिश का दिन',
      sunnyDay: 'धूप का दिन',
      cloudyDay: 'बादल वाला दिन',
      stormyDay: 'तूफानी दिन',
      goodConditions: 'कृषि गतिविधियों के लिए अच्छी स्थिति',
      avoidIrrigation: 'अपेक्षित वर्षा के कारण सिंचाई से बचें',
      idealPlanting: 'बुआई के लिए आदर्श स्थि��ि',
      delayHarvest: 'मौसम के कारण कटाई में देरी पर विचार करें'
    }
  };

  const t = translations[language];

  // Mock weather data
  const mockCurrentWeather = {
    location: 'Ajmer, India',
    temperature: 28,
    feelsLike: 32,
    condition: 'Partly Cloudy',
    conditionHindi: 'आंशिक रूप से बादल',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6,
    pressure: 1013,
    sunrise: '06:15',
    sunset: '18:45',
    icon: 'partly-cloudy'
  };

  const mockForecast = [
    {
      date: '2024-03-16',
      day: 'Today',
      dayHindi: 'आज',
      high: 30,
      low: 18,
      condition: 'Sunny',
      conditionHindi: 'धूप',
      humidity: 60,
      windSpeed: 8,
      precipitation: 0,
      icon: 'sunny'
    },
    {
      date: '2024-03-17',
      day: 'Tomorrow',
      dayHindi: 'कल',
      high: 28,
      low: 16,
      condition: 'Partly Cloudy',
      conditionHindi: 'आंशिक बादल',
      humidity: 70,
      windSpeed: 10,
      precipitation: 10,
      icon: 'partly-cloudy'
    },
    {
      date: '2024-03-18',
      day: 'Monday',
      dayHindi: 'सोमवार',
      high: 25,
      low: 14,
      condition: 'Rainy',
      conditionHindi: 'बारिश',
      humidity: 85,
      windSpeed: 15,
      precipitation: 80,
      icon: 'rainy'
    },
    {
      date: '2024-03-19',
      day: 'Tuesday',
      dayHindi: 'मंगलवार',
      high: 27,
      low: 15,
      condition: 'Cloudy',
      conditionHindi: 'बादल',
      humidity: 72,
      windSpeed: 12,
      precipitation: 20,
      icon: 'cloudy'
    },
    {
      date: '2024-03-20',
      day: 'Wednesday',
      dayHindi: 'बुधवार',
      high: 31,
      low: 19,
      condition: 'Sunny',
      conditionHindi: 'धूप',
      humidity: 58,
      windSpeed: 9,
      precipitation: 0,
      icon: 'sunny'
    },
    {
      date: '2024-03-21',
      day: 'Thursday',
      dayHindi: 'गुरुवार',
      high: 29,
      low: 17,
      condition: 'Partly Cloudy',
      conditionHindi: 'आंशिक बादल',
      humidity: 63,
      windSpeed: 11,
      precipitation: 5,
      icon: 'partly-cloudy'
    },
    {
      date: '2024-03-22',
      day: 'Friday',
      dayHindi: 'शुक्रवार',
      high: 26,
      low: 16,
      condition: 'Rainy',
      conditionHindi: 'बारिश',
      humidity: 88,
      windSpeed: 18,
      precipitation: 90,
      icon: 'rainy'
    }
  ];

  const mockAlerts = [
    {
      type: 'warning',
      title: 'Heavy Rainfall Expected',
      titleHindi: 'भारी बारिश की संभावना',
      description: 'Heavy rainfall expected on November 18th and 22nd. Plan irrigation accordingly.',
      descriptionHindi: '18 और 22 नवंबर को भारी बारिश की संभावना है। सिंचाई की योजना तदनुसार बनाएं।',
      validUntil: '2025-11-22'
    }
  ];

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    setLoading(true);
    
    // Set mock data immediately for better UX
    setCurrentWeather(mockCurrentWeather);
    setForecast(mockForecast);
    
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-5d78fdfd`;
      
      console.log('Attempting to load weather data from:', `${baseUrl}/weather/current`);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${baseUrl}/weather/current?location=${encodeURIComponent(location)}`, {
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Weather API response status:', response.status);

      if (response.ok) {
        const weatherData = await response.json();
        console.log('Weather data received from API:', weatherData);
        
        setCurrentWeather({
          location: weatherData.location,
          temperature: weatherData.temperature,
          feelsLike: weatherData.feelsLike,
          condition: weatherData.condition,
          conditionHindi: getHindiCondition(weatherData.condition),
          humidity: weatherData.humidity,
          windSpeed: weatherData.windSpeed,
          visibility: weatherData.visibility,
          uvIndex: weatherData.uvIndex,
          pressure: weatherData.pressure,
          sunrise: weatherData.sunrise,
          sunset: weatherData.sunset,
          icon: weatherData.icon
        });
        
        setForecast(weatherData.forecast.map(day => ({
          ...day,
          dayHindi: getHindiDay(day.day),
          conditionHindi: getHindiCondition(day.condition)
        })));
        
        console.log('Weather data updated successfully');
      } else {
        const errorText = await response.text();
        console.log('Weather API returned error:', response.status, errorText);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Weather API request timed out, using mock data');
      } else {
        console.log('Weather API unavailable, using mock data:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getHindiDay = (day) => {
    const dayMap = {
      'Today': 'आज',
      'Tomorrow': 'कल',
      'Monday': 'सोमवार',
      'Tuesday': 'मंगलवार',
      'Wednesday': 'बुधवार',
      'Thursday': 'गुरुवार',
      'Friday': 'शुक्रवार',
      'Saturday': 'शनिवार',
      'Sunday': 'रविवार'
    };
    return dayMap[day] || day;
  };

  const getHindiCondition = (condition) => {
    const conditionMap = {
      'Sunny': 'धूप',
      'Partly Cloudy': 'आंशिक बादल',
      'Cloudy': 'बादल',
      'Rainy': 'बारिश',
      'Light Rain': 'हल्की बारिश',
      'Heavy Rain': 'भारी बारिश',
      'Clear': 'साफ'
    };
    return conditionMap[condition] || condition;
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'partly-cloudy': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-600" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getUVIndexColor = (uvIndex) => {
    if (uvIndex <= 2) return 'bg-green-500';
    if (uvIndex <= 5) return 'bg-yellow-500';
    if (uvIndex <= 7) return 'bg-orange-500';
    if (uvIndex <= 10) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getFarmingRecommendations = () => {
    if (!forecast.length) return [];

    const recommendations = [];
    const todayForecast = forecast[0];
    const tomorrowForecast = forecast[1];

    // Irrigation advice
    if (todayForecast.precipitation > 60 || tomorrowForecast.precipitation > 60) {
      recommendations.push({
        type: 'irrigation',
        title: t.irrigationAdvice,
        message: t.avoidIrrigation,
        icon: <Droplets className="h-5 w-5 text-blue-500" />,
        color: 'bg-blue-50 border-blue-200'
      });
    }

    // Planting conditions
    if (todayForecast.condition === 'Sunny' && todayForecast.humidity < 70) {
      recommendations.push({
        type: 'planting',
        title: t.plantingConditions,
        message: t.idealPlanting,
        icon: <Sun className="h-5 w-5 text-green-500" />,
        color: 'bg-green-50 border-green-200'
      });
    }

    // Harvesting conditions
    if (forecast.some(day => day.precipitation > 70)) {
      recommendations.push({
        type: 'harvesting',
        title: t.harvestingConditions,
        message: t.delayHarvest,
        icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
        color: 'bg-orange-50 border-orange-200'
      });
    }

    return recommendations;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-green-800 mb-2">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-8 w-20 h-12 opacity-10 hidden lg:block">
        <DivTooltipContainer />
      </div>
      <div className="absolute top-32 left-4 w-24 h-24 opacity-8 rotate-45 hidden lg:block">
        <DivContainer />
      </div>
      <div className="absolute bottom-20 right-12 w-32 h-32 opacity-6 -rotate-12 hidden lg:block">
        <DivContainer />
      </div>

      {/* Header */}
      <div className="text-center relative z-10">
        <h2 className="text-green-800 mb-2">Weather Insights | मौसम जानकारी</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get accurate weather forecasts for better farming decisions | 
          बेहतर कृषि निर्णयों के लिए सटीक मौसम पूर्वानुमान प्राप्त करें
        </p>
      </div>

      {/* Location Search */}
      <Card className="relative overflow-hidden shadow-xl border-2 border-gray-800" style={{boxShadow: '8px 8px 0px 0px #323232'}}>
        <div className="absolute top-2 right-4 w-12 h-8 opacity-15">
          <DivTooltipContainer />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-xl">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <Input
              placeholder="Search location... | स्थान खोजें..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 rounded-xl border-2"
            />
            <Button 
              onClick={loadWeatherData}
              className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-sm">Update</div>
                <div className="text-xs opacity-90">अपडेट</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      {mockAlerts.length > 0 && (
        <div>
          <h3 className="mb-4 text-gray-800 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>{t.alerts}</span>
          </h3>
          <div className="space-y-4">
            {mockAlerts.map((alert, index) => (
              <Card key={index} className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-orange-800">
                        {language === 'hindi' ? alert.titleHindi : alert.title}
                      </h4>
                      <p className="text-sm text-orange-700 mt-1">
                        {language === 'hindi' ? alert.descriptionHindi : alert.description}
                      </p>
                      <p className="text-xs text-orange-600 mt-2">
                        Valid until: {alert.validUntil}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Current Weather */}
      {currentWeather && (
        <Card className="bg-gradient-to-br from-blue-50 to-sky-50 relative overflow-hidden shadow-2xl border-2 border-blue-200" style={{boxShadow: '12px 12px 0px 0px #0ea5e9'}}>
          {/* Weather decorative elements */}
          <div className="absolute top-4 right-6 w-20 h-12 opacity-20">
            <DivTooltipContainer />
          </div>
          <div className="absolute bottom-0 left-0 w-24 h-24 opacity-15">
            <DivContainer />
          </div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Cloud className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">Current Weather</div>
                <div className="text-sm text-gray-600 font-normal">वर्तमान मौसम</div>
              </div>
            </CardTitle>
            <CardDescription className="flex items-center space-x-2 text-base font-medium">
              <MapPin className="h-4 w-4" />
              <span>{currentWeather.location}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Main Weather Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {getWeatherIcon(currentWeather.icon)}
                <div>
                  <div className="text-4xl font-bold text-gray-800">
                    {currentWeather.temperature}°C
                  </div>
                  <div className="text-sm text-gray-600">
                    {t.feelsLike} {currentWeather.feelsLike}°C
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium text-gray-800">
                  {language === 'hindi' ? currentWeather.conditionHindi : currentWeather.condition}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            <Separator />

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">{t.humidity}</div>
                <div className="font-semibold">{currentWeather.humidity}%</div>
              </div>
              
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <Wind className="h-5 w-5 text-gray-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">{t.windSpeed}</div>
                <div className="font-semibold">{currentWeather.windSpeed} km/h</div>
              </div>
              
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <Eye className="h-5 w-5 text-green-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">{t.visibility}</div>
                <div className="font-semibold">{currentWeather.visibility} km</div>
              </div>
              
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <Sun className="h-5 w-5 text-orange-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">{t.uvIndex}</div>
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getUVIndexColor(currentWeather.uvIndex)}`}></div>
                  <span className="font-semibold">{currentWeather.uvIndex}</span>
                </div>
              </div>
            </div>

            {/* Sun Times */}
            <div className="flex items-center justify-around p-4 bg-white/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Sunrise className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-xs text-gray-600">{t.sunrise}</div>
                  <div className="font-medium">{currentWeather.sunrise}</div>
                </div>
              </div>
              
              <Separator orientation="vertical" className="h-8" />
              
              <div className="flex items-center space-x-2">
                <Sunset className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-xs text-gray-600">{t.sunset}</div>
                  <div className="font-medium">{currentWeather.sunset}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7-Day Forecast */}
      <div className="relative">
        <div className="absolute -top-2 right-0 w-16 h-10 opacity-10">
          <DivTooltipContainer />
        </div>
        <h3 className="mb-6 text-gray-800 relative z-10">
          <span className="text-xl font-semibold">7-Day Forecast</span>
          <span className="text-gray-600 text-base ml-2">| 7-दिन का पूर्वानुमान</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <Card key={index} className={`text-center shadow-lg border-2 border-gray-800 transition-all duration-200 hover:scale-105 ${index === 0 ? 'ring-2 ring-green-500 bg-green-50' : ''}`} style={{boxShadow: '6px 6px 0px 0px #323232'}}>
              <CardContent className="p-4 relative overflow-hidden">
                {index === 0 && (
                  <div className="absolute top-1 right-1 w-8 h-5 opacity-20">
                    <DivTooltipContainer />
                  </div>
                )}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-800">
                    {language === 'hindi' ? day.dayHindi : day.day}
                  </div>
                  
                  <div className="flex justify-center">
                    {getWeatherIcon(day.icon)}
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    {language === 'hindi' ? day.conditionHindi : day.condition}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800">{day.high}°</div>
                    <div className="text-sm text-gray-500">{day.low}°</div>
                  </div>
                  
                  {day.precipitation > 0 && (
                    <div className="flex items-center justify-center space-x-1 text-xs text-blue-600">
                      <Droplets className="h-3 w-3" />
                      <span>{day.precipitation}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Farming Recommendations */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-20 h-12 opacity-8">
          <DivTooltipContainer />
        </div>
        <h3 className="mb-6 text-gray-800 relative z-10">
          <span className="text-xl font-semibold">Farming Recommendations</span>
          <span className="text-gray-600 text-base ml-2">| कृषि सुझाव</span>
        </h3>
        
        {getFarmingRecommendations().length === 0 ? (
          <Card className="shadow-xl border-2 border-gray-800 relative overflow-hidden" style={{boxShadow: '10px 10px 0px 0px #22c55e'}}>
            <div className="absolute top-4 right-4 w-16 h-16 opacity-15">
              <DivContainer />
            </div>
            <CardContent className="p-8 text-center relative z-10">
              <Sun className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <p className="text-gray-600 text-lg font-medium">Good conditions for farming activities</p>
              <p className="text-gray-500 text-sm mt-2">कृषि गतिविधियों के लिए अच्छी स्थिति</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFarmingRecommendations().map((rec, index) => (
              <Card key={index} className={`border-2 shadow-lg transition-all duration-200 hover:scale-105 ${rec.color} relative overflow-hidden`} style={{boxShadow: '8px 8px 0px 0px #323232'}}>
                <div className="absolute top-2 right-2 w-10 h-6 opacity-20">
                  <DivTooltipContainer />
                </div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/80 p-2 rounded-xl">
                      {rec.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-base">{rec.title}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{rec.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add Figma Button for more recommendations */}
            <Card className="border-2 border-dashed border-gray-300 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-32 mx-auto mb-4">
                  <FigmaButton />
                </div>
                <p className="text-gray-600 text-sm">
                  More Recommendations | और सुझाव
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}