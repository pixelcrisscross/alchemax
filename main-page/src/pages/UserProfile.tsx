import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Award,
  Edit,
  ArrowLeft,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  const userStats = [
    { label: "Profile Views", value: "324", icon: TrendingUp },
    { label: "Applications", value: "12", icon: Briefcase },
    { label: "Saved Jobs", value: "8", icon: Star },
    { label: "Trust Score", value: "98%", icon: Award },
  ];

  const skills = [
    "JavaScript", "React", "Node.js", "Python", "UI/UX Design", 
    "Project Management", "Data Analysis", "Communication"
  ];

  const recentActivity = [
    { action: "Applied to Software Engineer", company: "Tech Solutions Inc", time: "2 hours ago" },
    { action: "Profile viewed by HR Manager", company: "Digital Marketing Co", time: "5 hours ago" },
    { action: "Saved job posting", company: "Green Energy Ltd", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/user-dashboard")}
          className="mb-6 hover:scale-105 transition-smooth"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="glass-card p-8 h-fit animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold">
                PS
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">Priya Sharma</h2>
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <p className="text-muted-foreground mb-2">Software Engineer</p>
              <Badge className="mb-4">Verified Profile</Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>priya.sharma@email.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Bangalore, Karnataka</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>5 years experience</span>
              </div>
            </div>

            <Button className="w-full gap-2 hover:scale-105 transition-smooth">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userStats.map((stat, idx) => (
                <Card 
                  key={idx}
                  className="glass-card p-4 text-center hover:shadow-hover transition-smooth animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-5 w-5 text-primary mr-2" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>

            {/* About */}
            <Card className="glass-card p-6 animate-fade-in">
              <h3 className="text-xl font-bold mb-4">About</h3>
              <p className="text-muted-foreground leading-relaxed">
                Passionate software engineer with 5 years of experience in full-stack development. 
                Specialized in React, Node.js, and cloud technologies. Looking for opportunities 
                to work on innovative projects that make a positive impact on communities.
              </p>
            </Card>

            {/* Skills */}
            <Card className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-xl font-bold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="px-3 py-1 hover:scale-105 transition-smooth cursor-pointer"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trust & Verification */}
            <Card className="glass-card p-6 bg-gradient-to-br from-primary/5 to-secondary/5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Trust & Verification</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-community" />
                  <div>
                    <p className="font-medium">Identity Verified</p>
                    <p className="text-xs text-muted-foreground">Face authentication</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-community" />
                  <div>
                    <p className="font-medium">Skills Verified</p>
                    <p className="text-xs text-muted-foreground">By mentors</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-community" />
                  <div>
                    <p className="font-medium">References</p>
                    <p className="text-xs text-muted-foreground">3 recommendations</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
