import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, 
  Search, 
  Users,
  Clock,
  ArrowLeft,
  Sparkles,
  Briefcase,
  MapPin,
  X,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import skillsImage from "@/assets/skills-exchange.png";

// Job Interface (Matching Scraper Output)
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  source: string;
  verified: boolean;
  link?: string;
  deadline?: string;
  description?: string; 
}


const SkillsExchange = () => {
  const navigate = useNavigate();

  // --- Job Data States ---
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- Skills Input States ---
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch ALL Jobs from Scraper API on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://backend-search.vercel.app/api/jobs');
        const data = await response.json();
        if (data.success) {
            setAllJobs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // 2. Skill Management Logic
  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim().toLowerCase();
      if (!userSkills.includes(newSkill)) {
        setUserSkills([...userSkills, newSkill]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setUserSkills(userSkills.filter(skill => skill !== skillToRemove));
  };

  // 3. Personalized Filtering Logic
  const recommendedJobs = allJobs.filter(job => {
    // Combine fields into one searchable string
    const jobText = `${job.title} ${job.description || ''} ${job.location}`.toLowerCase();
    
    // 3a. Filter by Search Term (if any)
    const matchesSearch = jobText.includes(searchTerm.toLowerCase());

    // 3b. Filter by Skills (if any skills are set)
    if (userSkills.length === 0) return matchesSearch;

    // A job matches if it contains ANY of the user's skills
    const matchesSkill = userSkills.some(skill => 
      jobText.includes(skill)
    );

    return matchesSearch && matchesSkill;
  });

  // --- Static Data for Learning Paths (Original Content) ---
  const learningPaths = [
    { title: "Full Stack Development", duration: "12 weeks", students: 245, level: "Intermediate" },
    { title: "Python for Beginners", duration: "8 weeks", students: 389, level: "Beginner" },
    { title: "Advanced Marketing", duration: "10 weeks", students: 156, level: "Advanced" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:scale-105 transition-smooth"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Skills Exchange & Match
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Learn from mentors, share your knowledge, and get personalized job recommendations.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="gap-2 hover:scale-105 transition-smooth">
                <GraduationCap className="h-5 w-5" />
                Find a Mentor
              </Button>
              <Button size="lg" variant="outline" className="gap-2 hover:scale-105 transition-smooth">
                <Users className="h-5 w-5" />
                Become a Mentor
              </Button>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <img 
              src={skillsImage} 
              alt="Skills and learning" 
              className="rounded-2xl shadow-hover w-full"
            />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Personalized Job Match Section (The Filter) */}
        {/* ------------------------------------------------------------- */}
        <Card className="mb-12 p-6 glass-card border-l-4 border-l-primary">
           <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
             <div className="flex-1">
               <h3 className="text-2xl font-bold mb-1 flex items-center gap-2 text-primary">
                 <Briefcase className="h-6 w-6" />
                 Personalized Job Matches
               </h3>
               <p className="text-sm text-muted-foreground mb-3">
                 Enter your core skills (e.g., Python, Marketing, Civil) to filter the {allJobs.length} available jobs.
               </p>
               
               {/* Skill Badges */}
               <div className="flex flex-wrap gap-2 mb-3 min-h-[30px]">
                 {userSkills.map(skill => (
                   <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                     {skill}
                     <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeSkill(skill)} />
                   </Badge>
                 ))}
               </div>

               {/* Skill Input */}
               <div className="relative max-w-lg flex gap-2">
                 <Input 
                   placeholder="Type skill and press Enter (e.g., 'React', 'Driver')..." 
                   value={skillInput}
                   onChange={(e) => setSkillInput(e.target.value)}
                   onKeyDown={addSkill}
                   className="bg-white/50"
                 />
                 <Input 
                   placeholder="Search keyword (e.g., 'Senior')..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="bg-white/50"
                 />
               </div>
             </div>

             <div className="bg-primary/5 p-4 rounded-xl min-w-[200px] text-center">
                <div className="text-4xl font-bold text-primary">{recommendedJobs.length}</div>
                <div className="text-sm text-muted-foreground">Matching Roles</div>
             </div>
           </div>
        </Card>


        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Recommended Jobs List (Filtered by Skills) */}
          <Card className="lg:col-span-2 glass-card p-6">
            <h2 className="text-2xl font-bold mb-6">
                {userSkills.length > 0 ? `Recommended Jobs` : "All Available Jobs"}
            </h2>
            
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground"><Loader2 className="animate-spin h-8 w-8 mx-auto mb-2" /></div>
              ) : recommendedJobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No jobs matched your current skills/search terms.</p>
                  <p className="text-sm mt-1">Try entering broader keywords like 'Developer' or 'Assistant'.</p>
                </div>
              ) : (
                recommendedJobs.map((job, idx) => (
                  <Card key={job.id || idx} className="p-4 hover:shadow-hover transition-smooth border-2 hover:border-accent/20 group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-accent transition-colors line-clamp-1">{job.title}</h3>
                        <p className="text-muted-foreground font-medium text-sm">{job.company}</p>
                      </div>
                      
                      <Badge variant="outline" className={`text-[10px] capitalize ${job.verified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {job.verified ? <ShieldCheck className="h-3 w-3 mr-1" /> : <ShieldAlert className="h-3 w-3 mr-1" />}
                        {job.source.includes('College') ? 'Verified Partner' : 'Local Source'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{job.deadline || "Ongoing"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 h-8 text-sm" variant="default" onClick={() => {
                        if (job.link) window.open(job.link, '_blank');
                      }}>
                        Apply <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                      <Button variant="outline" className="h-8 text-sm">Save</Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>


          {/* RIGHT COLUMN: Mentors & Learning Paths (Original Content) */}
          <div className="space-y-6">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Featured Mentors</h2>
              {/* Mentors list and content remains here */}
              <div className="space-y-4">
                <Card className="p-5 flex items-center gap-4 hover:shadow-soft cursor-pointer">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <div>Priya Sharma - Web Dev</div>
                </Card>
                <Card className="p-5 flex items-center gap-4 hover:shadow-soft cursor-pointer">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <div>Rahul Patel - Data Science</div>
                </Card>
              </div>
              <Button className="w-full mt-4">Find More Mentors</Button>
            </Card>

            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Learning Paths</h2>
              {/* Learning paths content remains here */}
              <div className="space-y-4">
                <Card className="p-4 hover:shadow-soft cursor-pointer">Full Stack Development</Card>
                <Card className="p-4 hover:shadow-soft cursor-pointer">Python for Beginners</Card>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsExchange;