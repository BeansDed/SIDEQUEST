import { render, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

import type { Cafe } from "@/domain/types";

import { cafes as localCafes } from "@/domain/catalog";
import { CafeProvider, useCafes } from "./cafe-provider";

const realCafe = {
  id: "ChIJ-real",
  name: "Real Café",
  neighborhood: "Makati",
  description: "A real Google listing.",
  image: { uri: "https://example.com/photo" },
  imageAlt: "Real Café",
  vibes: ["warm"],
  useCases: ["solo"],
  amenities: ["Google-verified listing"],
  averagePrice: 300,
  distanceKm: 0.4,
  walkMinutes: 5,
  openNow: true,
  closesAt: "10:00 PM",
  rating: 4.7,
  reviewCount: 40,
  latitude: 14.56,
  longitude: 121.02,
} satisfies Cafe;

function Probe() {
  const { status, cafes, error, dataSource } = useCafes();
  return <Text>{status}:{dataSource}:{cafes[0]?.name ?? error ?? "none"}</Text>;
}

describe("CafeProvider", () => {
  it("loads real cafés using the granted device coordinates", async () => {
    const view = await render(
      <CafeProvider
        apiBaseUrl="https://sidequest.example"
        locationClient={{ requestPermission: async () => ({ granted: true, canAskAgain: true }), getPosition: async () => ({ latitude: 14.56, longitude: 121.02 }) }}
        loadCafes={async () => [realCafe]}
      >
        <Probe />
      </CafeProvider>,
    );

    await waitFor(() => expect(view.getByText("ready:live:Real Café")).toBeTruthy());
  });

  it("keeps discovery useful with honestly labelled local data after permission denial", async () => {
    const view = await render(
      <CafeProvider
        apiBaseUrl="https://sidequest.example"
        locationClient={{ requestPermission: async () => ({ granted: false, canAskAgain: false }), getPosition: async () => ({ latitude: 0, longitude: 0 }) }}
        loadCafes={async () => [realCafe]}
      >
        <Probe />
      </CafeProvider>,
    );

    await waitFor(() => expect(view.getByText(`permission-denied:local:${localCafes[0].name}`)).toBeTruthy());
  });

  it("does not request device location until enabled", async () => {
    const requestPermission = jest.fn(async () => ({ granted: true, canAskAgain: true }));
    const view = await render(
      <CafeProvider enabled={false} locationClient={{ requestPermission, getPosition: async () => ({ latitude: 0, longitude: 0 }) }}>
        <Probe />
      </CafeProvider>,
    );
    expect(requestPermission).not.toHaveBeenCalled();
    expect(view.getByText(`ready:local:${localCafes[0].name}`)).toBeTruthy();
  });
});
