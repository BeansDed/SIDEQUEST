import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

export type ApkRelease = {
  version: string;
  fileName: string;
  downloadPath: string;
  sizeBytes: number;
  sizeLabel: string;
  sha256: string;
};

const versionPattern = /^sidequest-(\d+)\.(\d+)\.(\d+)\.apk$/;

function compareVersions(left: string, right: string): number {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    const difference = rightParts[index] - leftParts[index];
    if (difference !== 0) return difference;
  }
  return 0;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function sha256(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  await new Promise<void>((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", resolve);
  });
  return hash.digest("hex");
}

export async function getApkRelease(downloadsDirectory = join(process.cwd(), "public", "downloads")): Promise<ApkRelease | null> {
  try {
    const entries = await readdir(downloadsDirectory, { withFileTypes: true });
    const releases = entries
      .filter((entry) => entry.isFile())
      .flatMap((entry) => {
        const match = versionPattern.exec(entry.name);
        return match ? [{ fileName: entry.name, version: `${match[1]}.${match[2]}.${match[3]}` }] : [];
      })
      .sort((left, right) => compareVersions(left.version, right.version));
    const release = releases[0];
    if (!release) return null;
    const filePath = join(downloadsDirectory, release.fileName);
    const metadata = await stat(filePath);
    if (!metadata.isFile() || metadata.size === 0) return null;
    return {
      ...release,
      downloadPath: `/downloads/${release.fileName}`,
      sizeBytes: metadata.size,
      sizeLabel: formatBytes(metadata.size),
      sha256: await sha256(filePath),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
