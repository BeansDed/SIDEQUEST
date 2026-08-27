import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/app");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("consumer home and bottom navigation are mobile-ready", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Good afternoon, Mika." })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Consumer navigation" })).toBeVisible();
  const navPosition = await page.getByRole("navigation", { name: "Consumer navigation" }).evaluate((node) => getComputedStyle(node).position);
  expect(navPosition).toBe("absolute");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("user filters, saves, and finds a café in collections", async ({ page }) => {
  await page.goto("/app/discover");
  await page.getByRole("button", { name: "Garden" }).click();
  await expect(page.getByRole("heading", { name: "Morrow Coffee" })).toBeVisible();
  await page.getByRole("button", { name: "Save Morrow Coffee" }).click();
  await page.getByRole("link", { name: "Saved" }).click();
  await expect(page.getByText("Morrow Coffee")).toBeVisible();
});

test("user completes a quest and receives XP", async ({ page }) => {
  await page.goto("/app/quests/study-sprint");
  await page.getByRole("button", { name: "Start sidequest" }).click();
  await page.getByRole("button", { name: "Mark step complete" }).click();
  await page.getByRole("button", { name: "Mark step complete" }).click();
  await page.getByRole("button", { name: "Mark step complete" }).click();
  await expect(page.getByRole("heading", { name: "Sidequest complete." })).toBeVisible();
  await expect(page.getByText("+120 XP earned · 1,960 XP total")).toBeVisible();
});
