import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getApkRelease } from "@/lib/apk-release";

import HomePage from "@/app/page";

vi.mock("@/lib/apk-release", () => ({ getApkRelease: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

const releaseMock = vi.mocked(getApkRelease);
const release = {
  version: "1.0.0",
  fileName: "sidequest-1.0.0.apk",
  downloadPath: "/downloads/sidequest-1.0.0.apk",
  sizeBytes: 54_000_000,
  sizeLabel: "51.5 MB",
  sha256: "abc123verifiedhash",
};

describe("SIDEQUEST public landing page", () => {
  beforeEach(() => releaseMock.mockReset());

  it("presents the native mobile product and a verified APK download", async () => {
    releaseMock.mockResolvedValue(release);

    render(await HomePage());

    expect(screen.getByRole("heading", { name: /find a café for your kind of day/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /download.*android/i })[0]).toHaveAttribute("href", "/downloads/sidequest-1.0.0.apk");
    expect(screen.getByText(/version 1\.0\.0/i)).toBeInTheDocument();
    expect(screen.getAllByText(/51\.5 MB/i)).toHaveLength(2);
    expect(screen.getByText(/abc123verifiedhash/i)).toBeInTheDocument();
    expect(screen.getByText(/verified development build/i)).toBeInTheDocument();
    expect(screen.getByText(/signed for direct device testing/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /staff login/i })).toHaveAttribute("href", "/login");
  });

  it("changes the passport destination when a mood is selected", async () => {
    releaseMock.mockResolvedValue(release);

    render(await HomePage());
    fireEvent.click(screen.getByRole("button", { name: "Creative" }));

    expect(screen.getByRole("heading", { name: "Draft & Drip", level: 2 })).toBeVisible();
    expect(screen.getByText(/make one tiny thing/i)).toBeVisible();
  });

  it("explains the product before repeating the download action", async () => {
    releaseMock.mockResolvedValue(release);

    render(await HomePage());

    expect(screen.getByRole("heading", { name: "Choose the feeling." })).toBeVisible();
    expect(screen.getByRole("heading", { name: /what the app actually does/i })).toBeVisible();
    expect(screen.getAllByRole("link", { name: /download.*android/i })).toHaveLength(2);
  });

  it("shows an honest unavailable state instead of a fake APK link", async () => {
    releaseMock.mockResolvedValue(null);

    render(await HomePage());

    expect(screen.getByText(/android build is being prepared/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /download sidequest for android/i })).toBeNull();
  });
});
