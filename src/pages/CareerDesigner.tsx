
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOMetadata } from '@/components/SEOMetadata';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Laptop, BookOpen, ChevronRight } from 'lucide-react';
import { RoadmapForm } from '@/components/roadmap/RoadmapForm';
import { RoadmapPreview } from '@/components/roadmap/RoadmapPreview';
import { useGenerateRoadmap } from '@/hooks/use-generate-roadmap';
import { useRoadmaps } from '@/hooks/use-roadmaps';
import { RoadmapFormData, Roadmap } from '@/types/roadmap';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Sample templates
const ROADMAP_TEMPLATES = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    type: 'role' as const,
    description: 'Master modern web development with HTML, CSS, JavaScript, and React',
    icon: <Laptop className="h-10 w-10 text-purple-500" />,
    sections: [
      {
        title: 'Fundamentals',
        items: [
          { 
            id: 'html',
            label: 'HTML5', 
            tooltip: 'Learn semantic HTML and best practices', 
            link: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
          },
          { 
            id: 'css',
            label: 'CSS3', 
            tooltip: 'Master layouts, flexbox, grid, and responsive design', 
            link: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
          },
          { 
            id: 'javascript',
            label: 'JavaScript', 
            tooltip: 'Core concepts, DOM manipulation, ES6+ features', 
            link: 'https://javascript.info/'
          }
        ]
      },
      {
        title: 'Frameworks',
        items: [
          { 
            id: 'react',
            label: 'React', 
            tooltip: 'Component-based UI library for building interfaces', 
            link: 'https://react.dev/'
          },
          { 
            id: 'nextjs',
            label: 'Next.js', 
            tooltip: 'React framework with server-side rendering and more', 
            link: 'https://nextjs.org/'
          }
        ]
      },
      {
        title: 'Tools',
        items: [
          { 
            id: 'git',
            label: 'Git & GitHub', 
            tooltip: 'Version control and collaboration', 
            link: 'https://github.com/features'
          },
          { 
            id: 'webpack',
            label: 'Webpack', 
            tooltip: 'Modern JavaScript module bundler', 
            link: 'https://webpack.js.org/'
          }
        ]
      },
      {
        title: 'Advanced',
        items: [
          { 
            id: 'typescript',
            label: 'TypeScript', 
            tooltip: 'JavaScript with syntax for types', 
            link: 'https://www.typescriptlang.org/'
          },
          { 
            id: 'testing',
            label: 'Testing', 
            tooltip: 'Jest, React Testing Library, and more', 
            link: 'https://jestjs.io/'
          }
        ]
      }
    ]
  },
  {
    id: 'data-science',
    title: 'Data Scientist',
    type: 'role' as const,
    description: 'Learn statistics, machine learning, and data visualization',
    icon: <BookOpen className="h-10 w-10 text-purple-500" />,
    sections: [
      {
        title: 'Fundamentals',
        items: [
          { 
            id: 'python',
            label: 'Python', 
            tooltip: 'Programming language for data science', 
            link: 'https://www.python.org/'
          },
          { 
            id: 'statistics',
            label: 'Statistics', 
            tooltip: 'Probability, hypothesis testing, and statistical analysis', 
            link: 'https://www.khanacademy.org/math/statistics-probability'
          }
        ]
      },
      {
        title: 'Libraries',
        items: [
          { 
            id: 'pandas',
            label: 'Pandas', 
            tooltip: 'Data manipulation and analysis', 
            link: 'https://pandas.pydata.org/'
          },
          { 
            id: 'numpy',
            label: 'NumPy', 
            tooltip: 'Scientific computing with Python', 
            link: 'https://numpy.org/'
          },
          { 
            id: 'matplotlib',
            label: 'Matplotlib', 
            tooltip: 'Data visualization library', 
            link: 'https://matplotlib.org/'
          }
        ]
      },
      {
        title: 'Machine Learning',
        items: [
          { 
            id: 'scikit',
            label: 'Scikit-learn', 
            tooltip: 'Machine learning in Python', 
            link: 'https://scikit-learn.org/'
          },
          { 
            id: 'tensorflow',
            label: 'TensorFlow', 
            tooltip: 'Deep learning framework', 
            link: 'https://www.tensorflow.org/'
          }
        ]
      },
      {
        title: 'Advanced',
        items: [
          { 
            id: 'nlp',
            label: 'Natural Language Processing', 
            tooltip: 'Processing and analyzing text data', 
            link: 'https://www.nltk.org/'
          },
          { 
            id: 'big-data',
            label: 'Big Data', 
            tooltip: 'Spark, Hadoop, and distributed computing', 
            link: 'https://spark.apache.org/'
          }
        ]
      }
    ]
  }
];

export default function CareerDesigner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isGenerating, generatedRoadmap, generateRoadmap, resetGeneratedRoadmap } = useGenerateRoadmap();
  const { createRoadmap } = useRoadmaps();
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  const handleFormSubmit = async (data: RoadmapFormData) => {
    await generateRoadmap(data);
    setActiveTab('preview');
  };

  const handleSelectTemplate = (template: Roadmap) => {
    resetGeneratedRoadmap();
    setActiveTab('preview');
    setTimeout(() => {
      // This setTimeout ensures the state update happens after the tab change
      generateRoadmap({
        role: template.title,
        studentType: 'student',
        learningPreference: 'video'
      });
    }, 0);
  };

  const handleSaveRoadmap = async (roadmap: Roadmap) => {
    if (!user) {
      toast.error('Please sign in to save your roadmap');
      navigate('/login');
      return;
    }

    setIsCreating(true);
    try {
      const savedRoadmap = await createRoadmap(roadmap);
      if (savedRoadmap) {
        toast.success('Roadmap created successfully');
        navigate(`/roadmap/${savedRoadmap.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    resetGeneratedRoadmap();
    setActiveTab('ai');
  };

  return (
    <DashboardLayout>
      <SEOMetadata
        title="Career Designer | CareerMap"
        description="Design your career roadmap with AI-powered tools and templates."
      />
      
      <div className="container py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-1">Career Designer</h1>
        <p className="text-muted-foreground mb-6">Design your personalized career roadmap</p>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="templates">
              <BookOpen className="h-4 w-4 mr-2" /> Templates
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="h-4 w-4 mr-2" /> AI Designer
            </TabsTrigger>
            {generatedRoadmap && (
              <TabsTrigger value="preview">
                Preview
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="templates" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROADMAP_TEMPLATES.map((template) => (
                <Card key={template.id} className="glass-morphism hover:border-purple-500/40 transition-all cursor-pointer"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        {template.icon}
                      </div>
                      <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                        {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                      </div>
                    </div>
                    <CardTitle className="mt-4">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-purple-400">
                      <span>Use this template</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="glass-morphism border border-dashed border-purple-500/30 flex flex-col items-center justify-center p-6 h-full">
                <Button 
                  variant="ghost"
                  className="flex flex-col h-full w-full gap-3"
                  onClick={() => setActiveTab('ai')}
                >
                  <Sparkles className="h-16 w-16 text-purple-500/70" />
                  <div className="text-lg font-medium">Create Custom Roadmap</div>
                  <div className="text-sm text-muted-foreground">
                    Design a custom roadmap with AI
                  </div>
                </Button>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="ai">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Generate AI Roadmap</CardTitle>
                <CardDescription>
                  Our AI will create a personalized career roadmap based on your inputs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoadmapForm onSubmit={handleFormSubmit} isGenerating={isGenerating} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview">
            {generatedRoadmap ? (
              <RoadmapPreview 
                roadmap={generatedRoadmap} 
                onSave={handleSaveRoadmap}
                onCancel={handleCancel}
                isLoading={isCreating}
              />
            ) : (
              <div className="text-center p-12">
                <p>No roadmap generated yet. Go back to AI Designer to create one.</p>
                <Button onClick={() => setActiveTab('ai')} className="mt-4">
                  Back to AI Designer
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
