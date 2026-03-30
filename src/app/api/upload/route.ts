import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// GET — list existing images from the library
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  configureCloudinary();
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "origonae/products",
      max_results: 100,
      resource_type: "image",
    });
    const images = (result.resources as Array<{ secure_url: string; public_id: string; created_at: string }>).map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
      createdAt: r.created_at,
    }));
    return NextResponse.json({ images });
  } catch (err) {
    logger.error("[Image Library Error]", String(err));
    return NextResponse.json({ error: "Failed to fetch image library" }, { status: 500 });
  }
}

// POST — upload new images
export async function POST(req: NextRequest) {
  configureCloudinary();

  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const files = formData.getAll("files") as File[];
  if (!files.length) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const urls: string[] = [];

  try {
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: `File "${file.name}" exceeds 10MB limit` }, { status: 400 });
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File "${file.name}" has unsupported type "${file.type}". Allowed: JPEG, PNG, WebP, GIF, AVIF.` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const url = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "origonae/products", resource_type: "auto" },
            (error, result) => {
              if (error || !result) reject(error ?? new Error("Upload failed"));
              else resolve(result.secure_url);
            }
          )
          .end(buffer);
      });

      urls.push(url);
    }
  } catch (err) {
    const cloudinaryErr = err as { message?: string; http_code?: number; error?: { message: string } };
    const message = cloudinaryErr?.error?.message || cloudinaryErr?.message || String(err);
    logger.error("[Upload Error]", JSON.stringify(err));
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ urls });
}

// DELETE — remove an image from Cloudinary
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  configureCloudinary();

  let publicId: string;
  try {
    const body = await req.json() as { publicId?: string };
    if (!body.publicId) throw new Error("Missing publicId");
    publicId = body.publicId;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("[Image Delete Error]", String(err));
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
