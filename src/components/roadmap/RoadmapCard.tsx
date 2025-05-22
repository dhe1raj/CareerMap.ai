
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MoreHorizontal, Trash2, Share2, ExternalLink } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Roadmap } from '@/types/roadmap';

interface RoadmapCardProps {
  roadmap: Roadmap;
  progress?: number;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string, isPublic: boolean) => void;
}

export function RoadmapCard({ roadmap, progress = 0, onDelete, onTogglePublic }: RoadmapCardProps) {
  const handleCopyLink = () => {
    if (!roadmap.is_public) {
      toast.error('Make the roadmap public first to share it');
      return;
    }
    
    const url = `${window.location.origin}/roadmap/${roadmap.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  return (
    <Card className="glass-morphism h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate max-w-[80%]" title={roadmap.title}>
            {roadmap.title}
          </CardTitle>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onTogglePublic && (
                <DropdownMenuItem onClick={() => onTogglePublic(roadmap.id!, !roadmap.is_public)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  {roadmap.is_public ? 'Make Private' : 'Make Public'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleCopyLink}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem 
                  className="text-red-500 hover:text-red-600"
                  onClick={() => onDelete(roadmap.id!)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Roadmap
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground mb-4">
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
            {roadmap.type.charAt(0).toUpperCase() + roadmap.type.slice(1)}
          </span>
          
          <div className="mt-3">
            <p className="text-sm">
              {roadmap.sections.length} sections • {roadmap.sections.reduce((acc, section) => acc + section.items.length, 0)} skills
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:shadow-[0_0_20px_rgba(159,104,240,0.5)]"
          asChild
        >
          <Link to={`/roadmap/${roadmap.id}`}>Continue</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
