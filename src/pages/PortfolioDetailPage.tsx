
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import SEOManager from '@/components/SEO/SEOManager';
import FadeInView from '@/components/animations/FadeInView';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Star, Clock } from 'lucide-react';
import AudioPlayerManager, { validateAudioUrl } from '@/components/audio/AudioPlayerManager';
import VideoPlayerSection from '@/components/enhanced/VideoPlayerSection';
import ExternalLinksSection from '@/components/enhanced/ExternalLinksSection';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PortfolioDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { portfolioItems, isLoading, error } = usePortfolioData();

  const item = portfolioItems.find(item => item.id === id);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Mixing & Mastering": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Sound Design": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Podcasting": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Sound for Picture": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "Dolby Atmos": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasValidMedia = (url?: string) => {
    return url && url.trim() !== '' && url !== 'undefined' && url !== 'null';
  };

  if (isLoading) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
          <div className="container mx-auto px-4 py-12">
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <AlertDescription className="text-red-800 dark:text-red-200">
                Error loading portfolio item: {error.message}
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-nature-forest dark:text-white mb-4">
                Portfolio Item Not Found
              </h1>
              <p className="text-nature-bark dark:text-gray-300 mb-6">
                The portfolio item you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/portfolio')} className="bg-nature-forest hover:bg-nature-leaf text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOManager
        title={`${item.title} | Portfolio | Terra Echo Studios`}
        description={item.description}
        keywords={[
          item.category.toLowerCase(),
          "audio engineering",
          "portfolio",
          item.client.toLowerCase(),
          "terra echo studios"
        ]}
        structuredDataType="portfolio"
        structuredData={{
          name: item.title,
          description: item.description,
          category: item.category,
          client: item.client
        }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <UnifiedNavbar />
        
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <FadeInView direction="up">
              <Button 
                onClick={() => navigate('/portfolio')} 
                variant="outline"
                className="mb-6 text-nature-forest border-nature-forest hover:bg-nature-forest hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
            </FadeInView>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <FadeInView direction="left">
                <div className="relative">
                  {item.coverImageUrl ? (
                    <img 
                      src={item.coverImageUrl} 
                      alt={item.title}
                      className="w-full h-96 lg:h-[600px] object-cover rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-96 lg:h-[600px] bg-gradient-to-br from-nature-sage to-nature-mist dark:from-gray-700 dark:to-gray-600 flex items-center justify-center rounded-lg shadow-lg">
                      <div className="text-nature-forest dark:text-white text-6xl font-bold opacity-20">
                        {item.title.charAt(0)}
                      </div>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </FadeInView>

              {/* Right Column - Content */}
              <FadeInView direction="right">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-nature-forest dark:text-white mb-4">
                      {item.title}
                    </h1>
                    
                    <div className="flex items-center text-nature-bark dark:text-gray-400 mb-4">
                      <User className="w-5 h-5 mr-2" />
                      <span className="text-lg">Client: {item.client}</span>
                    </div>

                    {/* Date information */}
                    <div className="flex flex-col gap-2 text-sm text-nature-bark dark:text-gray-400">
                      {item.recordedDate && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="font-medium">Completed:</span>
                          <span className="ml-2">{formatDate(item.recordedDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-medium">Added to Portfolio:</span>
                        <span className="ml-2">{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-xl font-semibold text-nature-forest dark:text-white mb-3">
                      Project Description
                    </h2>
                    <p className="text-nature-bark dark:text-gray-300 leading-relaxed text-base">
                      {item.description}
                    </p>
                  </div>

                  {/* Audio Player Section */}
                  {validateAudioUrl(item.audioUrl) && (
                    <div>
                      <h3 className="text-lg font-semibold text-nature-forest dark:text-white mb-3">
                        Audio Preview
                      </h3>
                      <AudioPlayerManager 
                        audioUrl={item.audioUrl} 
                        title={item.title} 
                        variant="default" 
                      />
                    </div>
                  )}

                  {/* Video Player Section */}
                  {hasValidMedia(item.videoUrl) && (
                    <div>
                      <h3 className="text-lg font-semibold text-nature-forest dark:text-white mb-3">
                        Video Preview
                      </h3>
                      <VideoPlayerSection videoUrl={item.videoUrl} />
                    </div>
                  )}

                  {/* External Links Section */}
                  {item.externalLinks && item.externalLinks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-nature-forest dark:text-white mb-3">
                        Listen & Watch
                      </h3>
                      <ExternalLinksSection links={item.externalLinks} />
                    </div>
                  )}
                </div>
              </FadeInView>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PortfolioDetailPage;
