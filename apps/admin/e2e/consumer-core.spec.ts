import { expect, test } from "@playwright/test";

test("legacy consumer routes resolve to the native-app landing page", async ({ page }) => {
  await page.goto("/app");

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Find a café for your kind of day." })).toBeVisible();
  await expect(page.getByRole("link", { name: /staff login/i })).toBeVisible();
});

test("nested consumer routes cannot expose the retired web app", async ({ page }) => {
  await page.goto("/app/discover");

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Consumer navigation" })).toHaveCount(0);
});

test("landing page provides the verified Android release without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  const download = page.getByRole("link", { name: /download sidequest for android/i }).first();
  await expect(download).toBeVisible();
  await expect(download).toHaveAttribute("href", /\/downloads\/sidequest-\d+\.\d+\.\d+\.apk$/);
  await expect(page.getByText(/verified development build/i)).toBeVisible();

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(0);
});

test("recommendation passport works by keyboard", async ({ page }) => {
  await page.goto("/");

  const creative = page.getByRole("button", { name: "Creative" });
  await creative.focus();
  await page.keyboard.press("Enter");

  await expect(creative).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "Draft & Drip", level: 2 })).toBeVisible();
});

test("landing remains usable at 320 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(0);
  await expect(page.getByRole("link", { name: /download sidequest for android/i }).first()).toBeVisible();
});
