import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { FieldPosition, ColumnMappings, FieldType } from "../types/certificate";

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
  fieldPositions: FieldPosition[],
  columnMappings: ColumnMappings,
  row: { [key: string]: string },
  staticValues: { [key in FieldType]?: string } = {}
): Promise<Blob> {
  const existingPdfBytes = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  const page = pages[0];

  const { width: pdfWidth, height: pdfHeight } = page.getSize();

  const scaleX = pdfWidth / RENDER_WIDTH;
  const scaleY = pdfHeight / (RENDER_WIDTH * (pdfHeight / pdfWidth));

  for (const nameField of fieldPositions) {
    // Use column mapping first, fall back to static value
    const columnName = columnMappings[nameField.field];
    const text = columnName
      ? row[columnName]?.trim()
      : staticValues[nameField.field]?.trim();

    if (!text) continue;

    const canvasX = nameField.x - nameField.width / 2;
    const canvasY = nameField.y - nameField.height / 2;

    const boxLeft = canvasX * scaleX;
    const boxWidth = nameField.width * scaleX;
    const boxBottom = pdfHeight - (canvasY + nameField.height) * scaleY;

    const fontKey = FONT_MAP[nameField.fontFamily] ?? StandardFonts.HelveticaBold;
    const font = await pdfDoc.embedFont(fontKey);

    let finalFontSize = nameField.fontSize * scaleY;
    const minFontSize = nameField.minFontSize * scaleY;

    while (finalFontSize >= minFontSize) {
      const textWidth = font.widthOfTextAtSize(text, finalFontSize);
      if (textWidth <= boxWidth) break;
      finalFontSize--;
    }

    const textWidth = font.widthOfTextAtSize(text, finalFontSize);
    const textY = boxBottom + BASELINE_PADDING * scaleY;

    let textX = boxLeft + BASELINE_PADDING * scaleX;
    if (nameField.align === "center") {
      textX = boxLeft + (boxWidth - textWidth) / 2;
    } else if (nameField.align === "right") {
      textX = boxLeft + boxWidth - textWidth - BASELINE_PADDING * scaleX;
    }

    page.drawText(text, {
      x: textX,
      y: textY,
      size: finalFontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  const savedBytes = await pdfDoc.save();
  const plainBuffer = savedBytes.buffer.slice(
    savedBytes.byteOffset,
    savedBytes.byteOffset + savedBytes.byteLength
  ) as ArrayBuffer;
  return new Blob([plainBuffer], { type: "application/pdf" });
}