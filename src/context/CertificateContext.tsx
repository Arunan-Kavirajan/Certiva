import {
  createContext,
  useContext,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { FieldPosition } from "../types/certificate";

export type { FieldPosition };

interface CertificateContextType {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;

  sheetFile: File | null;
  setSheetFile: (file: File | null) => void;

  fieldPositions: FieldPosition[];
  setFieldPositions: (positions: FieldPosition[]) => void;
}

const CertificateContext =
  createContext<CertificateContextType | null>(null);

export function CertificateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [sheetFile, setSheetFile] = useState<File | null>(null);
  const [fieldPositions, setFieldPositions] = useState<FieldPosition[]>([]);

  return (
    <CertificateContext.Provider
      value={{
        pdfFile,
        setPdfFile,
        sheetFile,
        setSheetFile,
        fieldPositions,
        setFieldPositions,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificate() {
  const context = useContext(CertificateContext);

  if (!context) {
    throw new Error(
      "useCertificate must be used inside CertificateProvider"
    );
  }

  return context;
}