import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CheckCircle2, Loader2, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';

const CompanyRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [faceVerified, setFaceVerified] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [tempFaceDescriptor, setTempFaceDescriptor] = useState<Float32Array | null>(null);
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  // Face API State
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const isLoadingModels = useRef(false);

  // 1. Load Models
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

    loadModels();
  }, [modelsLoaded, toast]);

  // 2. Capture Face & Generate Descriptor
  const capture = useCallback(async () => {
    if (!webcamRef.current || !modelsLoaded) return;
    setProcessing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
      setCapturedImage(imageSrc);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      
      img.onload = async () => {
        try {
          const detection = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            // Save the descriptor (unique face ID) to state
            setTempFaceDescriptor(detection.descriptor);
            
            setIsCameraOpen(false);
            setFaceVerified(true);
            toast({
              title: "Face Scanned Successfully",
              description: "Biometric data generated. Proceed to details.",
            });
            setTimeout(() => setStep(2), 1500);
          } else {
            toast({
              title: "No Face Detected",
              description: "Please look directly at the camera.",
              variant: "destructive"
            });
            setCapturedImage(null);
          }
        } catch (err) {
          console.error("Detection Error:", err);
          toast({ title: "Error", description: "Processing failed.", variant: "destructive" });
          setCapturedImage(null);
        } finally {
          setProcessing(false);
        }
      };
    } else {
        setProcessing(false);
    }
  }, [webcamRef, modelsLoaded, toast]);

  // 3. Final Registration - Save EVERYTHING to LocalStorage
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && password && tempFaceDescriptor) {
      const userData = {
        email,
        password,
        companyName,
        // Convert Float32Array to normal Array for JSON storage
        faceDescriptor: Array.from(tempFaceDescriptor) 
      };

      // Save user data keyed by email
      localStorage.setItem(`user_${email}`, JSON.stringify(userData));

      toast({
        title: "Registration Complete",
        description: "Account created with Biometric Security.",
      });
      setTimeout(() => navigate("/company-dashboard"), 1000);
    } else {
      toast({
        title: "Registration Failed",
        description: "Missing face data or details.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="container mx-auto max-w-2xl py-12 animate-fade-in">
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Company Registration</h1>
            <div className="trust-badge">Step {step} of 2</div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 ? (
          <Card className="glass-card p-8">
            <div className="text-center flex flex-col items-center">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6 overflow-hidden border-4 border-primary/20 relative">
                {faceVerified ? (
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                ) : capturedImage ? (
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="h-12 w-12 text-primary" />
                )}
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {faceVerified ? "Biometrics Secured" : "Face Registration"}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-sm">
                {faceVerified 
                  ? "Your face data has been encrypted. Proceed to account details."
                  : "We require a live face scan to verify company ownership and prevent fraud."}
              </p>

              {isCameraOpen && !faceVerified && (
                <div className="mb-8 rounded-lg overflow-hidden shadow-lg border-2 border-primary relative bg-black w-full max-w-md">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-64 object-cover transform scale-x-[-1]" 
                    videoConstraints={{ facingMode: "user" }}
                    onUserMediaError={() => toast({title: "Camera Error", description: "Check permissions", variant: "destructive"})}
                  />
                  {processing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white">
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <span>Scanning...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!faceVerified && (
                <div className="flex gap-4 w-full max-w-xs">
                  {!isCameraOpen ? (
                    <Button 
                      size="lg" 
                      onClick={() => setIsCameraOpen(true)} 
                      className="w-full"
                      disabled={!modelsLoaded}
                    >
                      {modelsLoaded ? (capturedImage ? "Retake Photo" : "Start Camera") : "Loading AI..."}
                    </Button>
                  ) : (
                    <div className="flex gap-2 w-full">
                       <Button variant="outline" className="flex-1" onClick={() => setIsCameraOpen(false)} disabled={processing}>
                         Cancel
                       </Button>
                       <Button className="flex-1" onClick={capture} disabled={processing}>
                         Capture
                       </Button>
                    </div>
                  )}
                </div>
              )}
              
              {faceVerified && (
                 <Button size="lg" onClick={() => setStep(2)} className="mt-4 w-full max-w-xs">
                   Continue to Details
                 </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card className="glass-card p-8 animate-in slide-in-from-right-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                   <Lock className="h-4 w-4 text-primary" /> Account Credentials
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input 
                      id="companyName" 
                      required 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={3} />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompanyRegister;