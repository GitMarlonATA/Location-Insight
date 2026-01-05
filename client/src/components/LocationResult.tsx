import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MapPin, Sparkles, Navigation } from "lucide-react";

interface LocationResultProps {
  description: string | null;
  address: string | null;
  isLoading: boolean;
  onClose: () => void;
  coords: { lat: number; lng: number } | null;
}

export function LocationResult({ description, address, isLoading, onClose, coords }: LocationResultProps) {
  if (!isLoading && !description) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[1000] p-4 md:p-6 flex justify-center pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-2xl">
          <Card className="glass-panel overflow-hidden border-0 shadow-2xl shadow-black/20">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2 h-8 w-8 hover:bg-black/5 rounded-full z-10"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                      <Sparkles className="h-10 w-10 text-primary animate-spin-slow relative z-10" />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <h3 className="text-lg font-semibold font-display">Analyzing surroundings...</h3>
                      <p className="text-muted-foreground text-sm">
                        Using AI to identify landmarks, points of interest, and the general vibe of this location.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-primary/5 p-6 md:w-1/3 flex flex-col justify-center border-r border-border/50">
                      <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                        <MapPin className="h-5 w-5" />
                        <span className="text-sm uppercase tracking-wider">Location</span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-foreground mb-4 leading-tight">
                        {address || "Unknown Location"}
                      </h3>
                      {coords && (
                        <div className="text-xs font-mono text-muted-foreground bg-white/50 p-2 rounded border border-border/50 flex items-center gap-2">
                          <Navigation className="h-3 w-3" />
                          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                        </div>
                      )}
                    </div>
                    <div className="p-6 md:w-2/3 bg-white/60">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-600">AI Insight</span>
                      </div>
                      <p className="text-foreground/80 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
