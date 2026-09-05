import * as Location from "expo-location";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { Cafe } from "@/domain/types";
import { cafes as bundledCafes } from "@/domain/catalog";

import { resolveDeviceLocation, type LocationClient } from "./device-location";
import { fetchNearbyCafes, type Coordinates } from "./places";

export type CafeDataStatus = "loading" | "ready" | "permission-denied" | "location-unavailable" | "config-error" | "service-error";

type CafeContextValue = {
  cafes: Cafe[];
  status: CafeDataStatus;
  error: string | null;
  coordinates: Coordinates | null;
  areaLabel: string;
  dataSource: "live" | "local";
  refresh(): Promise<void>;
  getCafe(id: string): Cafe | undefined;
};

type CafeProviderProps = PropsWithChildren<{
  apiBaseUrl?: string;
  locationClient?: LocationClient;
  loadCafes?: typeof fetchNearbyCafes;
  enabled?: boolean;
}>;

const CafeContext = createContext<CafeContextValue | null>(null);

const expoLocationClient: LocationClient = {
  requestPermission: async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    return { granted: permission.granted, canAskAgain: permission.canAskAgain };
  },
  getPosition: async () => {
    const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: result.coords.latitude, longitude: result.coords.longitude };
  },
};

function serviceMessage(error: unknown): { status: CafeDataStatus; message: string } {
  const code = error instanceof Error ? error.message : "unknown";
  if (code === "missing_api_url") return { status: "config-error", message: "The live café service URL is not configured in this build." };
  if (code === "missing_google_places_key") return { status: "config-error", message: "Google Places is not configured on the SIDEQUEST server." };
  if (code === "google_places_429") return { status: "service-error", message: "Google Places has reached its request limit. Try again shortly." };
  return { status: "service-error", message: "Nearby cafés could not be loaded from Google Places." };
}

export function CafeProvider({
  children,
  apiBaseUrl = process.env.EXPO_PUBLIC_SIDEQUEST_API_URL ?? "",
  locationClient = expoLocationClient,
  loadCafes = fetchNearbyCafes,
  enabled = true,
}: CafeProviderProps) {
  const localCafes = useMemo(() => bundledCafes.map((cafe) => ({ ...cafe, source: "local" as const })), []);
  const [cafes, setCafes] = useState<Cafe[]>(localCafes);
  const [status, setStatus] = useState<CafeDataStatus>(enabled ? "loading" : "ready");
  const [dataSource, setDataSource] = useState<"live" | "local">("local");
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError(null);
    setCafes(localCafes);
    setDataSource("local");
    if (!enabled) { setStatus("ready"); return; }
    const location = await resolveDeviceLocation(locationClient);
    if (location.status === "permission-denied") {
      setStatus("permission-denied");
      setError("Location is off. Showing the bundled Makati café guide.");
      return;
    }
    if (location.status === "unavailable") {
      setStatus("location-unavailable");
      setError("Your location is unavailable. Showing the bundled Makati café guide.");
      return;
    }
    setCoordinates(location.coordinates);
    try {
      const loaded = await loadCafes(apiBaseUrl, location.coordinates);
      setCafes(loaded.length > 0 ? loaded : localCafes);
      setDataSource(loaded.length > 0 ? "live" : "local");
      setStatus("ready");
    } catch (reason) {
      const issue = serviceMessage(reason);
      setStatus(issue.status);
      setError(issue.message);
    }
  }, [apiBaseUrl, enabled, loadCafes, localCafes, locationClient]);

  useEffect(() => { void refresh(); }, [refresh]);

  const value = useMemo<CafeContextValue>(() => ({
    cafes,
    status,
    error,
    coordinates,
    areaLabel: cafes[0]?.neighborhood ?? "Your location",
    dataSource,
    refresh,
    getCafe: (id) => cafes.find((cafe) => cafe.id === id),
  }), [cafes, coordinates, dataSource, error, refresh, status]);

  return <CafeContext.Provider value={value}>{children}</CafeContext.Provider>;
}

export function useCafes(): CafeContextValue {
  const value = useContext(CafeContext);
  if (!value) throw new Error("useCafes must be used inside CafeProvider");
  return value;
}
