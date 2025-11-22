import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Filter,
  ArrowLeft,
  Loader2,
  Search,
  Briefcase // <--- Added missing import
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Core Leaflet Imports
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Marker Icon Fix ---
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Interface
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  source: string;
  verified: boolean;
  type?: string;
  coords?: { lat: number; lng: number };
  link?: string;
}

const CommunityMap = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Refs for Leaflet
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Mock Coordinates Generator
  const getMockCoordinates = (index: number, baseLat: number, baseLng: number) => {
    return {
      lat: baseLat + (Math.random() - 0.5) * 0.08,
      lng: baseLng + (Math.random() - 0.5) * 0.08
    };
  };

  // 1. Fetch Data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://backend-search.vercel.app/api/jobs');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const BANGALORE_LAT = 12.9716;
          const BANGALORE_LNG = 77.5946;
          
          const jobsWithCoords = data.data.map((job: Job, idx: number) => ({
            ...job,
            coords: getMockCoordinates(idx, BANGALORE_LAT, BANGALORE_LNG)
          }));
          setJobs(jobsWithCoords);
        } else {
           setJobs([]);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // 2. Initialize Map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView([12.9716, 77.5946], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Filter jobs based on search term (applies to list AND map)
  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Update Markers
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredJobs.forEach((job) => {
      if (job.coords) {
        const marker = L.marker([job.coords.lat, job.coords.lng], { icon: DefaultIcon });
        
        const popupContent = `
          <div style="min-width: 160px; font-family: sans-serif;">
            <h3 style="margin:0; font-size:14px; font-weight:600; color:#1e293b;">${job.title}</h3>
            <p style="margin:2px 0 6px; font-size:12px; color:#64748b;">${job.company}</p>
            <div style="display:flex; gap:4px; align-items:center;">
              <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:10px; border:1px solid #e2e8f0;">${job.source}</span>
              ${job.verified ? '<span style="background:#dcfce7; color:#166534; padding:2px 6px; border-radius:4px; font-size:10px; border:1px solid #bbf7d0;">Verified</span>' : ''}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersLayerRef.current?.addLayer(marker);
      }
    });
  }, [filteredJobs]);

  const flyToJob = (coords: { lat: number, lng: number }) => {
    mapRef.current?.flyTo([coords.lat, coords.lng], 14, {
      duration: 1.5
    });
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Header & Search Bar */}
      <div className="bg-white border-b p-4 shadow-sm z-20 shrink-0">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
           
           {/* Left: Title & Back */}
           <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-slate-100">
               <ArrowLeft className="h-5 w-5 text-slate-600" />
             </Button>
             <div>
               <h1 className="text-xl font-bold text-slate-800">Job Map</h1>
               <p className="text-xs text-slate-500">
                 {loading ? "Loading data..." : `${filteredJobs.length} jobs found in this area`}
               </p>
             </div>
           </div>

           {/* Right: Unified Search Bar */}
           <div className="relative w-full max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input 
               placeholder="Search by job title, company, or location..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary"
             />
             <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-primary">
               <Filter className="h-4 w-4" />
             </Button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar (Scrollable Job List) */}
        <div className="w-full md:w-96 bg-white border-r flex flex-col z-10 shadow-lg md:shadow-none absolute md:relative h-full transition-transform translate-x-0">
           <div className="p-3 bg-slate-50 border-b text-xs font-medium text-slate-500 uppercase tracking-wider">
             Results List
           </div>
           
           {/* Scrollable Container */}
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {loading ? (
               <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                 <Loader2 className="animate-spin h-8 w-8 mb-2" />
                 <p className="text-sm">Scanning area...</p>
               </div>
             ) : filteredJobs.length === 0 ? (
               <div className="text-center py-10 px-4">
                  <div className="bg-slate-100 p-3 rounded-full w-fit mx-auto mb-3">
                    <Search className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700">No jobs found</h3>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your search or map area.</p>
               </div>
             ) : (
               filteredJobs.map((job, idx) => (
                 <Card 
                   key={job.id || idx} 
                   className="p-4 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group border-slate-200"
                   onClick={() => job.coords && flyToJob(job.coords)}
                 >
                   <div className="flex justify-between items-start mb-1">
                     <h3 className="font-semibold text-slate-800 group-hover:text-primary line-clamp-1 transition-colors">
                       {job.title}
                     </h3>
                     {job.verified && (
                       <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                         Verified
                       </Badge>
                     )}
                   </div>
                   
                   <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
                     <Briefcase className="h-3 w-3" />
                     {job.company}
                   </div>

                   <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                     <div className="flex items-center gap-1 text-xs text-slate-500">
                       <MapPin className="h-3 w-3" /> 
                       <span className="truncate max-w-[120px]">{job.location}</span>
                     </div>
                     <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                       {job.source}
                     </span>
                   </div>
                 </Card>
               ))
             )}
           </div>
        </div>

        {/* Map Area (Static Position, Interactive) */}
        <div className="flex-1 relative bg-slate-200">
           <div 
             ref={mapContainerRef} 
             className="absolute inset-0 h-full w-full z-0"
           />
           
           {/* Floating Legend / Info (Optional) */}
           <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border border-slate-200 text-xs space-y-2">
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-blue-500 block"></span>
               <span className="text-slate-600">Job Location</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
               <span className="text-slate-600">Verified Partner</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CommunityMap;
