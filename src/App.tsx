import React, { useState, useEffect } from "react";
import {
  Camera,
  Upload,
  Database,
  Search,
  Eye,
  BarChart3,
  Book,
  Globe,
  Cloud,
  Droplets,
  DollarSign,
  MessageCircle,
  Mic,
  Volume2,
  ChevronRight,
  Leaf,
  Bug,
  Award,
  TrendingUp,
  MapPin,
  Calendar,
  Thermometer,
  CloudRain,
  Sun,
  Wind,
  Menu,
  X,
  Bell,
  User,
  Settings,
} from "lucide-react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Progress } from "./components/ui/progress";
import { Separator } from "./components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { DiseaseDetection } from "./components/DiseaseDetection";
import { DiseaseReporting } from "./components/DiseaseReporting";
import { LearningModule } from "./components/LearningModule";
import { WeatherModule } from "./components/WeatherModule";
import { IrrigationModule } from "./components/IrrigationModule";
import { MarketModule } from "./components/MarketModule";
import { ChatModule } from "./components/ChatModule";
import { Dashboard } from "./components/Dashboard";
import { ModernDashboard } from "./components/ModernDashboard";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import DivTooltipContainer from "./imports/DivTooltipContainer";
import DivContainer from "./imports/DivContainer";
import DivCard from "./imports/DivCard";
import FigmaButton from "./imports/Button";

export default function App() {
  const [activeModule, setActiveModule] = useState("home");
  const [language, setLanguage] = useState("english");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'working', 'fallback', 'unknown'

  // Bilingual labels - English with Hindi
  const bilingualLabels = {
    title: "FarmWise | फार्मवाइज",
    subtitle: "AI-Powered Farming Assistant | एआई-संचालित कृषि सहायक",
    diseaseDetection: "Disease Detection | रोग पहचान",
    reporting: "Disease Reports | रोग रिपोर्ट",
    learning: "Learn & Grow | सीखें और बढ़ें",
    weather: "Weather Insights | मौसम जानकारी",
    irrigation: "Smart Irrigation | स्मार्ट सिंचाई",
    market: "Market Intelligence | बाजार सूचना",
    chat: "AI Assistant | एआई सहायक",
    home: "Dashboard | डैशबोर्ड",
    profile: "Profile | प्रोफ़ाइल",
    settings: "Settings | सेटिंग्स",
    notifications: "Notifications | सूचनाएं",
    modules: "Modules | मॉड्यूल",
    // Mobile-specific shorter labels
    mobileHome: "Home | होम",
    mobileWeather: "Weather | मौसम", 
    mobileDisease: "Disease | रोग",
    mobileChat: "AI Chat | चैट",
  };

  const t = bilingualLabels;

  // Check API status on app load
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const { projectId, publicAnonKey } = await import('./utils/supabase/info');
        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-5d78fdfd`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${baseUrl}/weather/current`, {
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setApiStatus('working');
          toast.success('Connected to live APIs!');
        } else {
          setApiStatus('fallback');
          toast.info('Using demo data - APIs unavailable');
        }
      } catch (error) {
        setApiStatus('fallback');
        console.log('APIs unavailable, running in demo mode');
        toast.info('Running in demo mode with sample data');
      }
    };
    
    checkApiStatus();
  }, []);

  const modules = [
    {
      id: "disease",
      icon: Bug,
      label: t.diseaseDetection,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      id: "reporting",
      icon: Database,
      label: t.reporting,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      id: "learning",
      icon: Book,
      label: t.learning,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      id: "weather",
      icon: Cloud,
      label: t.weather,
      color: "from-sky-500 to-sky-600",
      bgColor: "bg-sky-50",
      textColor: "text-sky-700",
    },
    {
      id: "irrigation",
      icon: Droplets,
      label: t.irrigation,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
    },
    {
      id: "market",
      icon: DollarSign,
      label: t.market,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      id: "chat",
      icon: MessageCircle,
      label: t.chat,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case "disease":
        return <DiseaseDetection language={language} />;
      case "reporting":
        return <DiseaseReporting language={language} />;
      case "learning":
        return <LearningModule language={language} />;
      case "weather":
        return <WeatherModule language={language} />;
      case "irrigation":
        return <IrrigationModule language={language} />;
      case "market":
        return <MarketModule language={language} />;
      case "chat":
        return <ChatModule language={language} />;
      default:
        return <ModernDashboard language={language} />;
    }
  };

  const MobileHeader = () => (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100 lg:hidden relative overflow-hidden">
      {/* Decorative leaf elements */}
      <div className="absolute top-2 right-20 w-16 h-10 opacity-20">
        <DivTooltipContainer />
      </div>
      <div className="absolute top-4 right-32 w-12 h-8 opacity-15 rotate-45">
        <DivTooltipContainer />
      </div>
      
      <div className="px-6 relative z-10">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-3 rounded-2xl shadow-lg relative">
              <div className="absolute inset-0 w-8 h-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
                <DivContainer />
              </div>
              <Leaf className="h-7 w-7 text-white drop-shadow-sm relative z-10" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                FarmWise
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                फार्मवाइज़
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-700" />
            </Button>

            <Sheet
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            >
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center space-x-3 text-xl">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-xl">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-900">FarmWise</span>
                  </SheetTitle>
                  <SheetDescription className="text-gray-600 font-medium">
                    AI-Powered Farming Assistant | एआई-संचालित कृषि सहायक
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-8 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      {t.modules}
                    </h3>
                    <div className="space-y-2">
                      {modules.map((module) => {
                        const Icon = module.icon;
                        return (
                          <Button
                            key={module.id}
                            variant={
                              activeModule === module.id
                                ? "default"
                                : "ghost"
                            }
                            onClick={() => {
                              setActiveModule(module.id);
                              setMobileMenuOpen(false);
                              toast.success(
                                `${module.label.split(' | ')[0]} module loaded!`,
                              );
                            }}
                            className={`w-full justify-start h-12 rounded-xl font-medium ${
                              activeModule === module.id 
                                ? `bg-gradient-to-r ${module.color} text-white shadow-lg` 
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <Icon className="h-5 w-5 mr-4" />
                            <div className="text-left">
                              <div className="text-sm font-medium">{module.label.split(' | ')[0]}</div>
                              <div className="text-xs opacity-80">{module.label.split(' | ')[1]}</div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Settings | सेटिंग्स
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 rounded-xl hover:bg-gray-50"
                      >
                        <User className="h-5 w-5 mr-4 text-gray-600" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">Profile</div>
                          <div className="text-xs text-gray-600">प्रोफ़ाइल</div>
                        </div>
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 rounded-xl hover:bg-gray-50"
                      >
                        <Settings className="h-5 w-5 mr-4 text-gray-600" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">Settings</div>
                          <div className="text-xs text-gray-600">सेटिंग्स</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );

  const DesktopHeader = () => (
    <header className="hidden lg:block bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-4 right-40 w-20 h-12 opacity-10">
        <DivTooltipContainer />
      </div>
      <div className="absolute top-2 right-60 w-16 h-10 opacity-15 rotate-12">
        <DivTooltipContainer />
      </div>
      <div className="absolute top-6 right-80 w-24 h-15 opacity-8 -rotate-12">
        <DivTooltipContainer />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-3 rounded-2xl shadow-lg relative">
              <div className="absolute inset-0 w-12 h-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-25">
                <DivContainer />
              </div>
              <Leaf className="h-10 w-10 text-white drop-shadow-sm relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                FarmWise
              </h1>
              <p className="text-base text-gray-600 font-medium">
                AI-Powered Farming Assistant | एआई-संचालित कृषि सहायक
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Button
              variant={
                activeModule === "home" ? "default" : "outline"
              }
              onClick={() => {
                setActiveModule("home");
                toast.success("Dashboard loaded successfully!");
              }}
              className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                activeModule === "home"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl scale-105"
                  : "border-2 border-gray-200 hover:border-green-300 hover:bg-green-50"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm font-semibold">Dashboard</div>
                <div className="text-xs opacity-80">डैशबोर्ड</div>
              </div>
            </Button>
            
            {/* API Status Indicator */}
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-2xl">
              <div className={`w-3 h-3 rounded-full ${
                apiStatus === 'working' ? 'bg-green-500 animate-pulse' : 
                apiStatus === 'fallback' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}></div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">
                  {apiStatus === 'working' ? 'Live Data' : 
                   apiStatus === 'fallback' ? 'Demo Mode' : 'Loading...'}
                </div>
                <div className="text-xs text-gray-600">
                  {apiStatus === 'working' ? 'लाइव डेटा' : 
                   apiStatus === 'fallback' ? 'डेमो मोड' : 'लोड हो रहा...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  const DesktopNavigation = () => (
    <nav className="hidden lg:block bg-gray-50/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex space-x-2 py-4 overflow-x-auto">
          {modules.map((module) => {
            const Icon = module.icon;
            const [englishLabel, hindiLabel] = module.label.split(' | ');
            return (
              <Button
                key={module.id}
                variant="ghost"
                onClick={() => {
                  setActiveModule(module.id);
                  toast.success(
                    `${englishLabel} module activated!`,
                  );
                }}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl whitespace-nowrap transition-all duration-200 ${
                  activeModule === module.id
                    ? `bg-gradient-to-r ${module.color} text-white shadow-lg hover:shadow-xl scale-105`
                    : "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md"
                }`}
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-sm font-semibold">{englishLabel}</div>
                  <div className="text-xs opacity-80">{hindiLabel}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );

  const MobileBottomNavigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 lg:hidden z-40 shadow-2xl">
      <div className="safe-area-pb-2">
        <div className="grid grid-cols-4 py-2 px-4">
          <Button
            variant="ghost"
            onClick={() => {
              setActiveModule("home");
              toast.success("Dashboard opened!");
            }}
            className={`flex flex-col items-center justify-center h-16 rounded-2xl transition-all duration-200 ${
              activeModule === "home"
                ? "text-green-600 bg-green-50 scale-105 shadow-lg"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className={`p-1.5 rounded-xl mb-1 ${
              activeModule === "home" 
                ? "bg-green-100" 
                : ""
            }`}>
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold leading-tight">Home</div>
              <div className="text-[10px] opacity-80 leading-tight">होम</div>
            </div>
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setActiveModule("weather");
              toast.success("Weather module opened!");
            }}
            className={`flex flex-col items-center justify-center h-16 rounded-2xl transition-all duration-200 ${
              activeModule === "weather"
                ? "text-sky-600 bg-sky-50 scale-105 shadow-lg"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className={`p-1.5 rounded-xl mb-1 ${
              activeModule === "weather" 
                ? "bg-sky-100" 
                : ""
            }`}>
              <Cloud className="h-5 w-5" />
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold leading-tight">Weather</div>
              <div className="text-[10px] opacity-80 leading-tight">मौसम</div>
            </div>
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setActiveModule("disease");
              toast.success("Disease detection opened!");
            }}
            className={`flex flex-col items-center justify-center h-16 rounded-2xl transition-all duration-200 ${
              activeModule === "disease"
                ? "text-red-600 bg-red-50 scale-105 shadow-lg"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className={`p-1.5 rounded-xl mb-1 ${
              activeModule === "disease" 
                ? "bg-red-100" 
                : ""
            }`}>
              <Bug className="h-5 w-5" />
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold leading-tight">Disease</div>
              <div className="text-[10px] opacity-80 leading-tight">रोग</div>
            </div>
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setActiveModule("chat");
              toast.success("AI Assistant opened!");
            }}
            className={`flex flex-col items-center justify-center h-16 rounded-2xl transition-all duration-200 ${
              activeModule === "chat"
                ? "text-purple-600 bg-purple-50 scale-105 shadow-lg"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className={`p-1.5 rounded-xl mb-1 ${
              activeModule === "chat" 
                ? "bg-purple-100" 
                : ""
            }`}>
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold leading-tight">AI Chat</div>
              <div className="text-[10px] opacity-80 leading-tight">चैट</div>
            </div>
          </Button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <MobileHeader />
      <DesktopHeader />
      <DesktopNavigation />

      {/* Main Content */}
      <main className="pb-24 lg:pb-12 relative">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 opacity-5 -rotate-12 hidden lg:block">
          <DivContainer />
        </div>
        <div className="absolute top-40 right-16 w-24 h-24 opacity-8 rotate-45 hidden lg:block">
          <DivContainer />
        </div>
        <div className="absolute bottom-32 left-20 w-28 h-28 opacity-6 rotate-12 hidden lg:block">
          <DivContainer />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative z-10">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-xl border border-white/50 relative overflow-hidden">
            {/* Subtle decorative leaf in content area */}
            <div className="absolute top-4 right-6 w-12 h-8 opacity-10">
              <DivTooltipContainer />
            </div>
            
            {/* Welcome section for home module */}
            {activeModule === "home" && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                  {/* Farm Statistics Cards using Figma component */}
                  <div className="h-32">
                    <DivCard />
                  </div>
                  
                  {/* Custom cards with bilingual content */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-800 relative" style={{boxShadow: '8px 8px 0px 0px #323232'}}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 rounded-full p-2">
                          <Droplets className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Water Usage</p>
                          <p className="text-xs text-gray-500">जल उपयोग</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-semibold">15%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800 mb-2">2,450L</p>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-800 relative" style={{boxShadow: '8px 8px 0px 0px #323232'}}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-yellow-500 rounded-full p-2">
                          <Sun className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Crop Health</p>
                          <p className="text-xs text-gray-500">फसल स्वास्थ्य</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-green-600">
                        <Award className="h-4 w-4" />
                        <span className="text-sm font-semibold">98%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800 mb-2">Excellent</p>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '98%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-800 relative" style={{boxShadow: '8px 8px 0px 0px #323232'}}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-500 rounded-full p-2">
                          <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Yield Forecast</p>
                          <p className="text-xs text-gray-500">उत्पादन पूर्वानुमान</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-purple-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-semibold">8%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800 mb-2">12.5T</p>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Welcome Message with Tree Illustration */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
                    <DivContainer />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Welcome to FarmWise | FarmWise में आपका स्वागत है
                    </h2>
                    <p className="text-gray-700 text-lg mb-6">
                      Your AI-powered farming companion for smarter agriculture and better yields.
                    </p>
                    <p className="text-gray-600 mb-6">
                      स्मार्ट कृषि और बेहतर उत्पादन के लिए आपका एआई-संचालित कृषि साथी।
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">
                        AI Disease Detection | एआई रोग पहचान
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
                        Weather Insights | मौसम जानकारी
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">
                        Smart Irrigation | स्मार्ट सिंचाई
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {renderModule()}
          </div>
        </div>
      </main>

      <MobileBottomNavigation />

      {/* Footer - Desktop Only */}
      <footer className="hidden lg:block bg-gradient-to-r from-green-800 via-emerald-800 to-teal-800 text-white py-12 mt-20 relative overflow-hidden">
        {/* Decorative plant illustrations */}
        <div className="absolute top-0 left-10 w-32 h-32 opacity-10">
          <DivContainer />
        </div>
        <div className="absolute bottom-0 right-20 w-28 h-28 opacity-15 rotate-12">
          <DivContainer />
        </div>
        <div className="absolute top-4 right-60 w-20 h-12 opacity-20">
          <DivTooltipContainer />
        </div>
        <div className="absolute bottom-2 left-40 w-16 h-10 opacity-25 rotate-45">
          <DivTooltipContainer />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="bg-white/20 p-3 rounded-2xl relative">
                <div className="absolute inset-0 w-8 h-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-40">
                  <DivContainer />
                </div>
                <Leaf className="h-8 w-8 text-white relative z-10" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">FarmWise</div>
                <div className="text-sm opacity-90">फार्मवाइज़</div>
              </div>
            </div>
            <p className="text-green-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Empowering farmers with AI-driven insights for sustainable agriculture
            </p>
            <p className="text-green-200 text-sm mt-2">
              टिकाऊ कृषि के लिए एआई-संचालित अंतर्दृष्टि के साथ किसानों को सशक्त बनाना
            </p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}