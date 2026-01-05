import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type DescribeLocationRequest } from "@shared/routes";
import { useState, useEffect } from "react";

// ============================================
// API HOOKS
// ============================================

export function useLocationHistory() {
  return useQuery({
    queryKey: [api.location.history.path],
    queryFn: async () => {
      const res = await fetch(api.location.history.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.location.history.responses[200].parse(await res.json());
    },
  });
}

export function useDescribeLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (coords: DescribeLocationRequest) => {
      const res = await fetch(api.location.describe.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coords),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 500) {
           // Try to parse error message if available
           try {
             const error = await res.json();
             throw new Error(error.message || "Failed to describe location");
           } catch {
             throw new Error("Failed to describe location");
           }
        }
        throw new Error("Network error");
      }
      
      return api.location.describe.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.location.history.path] });
    },
  });
}

// ============================================
// BROWSER GEOLOCATION HOOK
// ============================================

interface GeoState {
  coords: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    coords: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState(prev => ({ ...prev, loading: false, error: "Geolocation not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          coords: null,
          error: error.message,
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return state;
}
