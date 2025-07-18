import fs from 'fs';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function removeFile(filePath: string): Promise<void> {
  await fs.promises.unlink(filePath);
}
