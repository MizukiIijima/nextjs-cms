-- Add a required, unique slug to posts while keeping existing rows valid.
ALTER TABLE "Post" ADD COLUMN "slug" TEXT;

UPDATE "Post"
SET "slug" = 'post-' || "id"
WHERE "slug" IS NULL;

ALTER TABLE "Post" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
