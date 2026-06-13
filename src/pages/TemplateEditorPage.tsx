import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import PdfViewer from "../components/pdf/PdfViewer";
import { useCertificate } from "../context/CertificateContext";
import type { FieldPosition } from "../types/certificate";
import { generateCertificate } from "../utils/generateCertificate";
import Navbar from "../components/shared/Navbar";

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
    if (!pdfFile) navigate("/");
  }, []);

  useEffect(() => {
    if (!sheetFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<{ [key: string]: string }>(sheet, { defval: "" });
      if (rows.length === 0) return;
      const headers = Object.keys(rows[0]);
      setColumns(headers);
      setSheetRows(rows);
      if (!nameColumn && headers.length > 0) setNameColumn(headers[0]);
    };
    reader.readAsArrayBuffer(sheetFile);
  }, [sheetFile]);

  const handleFieldChange = (updated: FieldPosition) => setFieldPositions([updated]);

  const handlePreview = async () => {
    if (!pdfFile || fieldPositions.length === 0 || !nameColumn || sheetRows.length === 0) return;
    setIsGenerating(true);
    try {
      const blob = await generateCertificate(pdfFile, fieldPositions[0], sheetRows[0][nameColumn] ?? "Unknown");
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

  const canPreview = !!(pdfFile && fieldPositions.length > 0 && nameColumn && sheetRows.length > 0);

  if (!pdfFile) return null;

  // ---- Preview Mode ----
  if (isPreviewMode && previewUrl) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F7F4EE", display: "flex", flexDirection: "column" }}>
        <Navbar activeStep={1} />
        <div style={{ padding: "32px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <button
              onClick={() => setIsPreviewMode(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #DDD5C4",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "#5C4A2A",
                cursor: "pointer",
              }}
            >
              ← Back to Editor
            </button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#2C1F0E", margin: 0 }}>
                Certificate Preview
              </h1>
              <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>
                Showing for{" "}
                <span style={{ fontWeight: 600, color: "#5C4A2A" }}>
                  {sheetRows[0]?.[nameColumn] ?? "—"}
                </span>
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            overflow: "hidden",
            display: "inline-block",
            boxShadow: "0 4px 24px rgba(44, 31, 14, 0.08)",
            border: "1px solid #EFE9DA",
          }}>
            <iframe
              src={previewUrl}
              style={{ display: "block", width: 900, height: 640, border: "none" }}
              title="Certificate Preview"
            />
          </div>
        </div>
      </div>
    );
  }

  // ---- Editor Mode ----
  return (
    <div style={{
      height: "100vh",
      backgroundColor: "#F7F4EE",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <Navbar activeStep={1} />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left — scrollable PDF canvas area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "auto",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <div style={{ marginBottom: 16, alignSelf: "flex-start" }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#2C1F0E", margin: 0, marginBottom: 4 }}>
              Template Editor
            </h1>
            <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>
              {fieldPositions.length === 0
                ? "Click or drag on the certificate to place the Name field."
                : "Drag to move · Corners to resize · × to delete"}
            </p>
          </div>

          {/* PDF canvas card — tight padding, centered */}
          <div style={{
            display: "inline-block",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(44, 31, 14, 0.12)",
            border: "1px solid #DDD5C4",
            lineHeight: 0,
            padding: 8,
            backgroundColor: "#FFFFFF",
          }}>
            <PdfViewer
              file={pdfFile}
              selectedField="Name"
              fieldPositions={fieldPositions}
              onFieldChange={handleFieldChange}
              onFieldDelete={() => setFieldPositions([])}
            />
          </div>
        </div>

        {/* Right — fixed sidebar */}
        <div style={{
          width: 280,
          backgroundColor: "#FFFFFF",
          borderLeft: "1px solid #DDD5C4",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflowY: "auto",
        }}>
          {/* Sidebar header */}
          <div style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #EFE9DA",
          }}>
            <p style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9C8670",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: 0,
            }}>
              Configuration
            </p>
          </div>

          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>

            {/* Name field status */}
            <div>
              <p style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#9C8670",
                margin: 0,
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Name Field
              </p>
              {fieldPositions.length > 0 ? (
                <div style={{
                  padding: "10px 14px",
                  backgroundColor: "#E8EDD6",
                  borderRadius: 10,
                  border: "1px solid #C8D4A0",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    backgroundColor: "#7C8C4E", flexShrink: 0,
                  }} />
                  <p style={{ fontSize: 13, color: "#4A6030", fontWeight: 500, margin: 0 }}>
                    Field placed ✓
                  </p>
                </div>
              ) : (
                <div style={{
                  padding: "10px 14px",
                  backgroundColor: "#F7F4EE",
                  borderRadius: 10,
                  border: "1.5px dashed #DDD5C4",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    backgroundColor: "#DDD5C4", flexShrink: 0,
                  }} />
                  <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>
                    Click canvas to place
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "#EFE9DA" }} />

            {/* Spreadsheet mapping */}
            <div>
              <p style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#9C8670",
                margin: 0,
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Spreadsheet
              </p>

              {sheetFile ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#5C4A2A" }}>
                    Name column
                  </label>
                  {columns.length > 0 ? (
                    <select
                      value={nameColumn}
                      onChange={(e) => setNameColumn(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1.5px solid #DDD5C4",
                        borderRadius: 10,
                        fontSize: 13,
                        color: "#2C1F0E",
                        backgroundColor: "#FFFFFF",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      {columns.map((col) => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  ) : (
                    <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>Parsing...</p>
                  )}

                  {nameColumn && sheetRows.length > 0 && (
                    <div style={{
                      padding: "8px 12px",
                      backgroundColor: "#F7F4EE",
                      borderRadius: 8,
                      border: "1px solid #EFE9DA",
                    }}>
                      <p style={{ fontSize: 11, color: "#9C8670", margin: 0, marginBottom: 1 }}>
                        {sheetRows.length} participants
                      </p>
                      <p style={{ fontSize: 12, color: "#5C4A2A", fontWeight: 500, margin: 0 }}>
                        First: {sheetRows[0][nameColumn] ?? "—"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  padding: 12,
                  backgroundColor: "#F7F4EE",
                  borderRadius: 10,
                  border: "1.5px dashed #DDD5C4",
                  textAlign: "center",
                }}>
                  <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>
                    No spreadsheet uploaded
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: "#EFE9DA" }} />

            {/* Text Formatting — placeholder */}
            <div>
              <p style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#9C8670",
                margin: 0,
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Text Formatting
              </p>

              <div style={{
                padding: 16,
                backgroundColor: "#F7F4EE",
                borderRadius: 10,
                border: "1.5px dashed #DDD5C4",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}>
                {[["Font size", "32px"], ["Alignment", "Center"], ["Font", "Helvetica"]].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#9C8670" }}>{label}</span>
                    <div style={{
                      padding: "4px 10px",
                      backgroundColor: "#EFE9DA",
                      borderRadius: 6,
                      fontSize: 12,
                      color: "#9C8670",
                    }}>
                      {value}
                    </div>
                  </div>
                ))}
                <p style={{ fontSize: 11, color: "#C4B8A8", margin: 0, marginTop: 4, textAlign: "center" }}>
                  Customization coming soon
                </p>
              </div>
            </div>

          </div>

          {/* Bottom action buttons */}
          <div style={{
            padding: 24,
            borderTop: "1px solid #EFE9DA",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <button
              onClick={handlePreview}
              disabled={!canPreview || isGenerating}
              style={{
                width: "100%",
                padding: "11px 0",
                backgroundColor: canPreview ? "#EFE9DA" : "#F7F4EE",
                color: canPreview ? "#5C4A2A" : "#9C8670",
                border: `1.5px solid ${canPreview ? "#DDD5C4" : "#EFE9DA"}`,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: canPreview && !isGenerating ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              {isGenerating ? "Generating..." : "Preview"}
            </button>

            <button
              onClick={() => canPreview && navigate("/generating")}
              disabled={!canPreview}
              style={{
                width: "100%",
                padding: "11px 0",
                backgroundColor: canPreview ? "#7C8C4E" : "#DDD5C4",
                color: canPreview ? "#FFFFFF" : "#9C8670",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: canPreview ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              Generate All →
            </button>

            {!canPreview && (
              <p style={{ fontSize: 11, color: "#9C8670", margin: 0, textAlign: "center" }}>
                {!fieldPositions.length
                  ? "Place the Name field first"
                  : "Select the Name column above"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}