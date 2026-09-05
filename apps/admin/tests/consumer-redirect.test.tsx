import { describe, expect, it, vi } from "vitest";

import { redirect } from "next/navigation";

import ConsumerLayout from "@/app/(consumer)/app/layout";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

describe("legacy consumer web routes", () => {
  it("redirects the customer website to the native-app landing page", () => {
    ConsumerLayout();

    expect(redirect).toHaveBeenCalledWith("/");
  });
});
