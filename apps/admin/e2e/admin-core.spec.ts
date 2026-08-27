import { expect, test } from "@playwright/test";

test("overview and primary operations render", async ({ page }) => {
  await page.goto("/overview");
  await expect(page.getByRole("heading", { name: /good afternoon/i })).toBeVisible();
  await page.goto("/cafes");
  await expect(page.getByRole("heading", { name: "Cafés" })).toBeVisible();
  await page.goto("/analytics");
  await expect(page.getByText("Discovery → action")).toBeVisible();
});

test("content workflow publishes a complete café in demo mode", async ({ page }) => {
  await page.goto("/cafes/cafe-soft-hours");
  await page.getByRole("button", { name: "Publish café" }).click();
  await expect(page.getByText("Café published")).toBeVisible();
});

test("moderator records a reasoned resolution", async ({ page }) => {
  await page.goto("/moderation/R-1047");
  await page.getByLabel("Resolution reason").fill("Contains a targeted personal attack.");
  await page.getByRole("button", { name: "Record resolution" }).click();
  await expect(page.getByText(/Resolution recorded/)).toBeVisible();
});
