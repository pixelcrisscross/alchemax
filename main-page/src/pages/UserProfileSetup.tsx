import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UserProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");

  // Skills State
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

    if (!email || !password || !fullName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Create User Object
    const userProfile = {
      email,
      password, // In a real app, never store plain-text passwords!
      fullName,
      phone,
      experience,
      skills,
      interests,
      minSalary,
      location,
      availability,
      role: "user"
    };

    // Save to LocalStorage (Key: job_user_[EMAIL])
    localStorage.setItem(`job_user_${email}`, JSON.stringify(userProfile));

    toast({
      title: "Profile Created!",
      description: "Your account is ready. Logging you in...",
    });
    
    // Redirect to Dashboard
    setTimeout(() => navigate("/user-dashboard"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="container mx-auto max-w-3xl py-12 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create User Account</h1>
          <p className="text-muted-foreground">Sign up to discover personalized opportunities</p>
        </div>

        <Card className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Account Credentials Section */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                 <Lock className="h-4 w-4 text-primary" /> Login Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      className="pl-9" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      className="pl-9" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input 
                  id="fullName" 
                  required 
                  className="mt-1" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  required 
                  className="mt-1" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input 
                id="experience" 
                type="number" 
                min="0" 
                className="mt-1" 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="skills">Skills</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="skills"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g., JavaScript, Marketing, Design"
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
              <Label htmlFor="interests">Career Interests</Label>
              <Textarea 
                id="interests" 
                rows={3} 
                className="mt-1"
                placeholder="What type of work are you looking for?"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minSalary">Expected Minimum Salary</Label>
                <Input 
                  id="minSalary" 
                  type="number" 
                  placeholder="₹25,000"
                  className="mt-1" 
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Preferred Location</Label>
                <Input 
                  id="location" 
                  placeholder="City or Region"
                  className="mt-1" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="availability">Availability</Label>
              <Input 
                id="availability" 
                placeholder="e.g., Immediate, 2 weeks notice"
                className="mt-1" 
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />
            </div>

            <div className="flex gap-4 pt-4">
               <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/user-login")}>
                 Cancel
               </Button>
               <Button type="submit" className="flex-1" size="lg" variant="secondary">
                 Register & Login
               </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileSetup;