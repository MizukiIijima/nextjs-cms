import "server-only";

import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { prisma } from "./prisma";

export async function getSingleMedia(id: number) {
  return await prisma.media.findUnique({
    where: {
      id,
    },
  });
}

async function saveImage(file: File, directory: string) {
  const ext = file.name.split(".").pop() ?? "png";
  const fileName = `${randomUUID()}.${ext}`;

  const blob = await put(`${directory}/${fileName}`, file, {
    access: "public",
  });

  return {
    fileName,
    url: blob.url,
    mimeType: file.type,
    size: file.size,
  };
}

export async function createMediaFromImage(file: File, directory: string) {
  const savedImage = await saveImage(file, directory);

  const media = await prisma.media.create({
    data: {
      fileName: savedImage.fileName,
      url: savedImage.url,
      mimeType: savedImage.mimeType,
      size: savedImage.size,
    },
  });

  return media.id;
}
