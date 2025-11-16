import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

const LEVEL_SETTINGS = {
  extreme: {
    label: "Extreme",
    saveOptions: { useObjectStreams: true, objectsPerTick: 20 },
  },
  recommended: {
    label: "Recommended",
    saveOptions: { useObjectStreams: true, objectsPerTick: 60 },
  },
  gentle: {
    label: "Gentle",
    saveOptions: { useObjectStreams: false, objectsPerTick: 120 },
  },
};

export const runtime = "nodejs";

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const level = formData.get("level") || "recommended";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalSize = arrayBuffer.byteLength;

    const compressedBytes = await recompressPdf(arrayBuffer, level);
    const compressedBuffer = Buffer.from(compressedBytes);

    return new Response(compressedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name?.replace(/\.pdf$/i, "") || "document"}-compressed.pdf"`,
        "Content-Length": compressedBuffer.length.toString(),
        "X-Original-Size": originalSize.toString(),
        "X-Compressed-Size": compressedBuffer.length.toString(),
        "X-Compression-Level": LEVEL_SETTINGS[level]?.label || LEVEL_SETTINGS.recommended.label,
      },
    });
  } catch (err) {
    console.error("Error compressing PDF:", err);
    return NextResponse.json({ error: "Failed to compress PDF" }, { status: 500 });
  }
};

async function recompressPdf(arrayBuffer, level) {
  const sourceDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const targetDoc = await PDFDocument.create();
  const pageIndices = sourceDoc.getPageIndices();
  const copiedPages = await targetDoc.copyPages(sourceDoc, pageIndices);
  copiedPages.forEach((page) => targetDoc.addPage(page));

  const title = sourceDoc.getTitle();
  const author = sourceDoc.getAuthor();
  const subject = sourceDoc.getSubject();

  if (title) targetDoc.setTitle(title);
  if (author) targetDoc.setAuthor(author);
  if (subject) targetDoc.setSubject(subject);

  targetDoc.setProducer("PDFClub Compressor");
  targetDoc.setCreator(`PDFClub – ${LEVEL_SETTINGS[level]?.label || LEVEL_SETTINGS.recommended.label}`);

  const saveOptions = LEVEL_SETTINGS[level]?.saveOptions || LEVEL_SETTINGS.recommended.saveOptions;
  return targetDoc.save({
    updateFieldAppearances: true,
    useObjectStreams: saveOptions.useObjectStreams,
    objectsPerTick: saveOptions.objectsPerTick,
  });
}
