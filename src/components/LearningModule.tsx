import React, { useState, useEffect } from 'react';
import { 
  Book, Play, Video, FileText, Headphones, BookOpen 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function LearningModule({ language }: { language: 'english' | 'hindi' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [contentType, setContentType] = useState('all');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const translations = {
    english: {
      title: 'Learn & Grow',
      subtitle: 'Enhance your farming knowledge with expert guidance and best practices',
      latestContent: 'Latest Content',
      searchContent: 'Search content...',
      allTypes: 'All Types',
      video: 'Video',
      article: 'Article',
      guide: 'Guide',
      audio: 'Audio',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      duration: 'Duration',
      rating: 'Rating',
      views: 'Views',
      watchNow: 'Watch Now',
      readNow: 'Read Now',
      listenNow: 'Listen Now',
      download: 'Download',
      noContent: 'No content found'
    },
    hindi: {
      title: 'सीखें और बढ़ें',
      subtitle: 'विशेषज्ञ मार्गदर्शन और सर्वोत्तम प्रथाओं के साथ अपने कृषि ज्ञान को बढ़ाएं',
      latestContent: 'नवीनतम सामग्री',
      searchContent: 'सामग्री खोजें...',
      allTypes: 'सभी प्रकार',
      video: 'वीडियो',
      article: 'लेख',
      guide: 'गाइड',
      audio: 'ऑडियो',
      beginner: 'शुरुआती',
      intermediate: 'मध्यम',
      advanced: 'उन्नत',
      duration: 'अवधि',
      rating: 'रेटिंग',
      views: 'दृश्य',
      watchNow: 'अभी देखें',
      readNow: 'अभी पढ़ें',
      listenNow: 'अभी सुनें',
      download: 'डाउनलोड करें',
      noContent: 'कोई सामग्री नहीं मिली'
    }
  };

  const t = translations[language] || translations.english;

  const mockContent = [
    {
      id: 1,
      title: 'Complete Guide to Cultivation',
      titleHindi: 'खेती की संपूर्ण गाइड',
      description: 'Learn the best practices for farming from seed to harvest',
      descriptionHindi: 'बीज से लेकर फसल तक खेती की सर्वोत्तम प्रथाओं को सीखें',
      type: 'video',
      level: 'beginner',
      duration: '25 min',
      rating: 4.8,
      views: 12400,
      thumbnail: 'https://images.unsplash.com/photo-1690986375486-460dc48dd499?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      featured: true
    },
    {
      id: 2,
      title: 'Organic Pest Control Methods',
      titleHindi: 'जैविक कीट नियंत्रण विधियां',
      description: 'Natural ways to protect your crops from pests without chemicals',
      descriptionHindi: 'रसायनों के बिना अपनी फसलों को कीटों से बचाने के प्राकृतिक तरीके',
      type: 'article',
      level: 'intermediate',
      duration: '10 min read',
      rating: 4.6,
      views: 8200,
      thumbnail: 'https://images.unsplash.com/photo-1728297753604-d2e129bdb226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      featured: false
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButton = (content: any) => {
    const base = "flex items-center space-x-2";

    switch (content.type) {
      case 'video':
        return (
          <Button size="sm" className={base} onClick={() => window.open('https://www.youtube.com/@IndianFarmer', '_blank')}>
            <Play className="h-4 w-4" />
            <span>{t.watchNow}</span>
          </Button>
        );
      case 'article':
      case 'guide':
        return (
          <Button size="sm" variant="outline" className={base} onClick={() => window.open('https://agribegri.com/blog/best-remedies-to-control-insect-and-pest-attacks-naturally', '_blank')}>
            <BookOpen className="h-4 w-4" />
            <span>{t.readNow}</span>
          </Button>
        );
      case 'audio':
        return (
          <Button size="sm" variant="outline" className={base} onClick={() => alert('Audio link not set yet')}>
            <Headphones className="h-4 w-4" />
            <span>{t.listenNow}</span>
          </Button>
        );
      default:
        return (
          <Button size="sm" variant="outline" className={base}>
            <Book className="h-4 w-4" />
            <span>{t.readNow}</span>
          </Button>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-green-800 mb-2">{t.title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <Tabs value="content" className="space-y-8">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" /><span>{t.latestContent}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockContent.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t.noContent}</p>
                </CardContent>
              </Card>
            )}
            {mockContent.map((content: any, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <ImageWithFallback src={content.thumbnail} alt={content.title} className="w-full h-32 object-cover rounded-t-lg" />
                <CardContent>
                  <h4>{language === 'hindi' ? content.titleHindi || content.title : content.title}</h4>
                  <p className="text-sm">{language === 'hindi' ? content.descriptionHindi || content.description : content.description}</p>
                  <div className="flex justify-between mt-2">
                    <Badge className={getLevelColor(content.level || 'beginner')}>{t[content.level || 'beginner']}</Badge>
                    {getActionButton(content)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
