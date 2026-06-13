import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { FieldPosition } from "../types/certificate";

const RENDER_WIDTH = 800;
const BASELINE_PADDING = 10;

const FONT_MAP: { [key: string]: string } = {
  "Helvetica": StandardFonts.Helvetica,
  "Helvetica-Bold": StandardFonts.HelveticaBold,
  "Times-Roman": StandardFonts.TimesRoman,
  "Courier": StandardFonts.Courier,
};

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

  const boxLeft = canvasX * scaleX;
  const boxWidth = nameField.width * scaleX;

  // In pdf-lib, Y=0 is bottom of page. 
  // Box bottom in PDF units:
  const boxBottom = pdfHeight - (canvasY + nameField.height) * scaleY;

  const fontKey = FONT_MAP[nameField.fontFamily] ?? StandardFonts.HelveticaBold;
  const font = await pdfDoc.embedFont(fontKey);

  // Scale font size from canvas to PDF units
  let finalFontSize = nameField.fontSize * scaleY;
  const minFontSize = nameField.minFontSize * scaleY;

  while (finalFontSize >= minFontSize) {
    const textWidth = font.widthOfTextAtSize(name, finalFontSize);
    if (textWidth <= boxWidth) break;
    finalFontSize--;
  }

  const textWidth = font.widthOfTextAtSize(name, finalFontSize);

  // Match canvas: text baseline sits BASELINE_PADDING above box bottom
  // pdf-lib draws from baseline, so textY = boxBottom + BASELINE_PADDING scaled
  const textY = boxBottom + BASELINE_PADDING * scaleY;

  // Horizontal alignment — same logic as canvas
  let textX = boxLeft + BASELINE_PADDING * scaleX;
  if (nameField.align === "center") {
    textX = boxLeft + (boxWidth - textWidth) / 2;
  } else if (nameField.align === "right") {
    textX = boxLeft + boxWidth - textWidth - BASELINE_PADDING * scaleX;
  }

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
  return new Blob([plainBuffer], { type: "application/pdf" });
}