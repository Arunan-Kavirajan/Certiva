import JSZip from "jszip";
import { generateCertificate } from "./generateCertificate";
import type { FieldPosition, SheetRow } from "../types/certificate";

export async function generateAllCertificates(
  pdfFile: File,
  nameField: FieldPosition,
  rows: SheetRow[],
  nameColumn: string,
  onProgress: (current: number, total: number) => void
): Promise<Blob> {
  const zip = new JSZip();

  for (let i = 0; i < rows.length; i++) {
    const name = rows[i][nameColumn]?.trim() || `Participant_${i + 1}`;
    const blob = await generateCertificate(pdfFile, nameField, name);
    const arrayBuffer = await blob.arrayBuffer();
    zip.file(`${name}.pdf`, arrayBuffer);
    onProgress(i + 1, rows.length);
  }

  return zip.generateAsync({ type: "blob" });
}