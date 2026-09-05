import { router } from "expo-router";

import { ProfileScreen } from "@/features/profile-screen";

export default function ProfileRoute() {
  return (
    <ProfileScreen
      onOpenSettings={() => router.push("/settings")}
      onOpenPlus={() => router.push("/plus")}
      onOpenSocial={() => router.push("/social")}
      onEditProfile={() => router.push("/flow/edit-profile")}
    />
  );
}
