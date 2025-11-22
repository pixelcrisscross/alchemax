import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  PlusCircle,
  Search,
  Filter,
  BarChart3,
  Building2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    { label: "Active Jobs", value: "12", icon: Briefcase, color: "text-primary" },
    { label: "Total Applicants", value: "247", icon: Users, color: "text-secondary" },
    { label: "Verified Candidates", value: "189", icon: CheckCircle, color: "text-community" },
    { label: "Interviews Scheduled", value: "23", icon: Clock, color: "text-warmth" },
  ];

  const recentApplicants = [
    { name: "Priya Sharma", role: "Software Engineer", verified: true, status: "shortlisted", match: 92 },
    { name: "Arjun Patel", role: "Data Analyst", verified: true, status: "new", match: 88 },
    { name: "Meera Kumar", role: "Product Manager", verified: true, status: "interview", match: 95 },
    { name: "Rahul Singh", role: "UX Designer", verified: false, status: "review", match: 78 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse-glow">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Company Dashboard</h1>
                <p className="text-muted-foreground">Manage your hiring pipeline and discover top talent</p>
              </div>
            </div>
            <Button size="lg" className="gap-2 hover:scale-105 transition-smooth" onClick={() => navigate("/post-job")}>
              <PlusCircle className="h-5 w-5" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card 
              key={idx} 
              className="glass-card p-6 hover:shadow-hover transition-smooth animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Applicants List */}
          <Card className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Applicants</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {recentApplicants.map((applicant, idx) => (
                <Card key={idx} className="p-4 hover:shadow-soft transition-smooth border-2 hover:border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center font-bold text-lg">
                        {applicant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{applicant.name}</h3>
                          {applicant.verified && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{applicant.role}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium">{applicant.match}% Match</span>
                      </div>
                      <Badge variant={
                        applicant.status === "shortlisted" ? "default" :
                        applicant.status === "interview" ? "secondary" : "outline"
                      }>
                        {applicant.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Briefcase className="h-5 w-5 mr-3" />
                View All Jobs
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Users className="h-5 w-5 mr-3" />
                Applicant Pool
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <CheckCircle className="h-5 w-5 mr-3" />
                Verified Talent
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Clock className="h-5 w-5 mr-3" />
                Scheduled Interviews
              </Button>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
              <h3 className="font-semibold mb-2">Hiring Tips</h3>
              <p className="text-sm text-muted-foreground">
                Verified profiles have 3x higher response rates. Enable face verification in your job posts!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
