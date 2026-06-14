import JSZip from "jszip";
import { generateCertificate } from "./generateCertificate";
import type { FieldPosition, SheetRow, ColumnMappings, FieldType } from "../types/certificate";

export interface GenerationResult {
  succeeded: number;
  failed: { name: string; error: string }[];
}

export async function generateAllCertificates(
  pdfFile: File,
  fieldPositions: FieldPosition[],
  rows: SheetRow[],
  columnMappings: ColumnMappings,
  staticValues: { [key in FieldType]?: string },
  onProgress: (current: number, total: number) => void
): Promise<{ zip: Blob; result: GenerationResult }> {
  const zip = new JSZip();
  const result: GenerationResult = { succeeded: 0, failed: [] };

  const nameColumn = columnMappings["Name"];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = nameColumn ? row[nameColumn]?.trim() : staticValues["Name"]?.trim();
    const fileName = name ? `${name}.pdf` : `Certificate_${i + 1}.pdf`;

    try {
      const blob = await generateCertificate(pdfFile, fieldPositions, columnMappings, row, staticValues);
      const arrayBuffer = await blob.arrayBuffer();
      zip.file(fileName, arrayBuffer);
      result.succeeded++;
    } catch (err) {
      result.failed.push({
        name: name ?? `Row ${i + 1}`,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }

    onProgress(i + 1, rows.length);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return { zip: zipBlob, result };
}