import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import { useGeolocation, useDescribeLocation } from "@/hooks/use-location";
import { Button } from "@/components/ui/button";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { LocationResult } from "@/components/LocationResult";
import { Wand2, Navigation, Loader2, Map as MapIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons in React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Override the default icon type
const DefaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map clicks and centering
function MapController({ 
  center, 
  onLocationSelect 
}: { 
  center: { lat: number; lng: number } | null, 
  onLocationSelect: (lat: number, lng: number) => void 
}) {
  const map = useMap();
  
  // Fly to location when center changes
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [center, map]);

  // Handle map clicks
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function Home() {
  const { coords: geoCoords, loading: geoLoading, error: geoError } = useGeolocation();
  const describeMutation = useDescribeLocation();
  
  // State for the selected location (marker position)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // State for the description result
  const [result, setResult] = useState<{ description: string; address?: string } | null>(null);

  // Initialize selected location when geolocation is found
  useEffect(() => {
    if (geoCoords && !selectedLocation) {
      setSelectedLocation(geoCoords);
    }
  }, [geoCoords]);

  // Handle errors
  useEffect(() => {
    if (geoError) {
      toast({
        variant: "destructive",
        title: "Location Error",
        description: geoError,
      });
    }
    if (describeMutation.error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: describeMutation.error.message,
      });
    }
  }, [geoError, describeMutation.error]);

  const handleDescribe = () => {
    if (!selectedLocation) return;
    
    describeMutation.mutate(
      { latitude: selectedLocation.lat, longitude: selectedLocation.lng },
      {
        onSuccess: (data) => {
          setResult({
            description: data.description,
            address: data.address
          });
        }
      }
    );
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setResult(null); // Clear previous result when moving
  };

  const handleRecenter = () => {
    if (geoCoords) {
      setSelectedLocation(geoCoords);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-muted">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-[500] pointer-events-none flex justify-between items-start">
        <div className="pointer-events-auto">
          <HistoryDrawer />
        </div>
        
        <div className="pointer-events-auto bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-lg flex items-center gap-2">
          <MapIcon className="h-4 w-4 text-primary" />
          <span className="font-display font-bold text-lg text-foreground tracking-tight">Geo<span className="text-primary">Scope</span></span>
        </div>

        <div className="pointer-events-auto">
          {/* Placeholder for future right-side controls */}
        </div>
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[51.505, -0.09]} // Default start (London)
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController 
            center={selectedLocation} 
            onLocationSelect={handleLocationSelect} 
          />
          
          {selectedLocation && (
            <Marker 
              position={[selectedLocation.lat, selectedLocation.lng]} 
              icon={DefaultIcon}
            />
          )}
        </MapContainer>
      </div>

      {/* Center Action Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-4 w-full max-w-sm px-4">
        {selectedLocation && !result && !describeMutation.isPending && (
          <Button 
            size="lg" 
            className="w-full shadow-xl shadow-primary/25 rounded-2xl h-14 text-lg font-semibold animate-in slide-in-from-bottom-4 fade-in duration-500"
            onClick={handleDescribe}
          >
            <Wand2 className="mr-2 h-5 w-5" />
            Analyze Surroundings
          </Button>
        )}
      </div>

      {/* Location Loading/Waiting State Overlay */}
      {geoLoading && !selectedLocation && (
        <div className="absolute inset-0 z-[1000] bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <Card className="p-8 flex flex-col items-center space-y-4 shadow-2xl">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <h2 className="text-xl font-display font-bold">Locating you...</h2>
            <p className="text-muted-foreground text-center max-w-xs">
              Please allow location access to explore your surroundings.
            </p>
          </Card>
        </div>
      )}

      {/* Recenter FAB */}
      <div className="absolute bottom-8 right-8 z-[500]">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={handleRecenter}
          disabled={!geoCoords}
        >
          <Navigation className={`h-5 w-5 ${!geoCoords ? 'opacity-50' : ''}`} />
        </Button>
      </div>

      {/* Result Card Overlay */}
      <LocationResult 
        description={result?.description ?? null}
        address={result?.address ?? null}
        isLoading={describeMutation.isPending}
        onClose={() => setResult(null)}
        coords={selectedLocation}
      />
    </div>
  );
}
