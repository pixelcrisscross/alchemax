import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import CompanyDashboard from "./pages/CompanyDashboard";
import UserLogin from "./pages/UserLogin";
import UserProfileSetup from "./pages/UserProfileSetup";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import PostJob from "./pages/PostJob";
import CommunityMap from "./pages/CommunityMap";
import SkillsExchange from "./pages/SkillsExchange";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/company-login" element={<CompanyLogin />} />
          <Route path="/company-register" element={<CompanyRegister />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-profile-setup" element={<UserProfileSetup />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/community-map" element={<CommunityMap />} />
          <Route path="/skills-exchange" element={<SkillsExchange />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
