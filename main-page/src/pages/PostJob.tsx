import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Briefcase, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PostJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Job Posted Successfully!",
      description: "Your job listing is now live",
    });
    setTimeout(() => navigate("/company-dashboard"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="container mx-auto max-w-4xl py-12 animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/company-dashboard")}
          className="mb-6 hover:scale-105 transition-smooth"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="glass-card p-8 hover:shadow-hover transition-smooth">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse-glow">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Post New Job</h1>
              <p className="text-muted-foreground">Reach verified talent in your community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" required className="mt-1" placeholder="e.g., Software Engineer" />
              </div>
              <div>
                <Label htmlFor="type">Job Type *</Label>
                <Input id="type" required className="mt-1" placeholder="Full-time, Part-time, Contract" />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea 
                id="description" 
                rows={6} 
                required
                className="mt-1"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input id="location" required className="mt-1" placeholder="City or Remote" />
              </div>
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Input id="experience" className="mt-1" placeholder="e.g., 2-4 years" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minSalary">Minimum Salary</Label>
                <Input id="minSalary" type="number" className="mt-1" placeholder="₹50,000" />
              </div>
              <div>
                <Label htmlFor="maxSalary">Maximum Salary</Label>
                <Input id="maxSalary" type="number" className="mt-1" placeholder="₹80,000" />
              </div>
            </div>

            <div>
              <Label htmlFor="skills">Required Skills</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="skills"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g., React, Python, Communication"
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="benefits">Benefits & Perks</Label>
              <Textarea 
                id="benefits" 
                rows={3} 
                className="mt-1"
                placeholder="Health insurance, flexible hours, learning opportunities..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 hover:scale-105 transition-smooth" size="lg">
                Post Job
              </Button>
              <Button type="button" variant="outline" className="flex-1" size="lg" onClick={() => navigate("/company-dashboard")}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
