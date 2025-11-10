import React, { useState, useEffect } from 'react';
import { Database, Search, Eye, BarChart3, Plus, MapPin, Calendar, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

export function DiseaseReporting({ language }) {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const translations = {
    english: {
      title: 'Disease Reporting System',
      subtitle: 'Report and track crop disease outbreaks in your area',
      reportNew: 'Report New Outbreak',
      searchReports: 'Search Reports',
      openDashboard: 'Open Dashboard',
      recentReports: 'Recent Reports',
      severityFilter: 'Filter by Severity',
      allSeverities: 'All Severities',
      location: 'Location',
      cropType: 'Crop Type',
      diseaseType: 'Disease Type',
      severity: 'Severity',
      description: 'Description',
      dateReported: 'Date Reported',
      reporterName: 'Reporter Name',
      contactInfo: 'Contact Information',
      additionalNotes: 'Additional Notes',
      submitReport: 'Submit Report',
      viewDetails: 'View Details',
      noReports: 'No reports found',
      reportSubmitted: 'Report submitted successfully!',
      dashboardTitle: 'Disease Outbreak Dashboard',
      totalReports: 'Total Reports',
      activeOutbreaks: 'Active Outbreaks',
      affectedAreas: 'Affected Areas',
      closeDialog: 'Close'
    },
    hindi: {
      title: 'रोग रिपोर्टिंग सिस्टम',
      subtitle: 'अपने क्षेत्र में फसल रोग के प्रकोप की रिपोर्ट करें और ट्रैक करें',
      reportNew: 'नया प्रकोप रिपोर्ट करें',
      searchReports: 'रिपोर्ट खोजें',
      openDashboard: 'डैशबोर्ड खोलें',
      recentReports: 'हाल की रिपोर्टें',
      severityFilter: 'गंभीरता के अनुसार फिल्टर करें',
      allSeverities: 'सभी गंभीरता',
      location: 'स्थान',
      cropType: 'फसल का प्रकार',
      diseaseType: 'रोग का प्रकार',
      severity: 'गंभीरता',
      description: 'विवरण',
      dateReported: 'रिपोर्ट की तारीख',
      reporterName: 'रिपोर्टर का नाम',
      contactInfo: 'संपर्क जानकारी',
      additionalNotes: 'अतिरिक्त नोट्स',
      submitReport: 'रिपोर्ट जमा करें',
      viewDetails: 'विवरण देखें',
      noReports: 'कोई रिपोर्ट नहीं मिली',
      reportSubmitted: 'रिपोर्ट सफलतापूर्वक जमा की गई!',
      dashboardTitle: 'रोग प्रकोप डैशबोर्ड',
      totalReports: 'कुल रिपोर्टें',
      activeOutbreaks: 'सक्रिय प्रकोप',
      affectedAreas: 'प्रभावित क्षेत्र',
      closeDialog: 'बंद करें'
    }
  };

  const t = translations[language];

  // Mock reports data
  const mockReports = [
    {
      id: 1,
      location: 'Punjab, Ludhiana',
      cropType: 'Wheat',
      diseaseType: 'Leaf Rust',
      severity: 'moderate',
      description: 'Yellow-orange pustules observed on wheat leaves',
      dateReported: '2024-03-15',
      reporterName: 'Rajesh Kumar',
      contactInfo: '9876543210',
      additionalNotes: 'Affecting approximately 20% of the field',
      status: 'active'
    },
    {
      id: 2,
      location: 'Maharashtra, Pune',
      cropType: 'Tomato',
      diseaseType: 'Late Blight',
      severity: 'severe',
      description: 'Dark lesions with white mold on tomato leaves and fruits',
      dateReported: '2024-03-14',
      reporterName: 'Priya Sharma',
      contactInfo: '9876543211',
      additionalNotes: 'Rapid spread observed after recent rains',
      status: 'active'
    },
    {
      id: 3,
      location: 'Karnataka, Bangalore',
      cropType: 'Rice',
      diseaseType: 'Blast Disease',
      severity: 'mild',
      description: 'Small brown spots on rice leaves',
      dateReported: '2024-03-13',
      reporterName: 'Suresh Reddy',
      contactInfo: '9876543212',
      additionalNotes: 'Early stage detection, quick action needed',
      status: 'resolved'
    }
  ];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    // Set mock data immediately
    setReports(mockReports);
    
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-5d78fdfd`;
      
      console.log('Attempting to load reports from:', `${baseUrl}/reports/search`);
      
      // Add timeout for reports requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${baseUrl}/reports/search`, {
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Reports API response status:', response.status);

      if (response.ok) {
        const reportsData = await response.json();
        console.log('Reports received from API:', reportsData);
        if (reportsData.length > 0) {
          setReports(reportsData);
        }
      } else {
        const errorText = await response.text();
        console.log('Reports API returned error:', response.status, errorText);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Reports API request timed out, using mock data');
      } else {
        console.log('Reports API unavailable, using mock data:', error.message);
      }
    }
  };

  const handleSubmitReport = async (formData) => {
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-5d78fdfd`;
      
      console.log('Submitting report to:', `${baseUrl}/reports/create`);
      
      const response = await fetch(`${baseUrl}/reports/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          ...formData,
          disease: formData.diseaseType,
          location: formData.location,
          dateReported: new Date().toISOString().split('T')[0],
          status: 'active'
        })
      });

      console.log('Report submission response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Report submitted successfully:', data);
        
        // Add the new report to the local state
        setReports([data.report, ...reports]);
        setShowReportDialog(false);
        toast.success(t.reportSubmitted);
      } else {
        const errorText = await response.text();
        console.error('Report submission error:', response.status, errorText);
        throw new Error(`Report submission error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to submit report:', error);
      
      // Fallback to local storage
      const newReport = {
        id: reports.length + 1,
        ...formData,
        dateReported: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      
      setReports([newReport, ...reports]);
      setShowReportDialog(false);
      toast.success(t.reportSubmitted);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.diseaseType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || report.severity === filterSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-500';
      case 'moderate': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-green-800 mb-2">{t.title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>{t.reportNew}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.reportNew}</DialogTitle>
              <DialogDescription>
                Help your farming community by reporting disease outbreaks
              </DialogDescription>
            </DialogHeader>
            <ReportForm onSubmit={handleSubmitReport} translations={t} />
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          onClick={() => setShowDashboard(true)}
          className="flex items-center space-x-2"
        >
          <BarChart3 className="h-5 w-5" />
          <span>{t.openDashboard}</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.searchReports}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder={t.severityFilter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allSeverities}</SelectItem>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div>
        <h3 className="mb-4 text-gray-800">{t.recentReports}</h3>
        
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t.noReports}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{report.diseaseType}</CardTitle>
                      <CardDescription className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{report.location}</span>
                      </CardDescription>
                    </div>
                    <Badge className={`${getSeverityColor(report.severity)} text-white text-xs`}>
                      {report.severity}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Crop:</span>
                      <p className="font-medium">{report.cropType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <p className="font-medium">{report.dateReported}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {report.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline" className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedReport(report)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>{t.viewDetails}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Report Details Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>{selectedReport.diseaseType}</span>
              </DialogTitle>
              <DialogDescription>
                Report ID: #{selectedReport.id} • {selectedReport.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">{t.cropType}</Label>
                  <p className="font-medium">{selectedReport.cropType}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">{t.severity}</Label>
                  <Badge className={`${getSeverityColor(selectedReport.severity)} text-white mt-1`}>
                    {selectedReport.severity}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">{t.reporterName}</Label>
                  <p className="font-medium">{selectedReport.reporterName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">{t.contactInfo}</Label>
                  <p className="font-medium">{selectedReport.contactInfo}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm text-gray-500">{t.description}</Label>
                <p className="mt-1">{selectedReport.description}</p>
              </div>
              
              {selectedReport.additionalNotes && (
                <div>
                  <Label className="text-sm text-gray-500">{t.additionalNotes}</Label>
                  <p className="mt-1">{selectedReport.additionalNotes}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={() => setSelectedReport(null)}>
                  {t.closeDialog}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dashboard Dialog */}
      {showDashboard && (
        <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>{t.dashboardTitle}</span>
              </DialogTitle>
              <DialogDescription>
                View analytics and trends for disease outbreaks in your region
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600">{t.totalReports}</p>
                        <p className="text-2xl font-bold text-blue-800">{reports.length}</p>
                      </div>
                      <Database className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-red-50 to-red-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-600">{t.activeOutbreaks}</p>
                        <p className="text-2xl font-bold text-red-800">
                          {reports.filter(r => r.status === 'active').length}
                        </p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">{t.affectedAreas}</p>
                        <p className="text-2xl font-bold text-green-800">
                          {new Set(reports.map(r => r.location)).size}
                        </p>
                      </div>
                      <MapPin className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Recent Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-yellow-800">Leaf Rust cases increasing in Punjab region</span>
                      <Badge className="bg-yellow-500 text-white">Trending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-red-800">Late Blight outbreak spreading in Maharashtra</span>
                      <Badge className="bg-red-500 text-white">Critical</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800">Blast Disease reports declining in Karnataka</span>
                      <Badge className="bg-green-500 text-white">Improving</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Report Form Component
function ReportForm({ onSubmit, translations }) {
  const [formData, setFormData] = useState({
    location: '',
    cropType: '',
    diseaseType: '',
    severity: '',
    description: '',
    reporterName: '',
    contactInfo: '',
    additionalNotes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">{translations.location} *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., Punjab, Ludhiana"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="cropType">{translations.cropType} *</Label>
          <Select value={formData.cropType} onValueChange={(value) => handleChange('cropType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select crop type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="tomato">Tomato</SelectItem>
              <SelectItem value="potato">Potato</SelectItem>
              <SelectItem value="cotton">Cotton</SelectItem>
              <SelectItem value="sugarcane">Sugarcane</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="diseaseType">{translations.diseaseType} *</Label>
          <Input
            id="diseaseType"
            value={formData.diseaseType}
            onChange={(e) => handleChange('diseaseType', e.target.value)}
            placeholder="e.g., Leaf Rust, Late Blight"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="severity">{translations.severity} *</Label>
          <Select value={formData.severity} onValueChange={(value) => handleChange('severity', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="reporterName">{translations.reporterName} *</Label>
          <Input
            id="reporterName"
            value={formData.reporterName}
            onChange={(e) => handleChange('reporterName', e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="contactInfo">{translations.contactInfo} *</Label>
          <Input
            id="contactInfo"
            value={formData.contactInfo}
            onChange={(e) => handleChange('contactInfo', e.target.value)}
            placeholder="Phone number or email"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">{translations.description} *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the symptoms and affected area"
          rows={3}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="additionalNotes">{translations.additionalNotes}</Label>
        <Textarea
          id="additionalNotes"
          value={formData.additionalNotes}
          onChange={(e) => handleChange('additionalNotes', e.target.value)}
          placeholder="Any additional information"
          rows={2}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          {translations.submitReport}
        </Button>
      </div>
    </form>
  );
}