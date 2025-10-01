import { BlogPost } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Building, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const [open, setOpen] = useState(false);
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'job':
        return 'bg-job text-white';
      case 'internship':
        return 'bg-internship text-white';
      case 'startup':
        return 'bg-startup text-white';
      default:
        return 'bg-primary text-white';
    }
  };

  const getExperienceLabel = (experience: string) => {
    switch (experience) {
      case 'fresher':
        return 'Entry Level';
      case 'experienced':
        return 'Experienced';
      case 'all':
        return 'All Levels';
      default:
        return experience;
    }
  };

  return (
    <>
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={getCategoryColor(post.category)} variant="default">
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </Badge>
          {post.isRemote && (
            <Badge variant="outline" className="text-xs">
              Remote
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
          {post.title}
        </CardTitle>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            {post.company}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {post.location}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="space-y-3 mb-4">
          {post.salary && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-success" />
              <span className="font-medium text-success">{post.salary}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{getExperienceLabel(post.experience)}</span>
          </div>
          
          {post.applicationDeadline && (
            <div className="text-xs text-muted-foreground">
              Apply by: {new Date(post.applicationDeadline).toLocaleDateString()}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {post.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{post.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString()}
          </span>
          <Button size="sm" className="group-hover:bg-primary/90" onClick={() => setOpen(true)}>
            View Details
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            <strong>{post.company}</strong> • {post.location} • {post.isRemote ? 'Remote' : 'On-site'}
          </div>
          {post.salary && (
            <div className="text-sm"><span className="font-medium">Salary:</span> {post.salary}</div>
          )}
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {post.content}
          </div>
          {post.applicationDeadline && (
            <div className="text-xs text-muted-foreground">Apply by: {new Date(post.applicationDeadline).toLocaleDateString()}</div>
          )}
          <div className="flex flex-wrap gap-1">
            {post.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default BlogCard;