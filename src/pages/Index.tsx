import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Book, Video, Clock, Search, Plus } from "lucide-react";
import { ContentUpload } from "@/components/ContentUpload";
import { CourseGrid } from "@/components/CourseGrid";
import { Dashboard } from "@/components/Dashboard";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'upload'>('dashboard');
  const [searchParams] = useSearchParams();
  
  // Check for tab parameter in URL and set active tab accordingly
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'courses') {
      setActiveTab('courses');
    } else if (tabParam === 'upload') {
      setActiveTab('upload');
    } else {
      setActiveTab('dashboard');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-center gap-2 sm:gap-0">
            <div className={`flex items-center w-full sm:w-auto ${activeTab === 'courses' ? 'justify-start' : 'justify-start'}`}>
              <img
                src={activeTab === 'courses' ? '/infinite-logo-aca.png' : '/infinite-logo.png'}
                alt="iKnowledge Tech Logo"
                className={`w-40 h-20 sm:w-56 sm:h-32 md:w-80 md:h-48 object-contain bg-transparent ${activeTab === 'courses' ? 'ml-[-2rem] sm:ml-[-3rem]' : ''}`}
              />
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-1 mt-2 sm:mt-0">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('dashboard')}
                className="text-white hover:bg-white/10 text-base sm:text-lg py-2 px-4 sm:py-3 sm:px-6"
              >
                Backend
              </Button>
              <Button
                variant={activeTab === 'courses' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('courses')}
                className="text-white hover:bg-white/10 text-base sm:text-lg py-2 px-4 sm:py-3 sm:px-6"
              >
                Courses Available
              </Button>
              <Button
                variant={activeTab === 'upload' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('upload')}
                className="text-white hover:bg-white/10 text-base sm:text-lg py-2 px-4 sm:py-3 sm:px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white mb-4">
                Transform Your Financial Knowledge with AI
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Learn about blockchain, crypto, gold, and silver investing. Upload your educational materials and watch as our AI transforms them into engaging, interactive courses with photorealistic avatars and immersive 3D environments.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Content Processing</CardTitle>
                  <CardDescription className="text-gray-300">
                    Upload PDFs, videos, or text. Our AI extracts and enhances your content automatically.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">AI Avatars</CardTitle>
                  <CardDescription className="text-gray-300">
                    Photorealistic 3D avatars deliver your content with natural expressions and voice.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                    <Book className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Adaptive Learning</CardTitle>
                  <CardDescription className="text-gray-300">
                    AI-powered tutors provide personalized guidance and real-time feedback.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Dashboard />
          </div>
        )}

        {activeTab === 'courses' && <CourseGrid />}
        {activeTab === 'upload' && <ContentUpload />}
      </main>
    </div>
  );
};

export default Index;
