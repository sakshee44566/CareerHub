import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Rocket, Filter } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  postCounts: {
    all: number;
    job: number;
    internship: number;
    startup: number;
  };
}

const CategoryFilter = ({ selectedCategory, onCategoryChange, postCounts }: CategoryFilterProps) => {
  const categories = [
    { id: null, name: 'All Opportunities', icon: Filter, count: postCounts.all },
    { id: 'job', name: 'Jobs', icon: Briefcase, count: postCounts.job },
    { id: 'internship', name: 'Internships', icon: GraduationCap, count: postCounts.internship },
    { id: 'startup', name: 'Startups', icon: Rocket, count: postCounts.startup },
  ];

  return (
    <div className="bg-card border rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Filter className="h-5 w-5" />
        Filter Opportunities
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id || 'all'}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onCategoryChange(category.id)}
              className="flex items-center gap-2 h-auto py-2 px-4"
            >
              <Icon className="h-4 w-4" />
              {category.name}
              <Badge 
                variant={isSelected ? "secondary" : "outline"}
                className="ml-1 text-xs"
              >
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;