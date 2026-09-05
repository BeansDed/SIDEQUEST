import type { ExpoConfig } from "expo/config";

import staticConfig from "./app.base.json";

export default (): ExpoConfig => {
  const config = staticConfig.expo as ExpoConfig;
  const mapsKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
  return {
    ...config,
    android: {
      ...config.android,
      config: mapsKey ? { googleMaps: { apiKey: mapsKey } } : config.android?.config,
    },
    plugins: [
      ...(config.plugins ?? []),
      ["expo-location", { locationWhenInUsePermission: "Allow SIDEQUEST to use your location to find real cafés near you." }],
    ],
  };
};
