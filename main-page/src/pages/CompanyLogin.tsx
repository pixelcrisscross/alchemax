import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Camera, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';
import companyIllustration from "@/assets/company-illustration.jpg";

const CompanyLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Face Auth State
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const isLoadingModels = useRef(false);

  // 1. Load AI Models
  useEffect(() => {
    const loadModels = async () => {
      if (isLoadingModels.current || modelsLoaded) return;
      isLoadingModels.current = true;

      try {
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);

        setModelsLoaded(true);
        console.log("Face API models loaded");
      } catch (error) {
        console.error("Error loading models:", error);
        toast({
          title: "System Error",
          description: "Face detection service unavailable.",
          variant: "destructive"
        });
      } finally {
        isLoadingModels.current = false;
      }
    };
    
    if (step === 2) {
      loadModels();
    }
  }, [step, modelsLoaded, toast]);

  // 2. Handle Credential Check
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user exists in storage
    const storedData = localStorage.getItem(`user_${email}`);
    
    if (!storedData) {
      toast({
        title: "Account Not Found",
        description: "Please register first.",
        variant: "destructive"
      });
      return;
    }

    const user = JSON.parse(storedData);

    if (user.password !== password) {
      toast({
        title: "Invalid Password",
        description: "Please try again.",
        variant: "destructive"
      });
      return;
    }

    // Credentials valid -> Proceed to Face Verification
    setStep(2);
    setIsCameraOpen(true);
    toast({
      title: "Credentials Verified",
      description: "Please verify your identity.",
    });
  };

  // 3. Verify Face Match
  const captureAndVerify = useCallback(async () => {
    if (!webcamRef.current || !modelsLoaded) return;
    setProcessing(true);

    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;

      img.onload = async () => {
        try {
          // Detect live face
          const detection = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            // Retrieve stored face descriptor for THIS user
            const storedData = localStorage.getItem(`user_${email}`);
            if (!storedData) {
               // Should not happen due to step 1 check, but safety first
               setProcessing(false);
               return;
            }
            const user = JSON.parse(storedData);
            
            // Convert stored array back to Float32Array
            const storedDescriptor = new Float32Array(user.faceDescriptor);
            
            // Calculate distance (similarity)
            const distance = faceapi.euclideanDistance(detection.descriptor, storedDescriptor);
            console.log("Face Match Distance:", distance);

            // Threshold: < 0.6 is a match (Lower is better/more similar)
            if (distance < 0.6) {
              toast({
                title: "Identity Verified",
                description: "Login successful!",
              });
              setTimeout(() => navigate("/company-dashboard"), 1000);
            } else {
              toast({
                title: "Verification Failed",
                description: "Face does not match our records for this account.",
                variant: "destructive"
              });
            }
          } else {
            toast({
              title: "No Face Detected",
              description: "Please ensure your face is clearly visible.",
              variant: "destructive"
            });
          }
        } catch (err) {
          console.error(err);
          toast({ title: "Error", description: "Detection failed.", variant: "destructive" });
        } finally {
          setProcessing(false);
        }
      };
    } else {
      setProcessing(false);
    }
  }, [webcamRef, modelsLoaded, navigate, toast, email]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 grid lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
        <div className="relative z-10 animate-fade-in">
          <img 
            src={companyIllustration} 
            alt="Professional team collaboration" 
            className="rounded-2xl shadow-hover w-full max-w-lg"
          />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={() => step === 2 ? setStep(1) : navigate("/")}
            className="mb-6 hover:scale-105 transition-smooth"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === 2 ? "Back to Credentials" : "Back to Home"}
          </Button>

          <Card className="glass-card p-8 hover:shadow-hover transition-smooth">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                {step === 1 ? (
                  <Building2 className="h-8 w-8 text-primary" />
                ) : (
                  <Camera className="h-8 w-8 text-primary" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {step === 1 ? "Company Login" : "Face Verification"}
              </h1>
              <p className="text-muted-foreground">
                {step === 1 ? "Enter your account details" : "Verify it's really you"}
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Company Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="company@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  />
                </div>

                <Button type="submit" className="w-full hover:scale-105 transition-smooth" size="lg">
                  Next: Face Verification
                </Button>
                
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  New company? <span onClick={() => navigate("/company-register")} className="text-primary font-medium cursor-pointer hover:underline">Register here</span>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-6 relative border-2 border-primary/50">
                  {isCameraOpen ? (
                    <>
                       <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          className="w-full h-full object-cover transform scale-x-[-1]"
                          videoConstraints={{ facingMode: "user" }}
                        />
                        <div className="absolute inset-0 border-4 border-white/20 rounded-lg pointer-events-none">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-primary/50 rounded-full"></div>
                        </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                       Camera Off
                    </div>
                  )}
                  
                  {(!modelsLoaded || processing) && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-10">
                       <Loader2 className="h-8 w-8 animate-spin mb-2" />
                       <span className="text-sm font-medium">
                         {!modelsLoaded ? "Loading AI..." : "Matching Face..."}
                       </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setStep(1)}
                    disabled={processing}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={captureAndVerify} 
                    disabled={!modelsLoaded || processing}
                  >
                    Verify & Login
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;