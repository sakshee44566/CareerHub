import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Users, Zap, Briefcase } from "lucide-react";
import heroImage from "@/assets/career-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroImage} 
          alt="Professional career opportunities" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-accent/80 pointer-events-none"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container text-center text-white">
        <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
          <TrendingUp className="h-4 w-4 mr-2" />
          Latest Career Opportunities
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Your Next Career Move
          <span className="block bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
            Starts Here
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
          Discover the latest job openings, internship opportunities, and exciting startups. 
          Your dream career is just one click away.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            type="button"
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold"
            onClick={() => {
              const el = document.getElementById('opportunities');
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Browse Opportunities
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="bg-transparent border-white/60 text-white hover:bg-white/10"
            onClick={() => {
              const el = document.getElementById('about');
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Learn More
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-white/80">Job Openings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">200+</div>
            <div className="text-white/80">Startups Featured</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">1000+</div>
            <div className="text-white/80">Success Stories</div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 hidden lg:block pointer-events-none">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
          <Briefcase className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-20 right-10 hidden lg:block pointer-events-none">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
          <Users className="h-8 w-8 text-white" />
        </div>
      </div>
    </section>
  );
};

export default Hero;