import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { getApkRelease } from "./apk-release";

const temporaryDirectories: string[] = [];

async function createDownloadsDirectory() {
  const directory = await mkdtemp(join(tmpdir(), "sidequest-apk-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { force: true, recursive: true })));
});

describe("getApkRelease", () => {
  it("returns null when no verified APK exists", async () => {
    const directory = await createDownloadsDirectory();

    await expect(getApkRelease(directory)).resolves.toBeNull();
  });

  it("returns metadata and a SHA-256 digest for a real APK file", async () => {
    const directory = await createDownloadsDirectory();
    const bytes = Buffer.from("real-apk-test-bytes");
    await writeFile(join(directory, "sidequest-1.2.0.apk"), bytes);

    await expect(getApkRelease(directory)).resolves.toEqual({
      version: "1.2.0",
      fileName: "sidequest-1.2.0.apk",
      downloadPath: "/downloads/sidequest-1.2.0.apk",
      sizeBytes: bytes.byteLength,
      sizeLabel: "19 B",
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  });

  it("selects the newest semantic version rather than the newest filename", async () => {
    const directory = await createDownloadsDirectory();
    await Promise.all([
      writeFile(join(directory, "sidequest-1.9.0.apk"), "older"),
      writeFile(join(directory, "sidequest-1.10.0.apk"), "newer"),
      writeFile(join(directory, "sidequest-latest.apk"), "alias"),
    ]);

    await expect(getApkRelease(directory)).resolves.toMatchObject({ version: "1.10.0", fileName: "sidequest-1.10.0.apk" });
  });
});
