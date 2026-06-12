import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import PdfViewer from "../components/pdf/PdfViewer";
import { useCertificate } from "../context/CertificateContext";
import type { FieldPosition } from "../types/certificate";
import { generateCertificate } from "../utils/generateCertificate";

export default function TemplateEditorPage() {
  const navigate = useNavigate();
  const {
    pdfFile,
    sheetFile,
    fieldPositions,
    setFieldPositions,
    sheetRows,
    setSheetRows,
    nameColumn,
    setNameColumn,
  } = useCertificate();

  const [columns, setColumns] = useState<string[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!sheetFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<{ [key: string]: string }>(sheet, {
        defval: "",
      });

      if (rows.length === 0) return;

      const headers = Object.keys(rows[0]);
      setColumns(headers);
      setSheetRows(rows);

      if (!nameColumn && headers.length > 0) {
        setNameColumn(headers[0]);
      }
    };

    reader.readAsArrayBuffer(sheetFile);
  }, [sheetFile]);

  const handleFieldChange = (updated: FieldPosition) => {
    setFieldPositions([updated]);
  };

  const handlePreview = async () => {
    if (!pdfFile || fieldPositions.length === 0 || !nameColumn || sheetRows.length === 0) return;

    setIsGenerating(true);

    try {
      const nameField = fieldPositions[0];
      const firstName = sheetRows[0][nameColumn] ?? "Unknown";
      const blob = await generateCertificate(pdfFile, nameField, firstName);
      const url = URL.createObjectURL(blob);

      if (previewUrl) URL.revokeObjectURL(previewUrl);

      setPreviewUrl(url);
      setIsPreviewMode(true);
    } catch (err) {
      console.error("Preview generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToEditor = () => {
    setIsPreviewMode(false);
  };

  const canPreview =
    pdfFile &&
    fieldPositions.length > 0 &&
    nameColumn &&
    sheetRows.length > 0;

  if (!pdfFile) {
    return <div className="p-6">No PDF uploaded.</div>;
  }

  if (isPreviewMode && previewUrl) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToEditor}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            ← Back to Editor
          </button>
          <h1 className="text-2xl font-bold">Preview</h1>
          <span className="text-sm text-gray-500">
            Showing certificate for:{" "}
            <span className="font-medium text-gray-700">
              {sheetRows[0]?.[nameColumn] ?? "—"}
            </span>
          </span>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden inline-block">
          <iframe
            src={previewUrl}
            className="block"
            style={{ width: 900, height: 640, border: "none" }}
            title="Certificate Preview"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Template Editor</h1>

      <div className="bg-white p-4 rounded-xl shadow inline-block">
        <PdfViewer
          file={pdfFile}
          selectedField="Name"
          fieldPositions={fieldPositions}
          onFieldChange={handleFieldChange}
          onFieldDelete={() => setFieldPositions([])}
        />
      </div>

      {sheetFile && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow inline-block min-w-96">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Spreadsheet Mapping
          </h2>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Name column
            </label>

            {columns.length > 0 ? (
              <select
                value={nameColumn}
                onChange={(e) => setNameColumn(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-gray-400">Parsing sheet...</span>
            )}
          </div>

          {nameColumn && sheetRows.length > 0 && (
            <p className="mt-3 text-xs text-gray-400">
              {sheetRows.length} rows found — first name:{" "}
              <span className="font-medium text-gray-600">
                {sheetRows[0][nameColumn] ?? "—"}
              </span>
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handlePreview}
          disabled={!canPreview || isGenerating}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isGenerating ? "Generating..." : "Preview Certificate"}
        </button>

        <button
          onClick={() => navigate("/generating")}
          disabled={!canPreview}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Generate All
        </button>
      </div>

      {!canPreview && (
        <p className="mt-2 text-xs text-gray-400">
          {!fieldPositions.length
            ? "Draw the Name box on the certificate first."
            : !nameColumn || !sheetRows.length
              ? "Upload a spreadsheet and select the Name column."
              : ""}
        </p>
      )}
    </div>
  );
}