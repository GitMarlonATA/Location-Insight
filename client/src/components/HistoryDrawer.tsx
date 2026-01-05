import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History, MapPin, Clock } from "lucide-react";
import { useLocationHistory } from "@/hooks/use-location";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function HistoryDrawer() {
  const { data: history, isLoading } = useLocationHistory();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="glass" size="icon" className="h-12 w-12 rounded-full shadow-xl">
          <History className="h-5 w-5 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] sm:w-[400px] border-r border-border/50 backdrop-blur-xl bg-background/95">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold font-display">Discovery Log</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 w-full bg-muted/50 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : history?.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No locations explored yet.</p>
              </div>
            ) : (
              history?.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.createdAt ? format(new Date(item.createdAt), "MMM d, h:mm a") : "Just now"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground line-clamp-1 mb-1">
                    {item.address || `${parseFloat(item.latitude).toFixed(4)}, ${parseFloat(item.longitude).toFixed(4)}`}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
