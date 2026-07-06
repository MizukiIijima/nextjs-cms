import { getSession } from "@/src/lib/auth/session";
import { createMediaFromImage, getSingleMedia } from "@/src/lib/medias";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "認証が必要です" }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return Response.json(
        { error: "画像を選択してください" },
        { status: 400 },
      );
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
      return Response.json(
        { error: "対応していないファイルです。" },
        { status: 400 },
      );
    }

    const mediaId = await createMediaFromImage(image, "posts");
    const media = await getSingleMedia(mediaId);

    if (!media) {
      throw new Error("保存した画像が見つかりません");
    }

    return Response.json({ url: media.url }, { status: 201 });
  } catch (error) {
    console.error("画像のアップロードに失敗しました", error);

    return Response.json(
      { error: "画像のアップロードに失敗しました" },
      { status: 500 },
    );
  }
}
