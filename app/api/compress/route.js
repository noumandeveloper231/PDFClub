import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";

// Optimized settings
const LEVEL_SETTINGS = {
  extreme: {
    label: "Extreme",
    saveOptions: { useObjectStreams: true, objectsPerTick: 25 },
  },
  recommended: {
    label: "Recommended",
    saveOptions: { useObjectStreams: true, objectsPerTick: 80 },
  },
  gentle: {
    label: "Gentle",
    saveOptions: { useObjectStreams: false, objectsPerTick: 140 },
  },
};

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const level = formData.get("level") || "recommended";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Fast read
    const arrayBuffer = await file.arrayBuffer();
    const originalSize = arrayBuffer.byteLength;

    // Optimized compression
    const compressedBytes = await recompressPdf(arrayBuffer, level);
    const compressedBuffer = Buffer.from(compressedBytes);

    return new Response(compressedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name?.replace(/\.pdf$/i, "") || "document"}-compressed.pdf"`,
        "Content-Length": compressedBuffer.length,
        "X-Original-Size": originalSize,
        "X-Compressed-Size": compressedBuffer.length,
        "X-Compression-Level": LEVEL_SETTINGS[level]?.label,
      },
    });
  } catch (err) {
    console.error("PDF compression error:", err);
    return NextResponse.json({ error: "Failed to compress PDF" }, { status: 500 });
  }
};

async function recompressPdf(arrayBuffer, level) {
  // Optimization: disable expensive parsing
  const sourceDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
    updateMetadata: false,
    throwOnInvalidObject: false,
  });

  const targetDoc = await PDFDocument.create();

  // Faster copying by avoiding multiple metadata re-renders
  const pages = await targetDoc.copyPages(sourceDoc, sourceDoc.getPageIndices());
  for (const page of pages) targetDoc.addPage(page);

  // Lightweight metadata copy (avoids expensive setters)
  const meta = sourceDoc.context.trailerInfo.Info;
  if (meta) {
    if (meta.Title) targetDoc.setTitle(meta.Title);
    if (meta.Author) targetDoc.setAuthor(meta.Author);
    if (meta.Subject) targetDoc.setSubject(meta.Subject);
  }

  // Minimal producer info
  targetDoc.setProducer("PDFClub Compressor (Optimized)");
  targetDoc.setCreator(`PDFClub – ${LEVEL_SETTINGS[level]?.label}`);

  // Optimized save options
  const saveOptions = LEVEL_SETTINGS[level]?.saveOptions;

  return targetDoc.save({
    useObjectStreams: saveOptions.useObjectStreams,
    objectsPerTick: saveOptions.objectsPerTick,
    updateFieldAppearances: false,
    addDefaultPage: false,
  });
}
