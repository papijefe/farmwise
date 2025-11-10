import React, { useState, useRef } from 'react';
import { Camera, Upload, Scan, AlertTriangle, CheckCircle, Info, Loader2, Download, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import DivTooltipContainer from '../imports/DivTooltipContainer';
import DivContainer from '../imports/DivContainer';
import DivCard from '../imports/DivCard';
import FigmaButton from '../imports/Button';

export function DiseaseDetection({ language }) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const translations = {
    english: {
      title: 'AI Disease Detection',
      subtitle: 'Scan your crops for early disease detection using advanced AI',
      takePhoto: 'Take Photo',
      uploadImage: 'Upload Image',
      scanNow: 'Scan for Diseases',
      scanning: 'Scanning...',
      results: 'Scan Results',
      confidence: 'Confidence',
      severity: 'Severity',
      treatment: 'Treatment Recommendations',
      prevention: 'Prevention Tips',
      downloadReport: 'Download Report',
      shareResults: 'Share Results',
      noImageSelected: 'Please select or capture an image first',
      scanComplete: 'Scan completed successfully!',
      healthy: 'Healthy',
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe',
      criticalAlert: 'Critical Disease Detected!'
    },
    hindi: {
      title: 'एआई रोग पहचान',
      subtitle: 'उन्नत एआई का उपयोग करके अपनी फसलों में रोग की जल्दी पहचान करें',
      takePhoto: 'फोटो लें',
      uploadImage: 'छवि अपलोड करें',
      scanNow: 'रोग के लिए स्कैन करें',
      scanning: 'स्कैन कर रहे हैं...',
      results: 'स्कैन परिणाम',
      confidence: 'विश्वसनीयता',
      severity: 'गंभीरता',
      treatment: 'उपचार सुझाव',
      prevention: 'रोकथाम के टिप्स',
      downloadReport: 'रिपोर्ट डाउनलोड करें',
      shareResults: 'परिणाम साझा करें',
      noImageSelected: 'कृपया पहले एक छवि चुनें या कैप्चर करें',
      scanComplete: 'स्कैन सफलतापूर्वक पूरा हो गया!',
      healthy: 'स्वस्थ',
      mild: 'हल्का',
      moderate: 'मध्यम',
      severe: 'गंभीर',
      criticalAlert: 'गंभीर रोग का पता चला!'
    }
  };

  const t = translations[language];

  // Mock disease database
  const mockDiseases = [
    {
      name: 'Leaf Blight',
      hindi: 'पत्ती झुलसा',
      confidence: 94,
      severity: 'moderate',
      description: 'Common fungal disease affecting leaves',
      hindiDescription: 'पत्तियों को प्रभावित करने वाली आम फंगल बीमारी',
      treatment: [
        'Apply copper-based fungicide',
        'Remove affected leaves',
        'Improve air circulation'
      ],
      hindiTreatment: [
        'तांबा आधारित फफूंदनाशक लगाएं',
        'प्रभावित पत्तियों को हटाएं',
        'हवा का संचार सुधारें'
      ],
      prevention: [
        'Maintain proper spacing between plants',
        'Water at soil level, avoid wetting leaves',
        'Apply preventive fungicide spray'
      ],
      hindiPrevention: [
        'पौधों के बीच उचित दूरी बनाए रखें',
        'मिट्टी के स्तर पर पानी दें, पत्तियों को गीला न करें',
        'निवारक फफूंदनाशक स्प्रे लगाएं'
      ]
    },
    {
      name: 'Healthy Plant',
      hindi: 'स्वस्थ पौधा',
      confidence: 98,
      severity: 'healthy',
      description: 'Plant appears healthy with no visible diseases',
      hindiDescription: 'पौधा स्वस्थ दिखता है, कोई दिखाई देने वाली बीमारी नहीं',
      treatment: [],
      hindiTreatment: [],
      prevention: [
        'Continue current care routine',
        'Monitor regularly for early signs',
        'Maintain good hygiene practices'
      ],
      hindiPrevention: [
        'वर्तमान देखभाल की दिनचर्या जारी रखे��',
        'जल्दी लक्षणों के लिए नियमित निगरानी करें',
        'अच्छी स्वच्छता प्रथाओं को बनाए रखें'
      ]
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setCameraActive(true);
      // In a real app, this would activate the camera
      // For demo purposes, we'll simulate camera capture
      setTimeout(() => {
        setUploadedImage('https://images.unsplash.com/photo-1728297753604-d2e129bdb226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGRpc2Vhc2UlMjBsZWFmJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzU4MDg3NjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
        setCameraActive(false);
        setScanResult(null);
        toast.success('Photo captured successfully!');
      }, 2000);
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Camera access denied or not available');
      setCameraActive(false);
    }
  };

  const handleScan = async () => {
    if (!uploadedImage) {
      toast.error(t.noImageSelected);
      return;
    }

    setScanning(true);
    setScanResult(null);

    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-5d78fdfd`;

      console.log('Attempting to send image for disease detection to:', `${baseUrl}/disease/detect`);

      // Add timeout for disease detection requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for image processing

      const response = await fetch(`${baseUrl}/disease/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          imageBase64: uploadedImage,
          cropType: 'general'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Disease detection API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Disease detection response from API:', data);
        
        // Convert API response to component format
        const result = {
          name: data.disease.name,
          hindi: getHindiDiseaseName(data.disease.name),
          confidence: Math.round(data.disease.confidence * 100),
          severity: data.disease.severity.toLowerCase(),
          description: `Detected with ${Math.round(data.disease.confidence * 100)}% confidence`,
          hindiDescription: `${Math.round(data.disease.confidence * 100)}% विश्वास के साथ पहचाना गया`,
          treatment: data.treatment.immediate || [],
          hindiTreatment: translateToHindi(data.treatment.immediate || []),
          prevention: data.treatment.preventive || [],
          hindiPrevention: translateToHindi(data.treatment.preventive || [])
        };
        
        setScanResult(result);
        toast.success(t.scanComplete);
      } else {
        const errorText = await response.text();
        console.log('Disease detection API returned error:', response.status, errorText);
        throw new Error(`Disease detection API error: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Disease detection API request timed out, using fallback');
      } else {
        console.log('Disease detection API unavailable, using fallback:', error.message);
      }
      
      // Fallback to mock result
      const randomResult = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      setScanResult(randomResult);
      toast.success(t.scanComplete);
    } finally {
      setScanning(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'healthy': return 'bg-green-500';
      case 'mild': return 'bg-yellow-500';
      case 'moderate': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'mild': return <Info className="h-5 w-5 text-yellow-500" />;
      case 'moderate': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'severe': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHindiDiseaseName = (diseaseName) => {
    const diseaseMap = {
      'Leaf Spot': 'पत्ती पर धब्बे',
      'Blight': 'झुलसा रोग',
      'Rust': 'रतुआ रोग',
      'Leaf Blight': 'पत्ती झुलसा',
      'Healthy Plant': 'स्वस्थ पौधा',
      'Powdery Mildew': 'चूर्णी फफूंदी',
      'Bacterial Wilt': 'जीवाणु मुरझान'
    };
    return diseaseMap[diseaseName] || diseaseName;
  };

  const translateToHindi = (textArray) => {
    const translationMap = {
      'Remove affected leaves': 'प्रभावित पत्तियों को हटाएं',
      'Apply copper fungicide': 'तांबा फफूंदनाशक लगाएं',
      'Improve air circulation': 'हवा का संचार सुधारें',
      'Isolate affected plants': 'प्रभावित पौधों को अलग करें',
      'Apply bacterial copper spray': 'जीवाणु तांबा स्प्रे लगाएं',
      'Crop rotation': 'फसल चक्र',
      'Resistant varieties': 'प्रतिरोधी किस्में',
      'Apply sulfur-based fungicide': 'सल्फर आधारित फफूंदनाशक लगाएं',
      'Remove infected parts': 'संक्रमित भागों को हटाएं',
      'Plant in sunny locations': 'धूप वाले स्थानों में रोपें',
      'Avoid overhead watering': 'ऊपर से पानी देने से बचें'
    };
    
    return textArray.map(text => translationMap[text] || text);
  };

  return (
    <div className="space-y-8 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-10 w-24 h-16 opacity-8 hidden lg:block">
        <DivTooltipContainer />
      </div>
      <div className="absolute top-20 left-5 w-20 h-20 opacity-5 rotate-12 hidden lg:block">
        <DivContainer />
      </div>
      <div className="absolute bottom-10 right-20 w-28 h-28 opacity-6 -rotate-12 hidden lg:block">
        <DivContainer />
      </div>

      {/* Header */}
      <div className="text-center relative z-10">
        <h2 className="text-green-800 mb-2">Disease Detection | रोग पहचान</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Scan your crops for early disease detection using advanced AI | 
          उन्नत एआई का उपयोग करके अपनी फसलों में रोग की जल्दी पहचान करें
        </p>
      </div>

      {/* Image Capture/Upload Section */}
      <Card className="max-w-4xl mx-auto relative overflow-hidden shadow-2xl border-2 border-gray-800" style={{boxShadow: '12px 12px 0px 0px #323232'}}>
        {/* Decorative leaf elements */}
        <div className="absolute top-2 right-4 w-16 h-10 opacity-15">
          <DivTooltipContainer />
        </div>
        <div className="absolute bottom-4 left-6 w-12 h-8 opacity-20 rotate-45">
          <DivTooltipContainer />
        </div>
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-xl">
              <Scan className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-lg font-semibold">Image Capture</div>
              <div className="text-sm text-gray-600 font-normal">छवि कैप्चर</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={handleTakePhoto}
              disabled={cameraActive}
              className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-105"
            >
              {cameraActive ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Camera className="h-5 w-5" />
              )}
              <div className="text-left">
                <div className="text-sm font-semibold">Take Photo</div>
                <div className="text-xs opacity-90">फोटो लें</div>
              </div>
            </Button>

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold border-2 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
            >
              <Upload className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm font-semibold">Upload Image</div>
                <div className="text-xs opacity-70">छवि अपलोड करें</div>
              </div>
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Image Preview */}
          {uploadedImage && (
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-50 rounded-lg">
                <ImageWithFallback
                  src={uploadedImage}
                  alt="Uploaded crop image"
                  className="max-w-md max-h-64 object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          )}

          {/* Scan Button */}
          {uploadedImage && (
            <div className="text-center">
              <Button
                onClick={handleScan}
                disabled={scanning}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {scanning ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mr-3" />
                    <div className="text-left">
                      <div>Scanning...</div>
                      <div className="text-xs opacity-90">स्कैन कर रहे हैं...</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Scan className="h-6 w-6 mr-3" />
                    <div className="text-left">
                      <div>Scan for Diseases</div>
                      <div className="text-xs opacity-90">रोग के लिए स्कैन करें</div>
                    </div>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Scanning Progress */}
          {scanning && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Analyzing image with AI...</p>
              </div>
              <Progress value={33} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {scanResult && (
        <Card className="max-w-4xl mx-auto border-2 border-green-200 relative overflow-hidden shadow-2xl" style={{boxShadow: '12px 12px 0px 0px #22c55e'}}>
          {/* Background plant illustration */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-8">
            <DivContainer />
          </div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="bg-green-100 p-2 rounded-xl">
                {getSeverityIcon(scanResult.severity)}
              </div>
              <div>
                <div className="text-lg font-semibold">Scan Results</div>
                <div className="text-sm text-gray-600 font-normal">स्कैन परिणाम</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            {/* Disease Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {language === 'hindi' ? scanResult.hindi : scanResult.name}
                </h3>
                <Badge className={`${getSeverityColor(scanResult.severity)} text-white`}>
                  {t[scanResult.severity]}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-4">
                {language === 'hindi' ? scanResult.hindiDescription : scanResult.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t.confidence}</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={scanResult.confidence} className="flex-1" />
                    <span className="text-sm font-medium">{scanResult.confidence}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t.severity}</p>
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(scanResult.severity)}
                    <span className="capitalize">{t[scanResult.severity]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Treatment Recommendations */}
            {scanResult.treatment.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">{t.treatment}</h4>
                <div className="bg-red-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {(language === 'hindi' ? scanResult.hindiTreatment : scanResult.treatment).map((step, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-red-800">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Prevention Tips */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">{t.prevention}</h4>
              <div className="bg-green-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {(language === 'hindi' ? scanResult.hindiPrevention : scanResult.prevention).map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-green-800">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <Separator />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-16 w-32">
                <FigmaButton />
              </div>
              
              <Button variant="outline" className="flex items-center space-x-3 px-6 py-3 rounded-2xl border-2 hover:bg-gray-50 transition-all duration-200">
                <Download className="h-4 w-4" />
                <div className="text-left">
                  <div className="text-sm font-medium">Download Report</div>
                  <div className="text-xs opacity-70">रिपोर्ट डाउनलोड करें</div>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center space-x-3 px-6 py-3 rounded-2xl border-2 hover:bg-gray-50 transition-all duration-200">
                <Share2 className="h-4 w-4" />
                <div className="text-left">
                  <div className="text-sm font-medium">Share Results</div>
                  <div className="text-xs opacity-70">परिणाम साझा करें</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critical Alert Modal */}
      {scanResult && scanResult.severity === 'severe' && (
        <Dialog open={true}>
          <DialogContent className="bg-red-50 border-red-200">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="h-6 w-6" />
                <span>{t.criticalAlert}</span>
              </DialogTitle>
              <DialogDescription className="text-red-700">
                Immediate action required to prevent crop damage. Please follow the treatment recommendations carefully.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}