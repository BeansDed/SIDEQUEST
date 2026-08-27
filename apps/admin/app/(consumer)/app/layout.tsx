import type { Metadata } from "next";

import { ConsumerShell } from "@/features/consumer/consumer-shell";
import { ConsumerProvider } from "@/features/consumer/consumer-store";

export const metadata: Metadata = {
  title: "Café discovery",
  description: "Find cafés by vibe, budget, purpose, and sidequest.",
};

export default function ConsumerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ConsumerProvider><ConsumerShell>{children}</ConsumerShell></ConsumerProvider>;
}
