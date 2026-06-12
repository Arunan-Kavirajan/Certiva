import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { FieldPosition, SheetRow } from "../types/certificate";

interface CertificateContextType {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;

  sheetFile: File | null;
  setSheetFile: (file: File | null) => void;

  fieldPositions: FieldPosition[];
  setFieldPositions: (positions: FieldPosition[]) => void;

  sheetRows: SheetRow[];
  setSheetRows: (rows: SheetRow[]) => void;

  nameColumn: string;
  setNameColumn: (col: string) => void;

  zipBlob: Blob | null;
  setZipBlob: (blob: Blob | null) => void;
}

const CertificateContext = createContext<CertificateContextType | null>(null);

export function CertificateProvider({ children }: { children: ReactNode }) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [sheetFile, setSheetFile] = useState<File | null>(null);
  const [fieldPositions, setFieldPositions] = useState<FieldPosition[]>([]);
  const [sheetRows, setSheetRows] = useState<SheetRow[]>([]);
  const [nameColumn, setNameColumn] = useState<string>("");
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  return (
    <CertificateContext.Provider
      value={{
        pdfFile,
        setPdfFile,
        sheetFile,
        setSheetFile,
        fieldPositions,
        setFieldPositions,
        sheetRows,
        setSheetRows,
        nameColumn,
        setNameColumn,
        zipBlob,
        setZipBlob,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificate() {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error("useCertificate must be used inside CertificateProvider");
  }
  return context;
}