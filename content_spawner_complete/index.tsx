import React, { useState } from 'react';
import Hero from './components/Hero';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import './styles/global.css';

interface ContentPiece {
  id: string;
  type: 'blog' | 'social' | 'email' | 'product';
  title: string;
  content: string;
  platform?: string;
  tags: string[];
  createdAt: Date;
}

export default function ContentSpawner() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<'blog' | 'social' | 'email' | 'product'>('blog');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ContentPiece[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const handleGenerateContent = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate AI content generation
      const newContent: ContentPiece[] = [];
      
      for (let i = 0; i < 5; i++) {
        const contentPiece: ContentPiece = {
          id: `content-${Date.now()}-${i}`,
          type: contentType,
          title: `${contentType} piece ${i + 1} about ${topic}`,
          content: `This is a generated ${contentType} piece about ${topic}. It includes engaging content, relevant keywords, and optimized structure for maximum engagement and conversion.`,
          platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
          tags: [topic, contentType, 'ai-generated'],
          createdAt: new Date()
        };
        
        newContent.push(contentPiece);
      }
      
      setGeneratedContent(prev => [...newContent, ...prev]);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportContent = () => {
    const contentData = JSON.stringify(generatedContent, null, 2);
    const blob = new Blob([contentData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-spawner-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    // Show toast notification
    alert('Content copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Hero />
        
        <div className="mt-16 space-y-8">
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-pink-400">🧠 Content Generation Engine</h2>
            <p className="text-gray-300 mb-6">
              Generate 100+ high-quality content pieces in one click. From blog posts to social media 
              captions, product descriptions to email sequences - all optimized for engagement and conversion.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input 
                placeholder="Enter your topic or keyword..." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <Button 
                onClick={handleGenerateContent}
                disabled={isGenerating || !topic.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {isGenerating ? 'Generating...' : 'Spawn Content'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <select 
                value={contentType}
                onChange={(e) => setContentType(e.target.value as any)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="blog">Blog Posts</option>
                <option value="social">Social Media</option>
                <option value="email">Email Sequences</option>
                <option value="product">Product Descriptions</option>
              </select>

              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
              </select>

              <Button 
                onClick={handleExportContent}
                disabled={generatedContent.length === 0}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                Export All
              </Button>

              <Button 
                onClick={() => setGeneratedContent([])}
                disabled={generatedContent.length === 0}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                Clear All
              </Button>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-cyan-400">Blog Posts</h3>
              <p className="text-sm text-gray-400">SEO-optimized articles with engaging headlines</p>
              <div className="mt-4 text-xs text-gray-500">
                • 1000-2000 words<br/>
                • SEO optimized<br/>
                • Engaging headlines<br/>
                • Call-to-action ready
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Social Media</h3>
              <p className="text-sm text-gray-400">Viral captions for all platforms</p>
              <div className="mt-4 text-xs text-gray-500">
                • Platform-specific<br/>
                • Hashtag optimized<br/>
                • Engagement hooks<br/>
                • Trending topics
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-green-400">Email Sequences</h3>
              <p className="text-sm text-gray-400">High-converting email campaigns</p>
              <div className="mt-4 text-xs text-gray-500">
                • Welcome series<br/>
                • Nurture sequences<br/>
                • Sales campaigns<br/>
                • Re-engagement
              </div>
            </Card>
          </div>

          {/* Generated Content Display */}
          {generatedContent.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">
                Generated Content ({generatedContent.length} pieces)
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {generatedContent.map((content) => (
                  <Card key={content.id} className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">{content.title}</h4>
                        <div className="flex gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-600 text-xs rounded-full">
                            {content.type}
                          </span>
                          {content.platform && (
                            <span className="px-2 py-1 bg-purple-600 text-xs rounded-full">
                              {content.platform}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleCopyContent(content.content)}
                        className="bg-gray-700 hover:bg-gray-600 text-xs px-3 py-1"
                      >
                        Copy
                      </Button>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {content.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {content.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-3">
                      Generated: {content.createdAt.toLocaleString()}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 