import type { Coordinates } from "./places";

export type LocationClient = {
  requestPermission(): Promise<{ granted: boolean; canAskAgain: boolean }>;
  getPosition(): Promise<Coordinates>;
};

export type DeviceLocationResult =
  | { status: "ready"; coordinates: Coordinates }
  | { status: "permission-denied"; canAskAgain: boolean }
  | { status: "unavailable" };

export async function resolveDeviceLocation(client: LocationClient): Promise<DeviceLocationResult> {
  const permission = await client.requestPermission();
  if (!permission.granted) return { status: "permission-denied", canAskAgain: permission.canAskAgain };
  try {
    return { status: "ready", coordinates: await client.getPosition() };
  } catch {
    return { status: "unavailable" };
  }
}
