import { Button } from "@/components/ui/button";
import { Briefcase, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onContactClick?: () => void;
  onNavigateCategory?: (category: 'job' | 'internship' | 'startup' | null) => void;
}

const Header = ({ onContactClick, onNavigateCategory }: HeaderProps) => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">CareerHub</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <button
            type="button"
            onClick={() => {
              onNavigateCategory?.('job');
              document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Jobs
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateCategory?.('internship');
              document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Internships
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateCategory?.('startup');
              document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Startups
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onContactClick}>
            Contact
          </Button>
          <Link to="/admin">
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
              Submit Opportunity
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;