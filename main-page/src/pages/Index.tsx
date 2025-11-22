import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Users, Globe, ShieldCheck, Briefcase, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-community.jpg";
import verificationBadge from "@/assets/verification-badge.png";
import communityMap from "@/assets/community-map.png";
import skillsExchange from "@/assets/skills-exchange.png";

const Index = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");

  const translations = {
    en: {
      title: "Trusted Discovery Platform",
      subtitle: "Connecting Communities. Building Trust. Creating Opportunities.",
      companyLogin: "Company Login",
      userLogin: "User Login",
      companyDesc: "Post jobs, find talent, build your verified presence",
      userDesc: "Discover opportunities, connect with services, grow your career",
      features: [
        { icon: ShieldCheck, title: "Verified Trust", desc: "Face authentication & reputation scores" },
        { icon: Briefcase, title: "Job Discovery", desc: "Personalized opportunities matching your profile" },
        { icon: MapPin, title: "Local Services", desc: "Find nearby essential services & support" },
        { icon: Globe, title: "Community Impact", desc: "Skills exchange, mentorship & growth" },
      ],
      stats: [
        { value: "10K+", label: "Active Users" },
        { value: "2.5K+", label: "Companies" },
        { value: "15K+", label: "Jobs Posted" },
        { value: "95%", label: "Match Rate" },
      ]
    },
    hi: {
      title: "विश्वसनीय खोज मंच",
      subtitle: "समुदायों को जोड़ना। विश्वास बनाना। अवसर सृजन।",
      companyLogin: "कंपनी लॉगिन",
      userLogin: "उपयोगकर्ता लॉगिन",
      companyDesc: "नौकरी पोस्ट करें, प्रतिभा खोजें, अपनी सत्यापित उपस्थिति बनाएं",
      userDesc: "अवसर खोजें, सेवाओं से जुड़ें, अपना करियर बढ़ाएं",
      features: [
        { icon: ShieldCheck, title: "सत्यापित विश्वास", desc: "चेहरा प्रमाणीकरण और प्रतिष्ठा स्कोर" },
        { icon: Briefcase, title: "नौकरी खोज", desc: "आपकी प्रोफ़ाइल से मेल खाते व्यक्तिगत अवसर" },
        { icon: MapPin, title: "स्थानीय सेवाएं", desc: "आस-पास की आवश्यक सेवाएं और समर्थन खोजें" },
        { icon: Globe, title: "सामुदायिक प्रभाव", desc: "कौशल विनिमय, मार्गदर्शन और विकास" },
      ],
      stats: [
        { value: "10K+", label: "सक्रिय उपयोगकर्ता" },
        { value: "2.5K+", label: "कंपनियां" },
        { value: "15K+", label: "पोस्ट की गई नौकरियां" },
        { value: "95%", label: "मिलान दर" },
      ]
    },
    ta: {
      title: "நம்பகமான கண்டுபிடிப்பு தளம்",
      subtitle: "சமூகங்களை இணைத்தல். நம்பிக்கையை உருவாக்குதல். வாய்ப்புகளை உருவாக்குதல்.",
      companyLogin: "நிறுவன உள்நுழைவு",
      userLogin: "பயனர் உள்நுழைவு",
      companyDesc: "வேலைகளை இடுங்கள், திறமையைக் கண்டுபிடியுங்கள், உங்கள் சரிபார்க்கப்பட்ட இருப்பை உருவாக்குங்கள்",
      userDesc: "வாய்ப்புகளைக் கண்டறியுங்கள், சேவைகளுடன் இணையுங்கள், உங்கள் தொழிலை வளர்த்துக் கொள்ளுங்கள்",
      features: [
        { icon: ShieldCheck, title: "சரிபார்க்கப்பட்ட நம்பிக்கை", desc: "முக அங்கீகாரம் & நற்பெயர் மதிப்பெண்கள்" },
        { icon: Briefcase, title: "வேலை கண்டுபிடிப்பு", desc: "உங்கள் சுயவிவரத்துடன் பொருந்தும் தனிப்பயனாக்கப்பட்ட வாய்ப்புகள்" },
        { icon: MapPin, title: "உள்ளூர் சேவைகள்", desc: "அருகிலுள்ள அத்தியாவசிய சேவைகள் & ஆதரவைக் கண்டறியுங்கள்" },
        { icon: Globe, title: "சமூக தாக்கம்", desc: "திறன் பரிமாற்றம், வழிகாட்டுதல் & வளர்ச்சி" },
      ],
      stats: [
        { value: "10K+", label: "செயலில் பயனர்கள்" },
        { value: "2.5K+", label: "நிறுவனங்கள்" },
        { value: "15K+", label: "வேலைகள் இடப்பட்டன" },
        { value: "95%", label: "பொருத்த விகிதம்" },
      ]
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50 flex gap-2 animate-fade-in">
        {["en", "hi", "ta"].map((lang) => (
          <Button
            key={lang}
            variant={language === lang ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage(lang)}
            className="transition-smooth hover:scale-105"
          >
            {lang.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Hero Section with Image */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
        <div className="container mx-auto px-4 pt-20 pb-12 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4 trust-badge animate-pulse-glow">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified & Trusted</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                {t.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2 hover:scale-105 transition-smooth" onClick={() => navigate("/user-login")}>
                  <Users className="h-5 w-5" />
                  Get Started as User
                </Button>
                <Button size="lg" variant="outline" className="gap-2 hover:scale-105 transition-smooth" onClick={() => navigate("/company-login")}>
                  <Building2 className="h-5 w-5" />
                  For Companies
                </Button>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <img 
                src={heroImage} 
                alt="Community connecting through technology" 
                className="rounded-2xl shadow-hover w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-accent/20 to-community/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {t.stats.map((stat, idx) => (
              <Card 
                key={idx} 
                className="glass-card p-6 text-center hover:shadow-hover transition-smooth animate-slide-up group cursor-pointer"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-primary mr-2 group-hover:animate-pulse" />
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Login Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <Card 
              className="group cursor-pointer gradient-card hover:shadow-hover transition-smooth border-2 hover:border-primary/30 animate-slide-up overflow-hidden relative"
              onClick={() => navigate("/company-login")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
              <div className="p-8 text-center relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-smooth group-hover:scale-110">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{t.companyLogin}</h2>
                <p className="text-muted-foreground mb-6">{t.companyDesc}</p>
                <Button className="w-full group-hover:scale-105 transition-smooth" size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </div>
            </Card>

            <Card 
              className="group cursor-pointer gradient-card hover:shadow-hover transition-smooth border-2 hover:border-secondary/30 animate-slide-up overflow-hidden relative"
              style={{ animationDelay: "0.1s" }}
              onClick={() => navigate("/user-login")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
              <div className="p-8 text-center relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-secondary/20 transition-smooth group-hover:scale-110">
                  <Users className="h-10 w-10 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{t.userLogin}</h2>
                <p className="text-muted-foreground mb-6">{t.userDesc}</p>
                <Button className="w-full group-hover:scale-105 transition-smooth" size="lg" variant="secondary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </div>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="max-w-6xl mx-auto">
            <h3 className="text-4xl font-bold text-center mb-4">
              Building Bridges in Your Community
            </h3>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Discover, verify, and connect with opportunities that matter
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {t.features.map((feature, idx) => (
                <Card 
                  key={idx}
                  className="glass-card p-6 hover:shadow-hover transition-smooth animate-scale-in group cursor-pointer"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2 text-lg">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Card>
              ))}
            </div>

            {/* Feature Showcase */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-card p-6 hover:shadow-hover transition-smooth animate-fade-in">
                <img src={verificationBadge} alt="Verification" className="w-24 h-24 mx-auto mb-4" />
                <h4 className="font-bold text-center mb-2">Trust First</h4>
                <p className="text-sm text-muted-foreground text-center">
                  Face verification and reputation scores ensure authentic connections
                </p>
              </Card>
              <Card className="glass-card p-6 hover:shadow-hover transition-smooth animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <img src={communityMap} alt="Community Map" className="w-full h-32 object-cover rounded-lg mb-4" />
                <h4 className="font-bold text-center mb-2">Local First</h4>
                <p className="text-sm text-muted-foreground text-center">
                  Find jobs, services, and resources right in your neighborhood
                </p>
              </Card>
              <Card className="glass-card p-6 hover:shadow-hover transition-smooth animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <img src={skillsExchange} alt="Skills Exchange" className="w-full h-32 object-cover rounded-lg mb-4" />
                <h4 className="font-bold text-center mb-2">Skills Exchange</h4>
                <p className="text-sm text-muted-foreground text-center">
                  Learn from mentors, share knowledge, grow together as a community
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
