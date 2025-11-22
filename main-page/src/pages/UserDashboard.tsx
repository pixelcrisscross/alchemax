import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock,
  TrendingUp,
  Users,
  GraduationCap,
  Heart,
  Map,
  Sparkles,
  Search,
  Loader2,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { JobChatBot } from "@/components/JobChatBot"; // Import Chatbot

// Define the shape of our scraped job data
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  source: string;
  verified: boolean;
  link?: string;
  datePosted?: string;
  deadline?: string;
  type?: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for real-time data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // 1. Fetch Initial Data (Layer 1 Scraper)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Assuming your backend is running on port 5000
        const response = await fetch('https://backend-search.vercel.app/api/jobs');
        const data = await response.json();
        
        if (data.success) {
          setJobs(data.data);
        } else {
          console.error("Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Backend unavailable:", error);
        toast({
          title: "Connection Error",
          description: "Could not connect to the job server. Is it running?",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [toast]);

  // 2. Handle Live Search (Layer 5 Scraper)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch('http://backend-search.vercel.app/api/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
        toast({
          title: "Search Complete",
          description: `Found ${data.data.length} opportunities from local & live sources.`,
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Could not perform live search.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const communityServices = [
    { name: "Skills Workshop", icon: GraduationCap, distance: "2 km", status: "Today" },
    { name: "Healthcare Center", icon: Heart, distance: "1.5 km", status: "Open" },
    { name: "Job Fair", icon: Users, distance: "5 km", status: "This Week" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Opportunities</h1>
            <p className="text-muted-foreground">Real-time job matches from trusted sources</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/community-map")} className="gap-2 hover:scale-105 transition-smooth">
              <Map className="h-4 w-4" />
              Map
            </Button>
            <Button variant="outline" onClick={() => navigate("/skills-exchange")} className="gap-2 hover:scale-105 transition-smooth">
              <GraduationCap className="h-4 w-4" />
              Skills
            </Button>
            {/* Added Verifier Button */}
            <Button 
              variant="default" 
              onClick={() => window.open('https://frontend-search.vercel.app', '_blank')} 
              className="gap-2 hover:scale-105 transition-smooth bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              Verifier
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? "-" : jobs.length}</p>
                <p className="text-xs text-muted-foreground">Active Jobs Found</p>
              </div>
            </div>
          </Card>
          {/* ... other stats can remain static or be wired up later ... */}
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">Live</p>
                <p className="text-xs text-muted-foreground">Real-time Updates</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Job Matches Column */}
          <Card className="lg:col-span-2 glass-card p-6 min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Job Feed</h2>
              <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-xs">
                <Input 
                  placeholder="Search roles (e.g. Python)..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background/50"
                />
                <Button type="submit" size="icon" disabled={isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </form>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Connecting to Verification Engine...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No jobs found. Try searching for a specific role!</p>
                </div>
              ) : (
                jobs.map((job, idx) => (
                  <Card key={job.id || idx} className="p-5 hover:shadow-hover transition-smooth border-2 hover:border-primary/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{job.title}</h3>
                          {job.verified ? (
                             <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                               <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                             </Badge>
                          ) : (
                             <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                               <ShieldAlert className="w-3 h-3 mr-1" /> Public
                             </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground font-medium">{job.company}</p>
                      </div>
                      
                      {/* Source Badge */}
                      <Badge variant="outline" className="text-xs capitalize">
                        {job.source}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      {job.type && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.datePosted || job.deadline || "Recently"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" variant={job.verified ? "default" : "secondary"} onClick={() => {
                        if (job.link) window.open(job.link, '_blank');
                      }}>
                        {job.link ? (
                          <>Apply on Source <ExternalLink className="ml-2 h-3 w-3" /></>
                        ) : (
                          "View Details"
                        )}
                      </Button>
                      <Button variant="outline">Save</Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>

          {/* Community Resources (Right Column) */}
          <div className="space-y-6">
            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Nearby Services</h2>
              <div className="space-y-3">
                {communityServices.map((service, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                        <service.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.distance} away</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{service.status}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2 hover:scale-105 transition-smooth" onClick={() => navigate("/community-map")}>
                <Map className="h-4 w-4" />
                View Full Map
              </Button>
            </Card>

            <Card className="glass-card p-6 bg-gradient-to-br from-community/10 to-warmth/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-community" />
                <h3 className="font-bold">Community Impact</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Join our skills exchange program and help build a stronger community!
              </p>
              <Button variant="outline" className="w-full hover:scale-105 transition-smooth" onClick={() => navigate("/skills-exchange")}>
                Explore Skills Exchange
              </Button>
            </Card>
          </div>
        </div>
      </div>
      
      {/* AI Chatbot Overlay */}
      <JobChatBot />
    </div>
  );
};

export default UserDashboard;