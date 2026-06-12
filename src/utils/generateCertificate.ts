import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { FieldPosition } from "../types/certificate";

const RENDER_WIDTH = 800;
const BASELINE_PADDING = 10;

export async function generateCertificate(
  pdfFile: File,
  nameField: FieldPosition,
  name: string
): Promise<Blob> {
  const existingPdfBytes = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  const page = pages[0];

  const { width: pdfWidth, height: pdfHeight } = page.getSize();

  const scaleX = pdfWidth / RENDER_WIDTH;
  const scaleY = pdfHeight / (RENDER_WIDTH * (pdfHeight / pdfWidth));

  const canvasX = nameField.x - nameField.width / 2;
  const canvasY = nameField.y - nameField.height / 2;

  const pdfX = canvasX * scaleX;
  const pdfY = pdfHeight - (canvasY + nameField.height) * scaleY;

  const boxWidth = nameField.width * scaleX;

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let finalFontSize = nameField.fontSize;
  const minSize = nameField.minFontSize;

  while (finalFontSize >= minSize) {
    const textWidth = font.widthOfTextAtSize(name, finalFontSize);
    if (textWidth <= boxWidth) break;
    finalFontSize--;
  }

  const textWidth = font.widthOfTextAtSize(name, finalFontSize);

  const textX = pdfX + (boxWidth - textWidth) / 2;
  const textY = pdfY + BASELINE_PADDING * scaleY;

  page.drawText(name, {
    x: textX,
    y: textY,
    size: finalFontSize,
    font,
    color: rgb(0, 0, 0),
  });

  const savedBytes = await pdfDoc.save();
  const plainBuffer = savedBytes.buffer.slice(
    savedBytes.byteOffset,
    savedBytes.byteOffset + savedBytes.byteLength
  ) as ArrayBuffer;
  const blob = new Blob([plainBuffer], { type: "application/pdf" });
  return blob;
}