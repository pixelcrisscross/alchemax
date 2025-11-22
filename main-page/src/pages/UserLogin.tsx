import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import userDiscovery from "@/assets/user-discovery.jpg";

const UserLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Retrieve User Data from LocalStorage
    const storedData = localStorage.getItem(`job_user_${email}`);
    
    if (!storedData) {
      toast({
        title: "Account Not Found",
        description: "No account found with this email. Please create an account.",
        variant: "destructive"
      });
      return;
    }

    const user = JSON.parse(storedData);

    // 2. Verify Password
    if (user.password === password) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.fullName}!`,
      });
      // 3. Redirect to Dashboard
      setTimeout(() => navigate("/user-dashboard"), 1000);
    } else {
      toast({
        title: "Login Failed",
        description: "Incorrect password. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 grid lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6 hover:scale-105 transition-smooth"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card className="glass-card p-8 hover:shadow-hover transition-smooth">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">User Login</h1>
              <p className="text-muted-foreground">Discover opportunities in your community</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 transition-smooth focus:scale-[1.02]"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 transition-smooth focus:scale-[1.02]"
                />
              </div>

              <Button type="submit" className="w-full hover:scale-105 transition-smooth" size="lg" variant="secondary">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              New user?{" "}
              <span 
                onClick={() => navigate("/user-profile-setup")} 
                className="text-secondary font-medium cursor-pointer hover:underline"
              >
                Create account
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-community/10" />
        <div className="relative z-10 animate-fade-in">
          <img 
            src={userDiscovery} 
            alt="Career discovery opportunities" 
            className="rounded-2xl shadow-hover w-full max-w-lg"
          />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-secondary/30 to-community/30 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default UserLogin;