import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  MapPin,
  Calendar,
  Search,
  Filter,
  ExternalLink,
  Bell,
  Award,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import DivTooltipContainer from '../imports/DivTooltipContainer';
import DivContainer from '../imports/DivContainer';
import DivCard from '../imports/DivCard';
import FigmaButton from '../imports/Button';

export function MarketModule({ language }: { language?: string }) {
  // activeTab controls which view is visually active; both "prices" and "schemes" behave like buttons
  const [activeTab, setActiveTab] = useState<'prices' | 'schemes'>('prices');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(false);

  const translations: any = {
    english: {
      title: 'Market Intelligence',
      subtitle: 'Real-time crop prices, market trends, and government schemes',
      searchCrops: 'Search crops...',
      allMarkets: 'All Markets',
      weeklyTrend: 'Weekly Trend',
      monthlyTrend: 'Monthly Trend',
      viewHistory: 'View History',
      learnMore: 'Learn More',
      apply: 'Apply Now',
      benefits: 'Benefits',
      eligibility: 'Eligibility',
      deadline: 'Deadline',
      noData: 'No data available',
      goodTime: 'Good time to sell',
      holdRecommended: 'Hold recommended',
      sellSoon: 'Sell soon',
      highDemand: 'High Demand',
      moderateDemand: 'Moderate Demand',
      lowDemand: 'Low Demand'
    },
    hindi: {
      title: 'बाजार बुद्धि',
      subtitle: 'वास्तविक समय की फसल कीमतें, बाजार के रुझान, और सरकारी योजनाएं',
      searchCrops: 'फसलें खोजें...',
      allMarkets: 'सभी बाजार',
      weeklyTrend: 'साप्ताहिक रुझान',
      monthlyTrend: 'मासिक रुझान',
      viewHistory: 'इतिहास देखें',
      learnMore: 'और जानें',
      apply: 'अभी आवेदन करें',
      benefits: 'लाभ',
      eligibility: 'पात्रता',
      deadline: 'अंतिम तिथि',
      noData: 'कोई डेटा उपलब्ध नहीं',
      goodTime: 'बेचने का अच्छा समय',
      holdRecommended: 'रखने की सिफारिश',
      sellSoon: 'जल्दी बेचें',
      highDemand: 'उच्च मांग',
      moderateDemand: 'मध्यम मांग',
      lowDemand: 'कम मांग'
    }
  };

  const t = translations[language] || translations.english;

  const cropCategories = [
    { id: 'cereals', name: 'Cereals', nameHindi: 'अनाज', icon: '🌾', count: 12 },
    { id: 'vegetables', name: 'Vegetables', nameHindi: 'सब्जियां', icon: '🥕', count: 25 },
    { id: 'fruits', name: 'Fruits', nameHindi: 'फल', icon: '🍎', count: 18 },
    { id: 'pulses', name: 'Pulses', nameHindi: 'दालें', icon: '🫘', count: 8 },
    { id: 'oilseeds', name: 'Oilseeds', nameHindi: 'तिलहन', icon: '🌻', count: 6 },
    { id: 'spices', name: 'Spices', nameHindi: 'मसाले', icon: '🌶️', count: 15 }
  ];

  const mockMarketData = [
    {
      id: 1,
      crop: 'Wheat',
      cropHindi: 'गेहूं',
      category: 'cereals',
      currentPrice: 2350,
      change24h: 2.5,
      weeklyTrend: 'up',
      monthlyTrend: 'up',
      demand: 'high',
      supply: 'moderate',
      market: 'Delhi Mandi',
      marketHindi: 'दिल्ली मंडी',
      recommendation: 'good-time',
      unit: '₹/quintal'
    },
    {
      id: 2,
      crop: 'Rice',
      cropHindi: 'चावल',
      category: 'cereals',
      currentPrice: 3200,
      change24h: -1.2,
      weeklyTrend: 'down',
      monthlyTrend: 'up',
      demand: 'moderate',
      supply: 'high',
      market: 'Punjab Mandi',
      marketHindi: 'पंजाब मंडी',
      recommendation: 'hold',
      unit: '₹/quintal'
    },
    {
      id: 3,
      crop: 'Tomato',
      cropHindi: 'टमाटर',
      category: 'vegetables',
      currentPrice: 4500,
      change24h: 15.8,
      weeklyTrend: 'up',
      monthlyTrend: 'up',
      demand: 'high',
      supply: 'low',
      market: 'Mumbai APMC',
      marketHindi: 'मुंबई APMC',
      recommendation: 'good-time',
      unit: '₹/quintal'
    },
    {
      id: 4,
      crop: 'Onion',
      cropHindi: 'प्याज',
      category: 'vegetables',
      currentPrice: 2800,
      change24h: -5.2,
      weeklyTrend: 'down',
      monthlyTrend: 'down',
      demand: 'low',
      supply: 'high',
      market: 'Nashik Mandi',
      marketHindi: 'नासिक मंडी',
      recommendation: 'sell-soon',
      unit: '₹/quintal'
    },
    {
      id: 5,
      crop: 'Cotton',
      cropHindi: 'कपास',
      category: 'cash-crops',
      currentPrice: 6200,
      change24h: 0.8,
      weeklyTrend: 'stable',
      monthlyTrend: 'up',
      demand: 'moderate',
      supply: 'moderate',
      market: 'Gujarat Cotton Market',
      marketHindi: 'गुजरात कपास बाजार',
      recommendation: 'hold',
      unit: '₹/quintal'
    },
    {
      id: 6,
      crop: 'Sugarcane',
      cropHindi: 'गन्ना',
      category: 'cash-crops',
      currentPrice: 350,
      change24h: 1.5,
      weeklyTrend: 'up',
      monthlyTrend: 'stable',
      demand: 'high',
      supply: 'moderate',
      market: 'UP Sugar Mills',
      marketHindi: 'यूपी चीनी मिल',
      recommendation: 'good-time',
      unit: '₹/quintal'
    }
  ];

  const govtSchemes = [
    {
      id: 1,
      name: 'PM-KISAN Scheme',
      nameHindi: 'PM-किसान योजना',
      description: 'Direct income support to farmer families',
      descriptionHindi: 'किसान परिवारों को प्रत्यक्‍य आय सहायता',
      benefits: '₹6000 per year in 3 installments',
      benefitsHindi: '3 किश्तों में प्रति वर्ष ₹6000',
      eligibility: 'All landholding farmer families',
      eligibilityHindi: 'सभी भूमिधारक किसान परिवार',
      deadline: '2024-12-31',
      status: 'active',
      category: 'income-support'
    },
    {
      id: 2,
      name: 'Crop Insurance Scheme',
      nameHindi: 'फसल बीमा योजना',
      description: 'Insurance coverage for crop loss due to natural calamities',
      descriptionHindi: 'प्राकृतिक आपदाओं के कारण फसल हानि के लिए बीमा कवरेज',
      benefits: 'Up to 90% premium subsidy',
      benefitsHindi: '90% तक प्रीमियम सब्सिडी',
      eligibility: 'All farmers growing notified crops',
      eligibilityHindi: 'अधिसूचित फसलें उगाने वाले सभी किसान',
      deadline: '2024-06-30',
      status: 'active',
      category: 'insurance'
    },
    {
      id: 3,
      name: 'Soil Health Card Scheme',
      nameHindi: 'मृदा स्वास्थ्य कार्ड योजना',
      description: 'Free soil testing and nutrient recommendations',
      descriptionHindi: 'मुफ्त मिट्टी परीक्षण और पोषक तत्व सिफारिशें',
      benefits: 'Free soil testing every 3 years',
      benefitsHindi: 'हर 3 साल में मुफ्त मिट्टी परीक्षण',
      eligibility: 'All farmers with agricultural land',
      eligibilityHindi: 'कृषि भूमि वाले सभी किसान',
      deadline: 'Ongoing',
      status: 'active',
      category: 'soil-health'
    }
  ];

  useEffect(() => {
    loadMarketData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMarketData = async () => {
    setMarketData(mockMarketData); // show mock immediately
    setLoadingMarket(true);

    try {
      // try to import supabase info if available (keeps your previous flow)
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-5d78fdfd`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(`${baseUrl}/market/prices`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const marketPrices = await response.json();
        // convert to component format (best-effort mapping)
        const formattedData = marketPrices.map((crop: any, index: number) => ({
          id: index + 1,
          crop: crop.name,
          cropHindi: getHindiCropName(crop.name),
          category: getCropCategory(crop.name),
          currentPrice: crop.price,
          change24h: parseFloat(String(crop.change).replace('%', '').replace('+', '')) || 0,
          weeklyTrend: crop.trend || 'stable',
          monthlyTrend: crop.trend || 'stable',
          demand: getDemandLevel(crop.trend),
          supply: 'moderate',
          market: crop.market || 'National Average',
          marketHindi: 'राष्ट्रीय औसत',
          recommendation: getRecommendation(crop.trend),
          unit: crop.unit || '₹/quintal'
        }));
        setMarketData(formattedData);
      } else {
        // keep mock data if API fails
        const errTxt = await response.text();
        console.warn('Market API returned', response.status, errTxt);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.warn('Market API timed out, using mock data');
      } else {
        console.warn('Market API unavailable, using mock data', err);
      }
    } finally {
      setLoadingMarket(false);
    }
  };

  const getHindiCropName = (cropName: string) => {
    const cropMap: Record<string, string> = {
      'Wheat': 'गेहूं',
      'Rice': 'चावल',
      'Corn': 'मक्का',
      'Soybeans': 'सोयाबीन',
      'Cotton': 'कपास',
      'Sugarcane': 'गन्ना',
      'Tomato': 'टमाटर',
      'Onion': 'प्याज',
      'Potato': 'आलू'
    };
    return cropMap[cropName] || cropName;
  };

  const getCropCategory = (cropName: string) => {
    const cereals = ['Wheat', 'Rice', 'Corn'];
    const vegetables = ['Tomato', 'Onion', 'Potato'];
    const cashCrops = ['Cotton', 'Sugarcane'];

    if (cereals.includes(cropName)) return 'cereals';
    if (vegetables.includes(cropName)) return 'vegetables';
    if (cashCrops.includes(cropName)) return 'cash-crops';
    return 'others';
  };

  const getDemandLevel = (trend: string) => {
    if (trend === 'up') return 'high';
    if (trend === 'down') return 'low';
    return 'moderate';
  };

  const getRecommendation = (trend: string) => {
    if (trend === 'up') return 'good-time';
    if (trend === 'down') return 'sell-soon';
    return 'hold';
  };

  const filteredMarketData = marketData.filter(item => {
    const matchesSearch = (language === 'hindi' ? item.cropHindi : item.crop)
      .toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCrop === 'all' || item.category === selectedCrop;
    const matchesMarket = selectedMarket === 'all' || item.market === selectedMarket;

    return matchesSearch && matchesCategory && matchesMarket;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'good-time': return 'bg-green-100 text-green-800 border-green-200';
      case 'hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sell-soon': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'good-time': return t.goodTime;
      case 'hold': return t.holdRecommended;
      case 'sell-soon': return t.sellSoon;
      default: return 'No recommendation';
    }
  };

  // When user clicks schemes, open external site and set active tab (makes button green)
  const handleSchemesClick = () => {
    setActiveTab('schemes');
    window.open('https://agriwelfare.gov.in/en/Recent', '_blank', 'noopener');
  };

  return (
    <div className="space-y-8 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-6 w-20 h-12 opacity-8 hidden lg:block">
        <DivTooltipContainer />
      </div>
      <div className="absolute top-40 left-4 w-28 h-28 opacity-6 rotate-45 hidden lg:block">
        <DivContainer />
      </div>
      <div className="absolute bottom-32 right-12 w-24 h-24 opacity-5 -rotate-12 hidden lg:block">
        <DivContainer />
      </div>

      {/* Header */}
      <div className="text-center relative z-10">
        <h2 className="text-green-800 mb-2">Market Intelligence | बाजार सूचना</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real-time crop prices, market trends, and government schemes |
          वास्तविक समय की फसल कीमतें, बाजार के रुझान और सरकारी योजनाएं
        </p>
      </div>

      {/* Centered Buttons: Prices & Schemes */}
      <div className="relative z-10">
        <div className="flex justify-center">
          <div
            className="flex gap-4 bg-white shadow-xl border-2 border-gray-800 rounded-2xl p-2 w-fit mx-auto"
            style={{ boxShadow: '8px 8px 0px 0px #323232' }}
          >
            {/* Prices Button */}
            <button
              onClick={() => setActiveTab('prices')}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 font-semibold text-xs transition-all duration-150 ${
                activeTab === 'prices'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 hover:bg-green-100 text-gray-700'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Prices | मूल्य</span>
            </button>

            {/* Schemes Button */}
            <button
              onClick={handleSchemesClick}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 font-semibold text-xs transition-all duration-150 ${
                activeTab === 'schemes'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 hover:bg-green-100 text-gray-700'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Schemes | योजनाएं</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content area: show either Prices view (default) or Schemes view (user can still see schemes inside app) */}
      <div className="relative z-10">
        {activeTab === 'prices' && (
          <>
            {/* Search & Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={t.searchCrops}
                        value={searchTerm}
                        onChange={(e: any) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={selectedCrop} onValueChange={(v: any) => setSelectedCrop(v)}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {cropCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {language === 'hindi' ? cat.nameHindi : cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedMarket} onValueChange={(v: any) => setSelectedMarket(v)}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder={t.allMarkets} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allMarkets}</SelectItem>
                      <SelectItem value="Delhi Mandi">Delhi Mandi</SelectItem>
                      <SelectItem value="Punjab Mandi">Punjab Mandi</SelectItem>
                      <SelectItem value="Mumbai APMC">Mumbai APMC</SelectItem>
                      <SelectItem value="Nashik Mandi">Nashik Mandi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Live Prices */}
            {loadingMarket && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Loading market data...</p>
                </CardContent>
              </Card>
            )}

            {filteredMarketData.length === 0 && !loadingMarket ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t.noData}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarketData.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {language === 'hindi' ? item.cropHindi : item.crop}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{language === 'hindi' ? item.marketHindi : item.market}</span>
                          </CardDescription>
                        </div>
                        <Badge className={getDemandColor(item.demand)}>
                          {item.demand === 'high' ? t.highDemand : item.demand === 'moderate' ? t.moderateDemand : t.lowDemand}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Price */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">
                          ₹{Number(item.currentPrice).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">{item.unit}</div>
                        <div className={`flex items-center justify-center space-x-1 mt-2 ${item.change24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.change24h > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          <span className="font-medium">{item.change24h > 0 ? '+' : ''}{item.change24h}%</span>
                          <span className="text-xs text-gray-500">24h</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Trends */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">{t.weeklyTrend}</div>
                          <div className="flex items-center justify-center mt-1">{getTrendIcon(item.weeklyTrend)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">{t.monthlyTrend}</div>
                          <div className="flex items-center justify-center mt-1">{getTrendIcon(item.monthlyTrend)}</div>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className={`p-3 rounded-lg border ${getRecommendationColor(item.recommendation)}`}>
                        <div className="text-sm font-medium text-center">
                          {getRecommendationText(item.recommendation)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          {t.viewHistory}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'schemes' && (
          <>
            {/* Schemes list inside app in case user wants to view; clicking scheme buttons can still open links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {govtSchemes.map((scheme) => (
                <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {language === 'hindi' ? scheme.nameHindi : scheme.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {language === 'hindi' ? scheme.descriptionHindi : scheme.description}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{scheme.status}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-1">{t.benefits}</h4>
                      <p className="text-sm text-gray-600">{language === 'hindi' ? scheme.benefitsHindi : scheme.benefits}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-1">{t.eligibility}</h4>
                      <p className="text-sm text-gray-600">{language === 'hindi' ? scheme.eligibilityHindi : scheme.eligibility}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t.deadline}:</span>
                      <span className="font-medium">{scheme.deadline}</span>
                    </div>

                    <Separator />

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // if you have a scheme-specific url you can open it; currently opens central schemes portal
                          window.open('https://agriwelfare.gov.in/en/Recent', '_blank', 'noopener');
                        }}
                      >
                        {t.apply}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open('https://agriwelfare.gov.in/en/Recent', '_blank', 'noopener')}>
                        {t.learnMore}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Application Status */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <span>Application Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">PM-KISAN Application</span>
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  </div>
                  <Progress value={100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Crop Insurance Application</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
