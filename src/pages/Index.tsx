import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";
import CategoryFilter from "@/components/CategoryFilter";
import ContactForm from "@/components/ContactForm";
import { usePosts } from "@/contexts/PostsContext";
import { contactApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/types/blog";

const Index = () => {
  const { posts, loading, error } = usePosts();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter(post => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const postCounts = useMemo(() => {
    return {
      all: posts.length,
      job: posts.filter(p => p.category === 'job').length,
      internship: posts.filter(p => p.category === 'internship').length,
      startup: posts.filter(p => p.category === 'startup').length,
    };
  }, [posts]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setSubscribing(true);
    try {
      await contactApi.subscribe(email);
      toast({
        title: "Success",
        description: "Successfully subscribed to our newsletter!",
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading opportunities: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onContactClick={() => setShowContact(true)}
        onNavigateCategory={(cat) => setSelectedCategory(cat)}
      />
      <Hero />
      
      <main id="opportunities" className="container py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest Opportunities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover hand-picked job openings, internships, and startup opportunities 
            perfect for both fresh graduates and experienced professionals.
          </p>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          postCounts={postCounts}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No opportunities found in this category.</p>
          </div>
        )}
      </main>
      
      <section id="about" className="container py-16">
        <div className="max-w-3xl mx-auto text-center text-muted-foreground">
          <h3 className="text-2xl font-semibold mb-3">About CareerHub</h3>
          <p>
            CareerHub curates the latest jobs, internships, and startup opportunities for fresher and experienced candidates.
            Use the Admin page to submit new opportunities that appear instantly on the homepage.
          </p>
        </div>
      </section>

      <footer className="bg-muted py-12 mt-8">
        <div className="container text-center">
          <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
          <p className="text-muted-foreground mb-4">Get the latest career opportunities delivered to your inbox</p>
          <form onSubmit={handleSubscribe} className="flex justify-center gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border rounded-md max-w-xs"
              required
            />
            <button 
              type="submit"
              disabled={subscribing}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Contact Us</h2>
                <button 
                  onClick={() => setShowContact(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
