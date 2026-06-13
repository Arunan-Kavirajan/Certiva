import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Document, Page } from "react-pdf";
import PdfViewer from "../components/pdf/PdfViewer";
import { useCertificate } from "../context/CertificateContext";
import type { FieldPosition } from "../types/certificate";
import { generateCertificate } from "../utils/generateCertificate";
import Navbar from "../components/shared/Navbar";

const FONT_OPTIONS: { label: string; value: FieldPosition["fontFamily"] }[] = [
  { label: "Helvetica", value: "Helvetica" },
  { label: "Helvetica Bold", value: "Helvetica-Bold" },
  { label: "Times Roman", value: "Times-Roman" },
  { label: "Courier", value: "Courier" },
];

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
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!pdfFile) navigate("/upload");
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

  const updateFormatting = (patch: Partial<FieldPosition>) => {
    if (fieldPositions.length === 0) return;
    setFieldPositions([{ ...fieldPositions[0], ...patch }]);
  };

  const handlePreview = async () => {
    if (!pdfFile || fieldPositions.length === 0 || !nameColumn || sheetRows.length === 0) return;
    setIsGenerating(true);
    try {
      const blob = await generateCertificate(
        pdfFile,
        fieldPositions[0],
        sheetRows[0][nameColumn] ?? "Unknown"
      );
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(blob);
      setPreviewBlob(blob);
      setPreviewUrl(url);
      setIsPreviewMode(true);
    } catch (err) {
      console.error("Preview generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const canPreview = !!(pdfFile && fieldPositions.length > 0 && nameColumn && sheetRows.length > 0);
  const activeField = fieldPositions[0] ?? null;

  if (!pdfFile) return null;

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

        {/* Left — canvas area, always mounted */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "auto",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}>

          {/* Header */}
          <div style={{ marginBottom: 20, alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => navigate("/upload")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                backgroundColor: "#FFFFFF",
                color: "#9C8670",
                border: "1.5px solid #DDD5C4",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#EFE9DA";
                e.currentTarget.style.color = "#5C4A2A";
                e.currentTarget.style.borderColor = "#C4B8A8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.color = "#9C8670";
                e.currentTarget.style.borderColor = "#DDD5C4";
              }}
            >
              ← Upload
            </button>

            <div style={{ width: 1, height: 28, backgroundColor: "#DDD5C4" }} />

            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#2C1F0E", margin: 0, marginBottom: 2 }}>
                {isPreviewMode ? "Certificate Preview" : "Template Editor"}
              </h1>
              <p style={{ fontSize: 12, color: "#9C8670", margin: 0 }}>
                {isPreviewMode
                  ? `Showing for: ${sheetRows[0]?.[nameColumn] ?? "—"}`
                  : fieldPositions.length === 0
                    ? "Click or drag on the certificate to place the Name field."
                    : "Drag to move · Corners to resize · × to delete"}
              </p>
            </div>

            {/* Back to editor button — only in preview mode */}
            {isPreviewMode && (
              <button
                onClick={() => setIsPreviewMode(false)}
                style={{
                  marginLeft: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  backgroundColor: "#FFFFFF",
                  color: "#9C8670",
                  border: "1.5px solid #DDD5C4",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                ← Back to Editor
              </button>
            )}
          </div>

          {/* Editor canvas — hidden in preview mode but stays mounted */}
          <div style={{
            display: isPreviewMode ? "none" : "inline-block",
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

          {/* Preview — rendered with react-pdf, same style as editor */}
          {isPreviewMode && previewBlob && (
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
              <Document
                file={previewBlob}
                loading={
                  <div style={{
                    width: 800,
                    height: 566,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F7F4EE",
                  }}>
                    <p style={{ fontSize: 13, color: "#9C8670" }}>Loading preview...</p>
                  </div>
                }
              >
                <Page
                  pageNumber={1}
                  width={800}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          )}
        </div>

        {/* Right — sidebar */}
        <div style={{
          width: 280,
          backgroundColor: "#FFFFFF",
          borderLeft: "1px solid #DDD5C4",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflowY: "auto",
        }}>
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #EFE9DA" }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: "#9C8670",
              textTransform: "uppercase", letterSpacing: "0.08em", margin: 0,
            }}>
              Configuration
            </p>
          </div>

          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>

            {/* Name field status */}
            <div>
              <p style={{
                fontSize: 12, fontWeight: 600, color: "#9C8670",
                margin: 0, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                Name Field
              </p>
              {fieldPositions.length > 0 ? (
                <div style={{
                  padding: "10px 14px", backgroundColor: "#E8EDD6",
                  borderRadius: 10, border: "1px solid #C8D4A0",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#7C8C4E", flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: "#4A6030", fontWeight: 500, margin: 0 }}>Field placed ✓</p>
                </div>
              ) : (
                <div style={{
                  padding: "10px 14px", backgroundColor: "#F7F4EE",
                  borderRadius: 10, border: "1.5px dashed #DDD5C4",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#DDD5C4", flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>Click canvas to place</p>
                </div>
              )}
            </div>

            <div style={{ height: 1, backgroundColor: "#EFE9DA" }} />

            {/* Spreadsheet */}
            <div>
              <p style={{
                fontSize: 12, fontWeight: 600, color: "#9C8670",
                margin: 0, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                Spreadsheet
              </p>
              {sheetFile ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#5C4A2A" }}>Name column</label>
                  {columns.length > 0 ? (
                    <select
                      value={nameColumn}
                      onChange={(e) => setNameColumn(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 12px",
                        border: "1.5px solid #DDD5C4", borderRadius: 10,
                        fontSize: 13, color: "#2C1F0E", backgroundColor: "#FFFFFF",
                        outline: "none", cursor: "pointer",
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
                      padding: "8px 12px", backgroundColor: "#F7F4EE",
                      borderRadius: 8, border: "1px solid #EFE9DA",
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
                  padding: 12, backgroundColor: "#F7F4EE",
                  borderRadius: 10, border: "1.5px dashed #DDD5C4", textAlign: "center",
                }}>
                  <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>No spreadsheet uploaded</p>
                </div>
              )}
            </div>

            <div style={{ height: 1, backgroundColor: "#EFE9DA" }} />

            {/* Text Formatting */}
            <div>
              <p style={{
                fontSize: 12, fontWeight: 600, color: "#9C8670",
                margin: 0, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                Text Formatting
              </p>

              {activeField ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* Font family */}
                  <div>
                    <label style={{ fontSize: 12, color: "#9C8670", display: "block", marginBottom: 6 }}>Font</label>
                    <select
                      value={activeField.fontFamily}
                      onChange={(e) => updateFormatting({ fontFamily: e.target.value as FieldPosition["fontFamily"] })}
                      style={{
                        width: "100%", padding: "9px 12px",
                        border: "1.5px solid #DDD5C4", borderRadius: 10,
                        fontSize: 13, color: "#2C1F0E", backgroundColor: "#FFFFFF",
                        outline: "none", cursor: "pointer",
                      }}
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font size + Min font size */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, color: "#9C8670", display: "block", marginBottom: 6 }}>Font size</label>
                      <input
                        type="number"
                        min={8}
                        max={72}
                        value={activeField.fontSize}
                        onChange={(e) => updateFormatting({ fontSize: Number(e.target.value) })}
                        style={{
                          width: "100%", padding: "9px 10px",
                          border: "1.5px solid #DDD5C4", borderRadius: 10,
                          fontSize: 13, color: "#2C1F0E", backgroundColor: "#FFFFFF",
                          outline: "none", boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, color: "#9C8670", display: "block", marginBottom: 6 }}>Min size</label>
                      <input
                        type="number"
                        min={6}
                        max={activeField.fontSize}
                        value={activeField.minFontSize}
                        onChange={(e) => updateFormatting({ minFontSize: Number(e.target.value) })}
                        style={{
                          width: "100%", padding: "9px 10px",
                          border: "1.5px solid #DDD5C4", borderRadius: 10,
                          fontSize: 13, color: "#2C1F0E", backgroundColor: "#FFFFFF",
                          outline: "none", boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  {/* Alignment */}
                  <div>
                    <label style={{ fontSize: 12, color: "#9C8670", display: "block", marginBottom: 6 }}>Alignment</label>
                    <div style={{ display: "flex", gap: 6 }}>
                      {(["left", "center", "right"] as const).map((a) => (
                        <button
                          key={a}
                          onClick={() => updateFormatting({ align: a })}
                          style={{
                            flex: 1,
                            padding: "8px 0",
                            backgroundColor: activeField.align === a ? "#7C8C4E" : "#F7F4EE",
                            color: activeField.align === a ? "#FFFFFF" : "#9C8670",
                            border: `1.5px solid ${activeField.align === a ? "#7C8C4E" : "#DDD5C4"}`,
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            textTransform: "capitalize",
                          }}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{
                  padding: 14, backgroundColor: "#F7F4EE",
                  borderRadius: 10, border: "1.5px dashed #DDD5C4", textAlign: "center",
                }}>
                  <p style={{ fontSize: 12, color: "#9C8670", margin: 0 }}>Place the Name field first</p>
                </div>
              )}
            </div>

          </div>

          {/* Bottom buttons */}
          <div style={{
            padding: 24, borderTop: "1px solid #EFE9DA",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <button
              onClick={handlePreview}
              disabled={!canPreview || isGenerating}
              style={{
                width: "100%", padding: "11px 0",
                backgroundColor: canPreview ? "#EFE9DA" : "#F7F4EE",
                color: canPreview ? "#5C4A2A" : "#9C8670",
                border: `1.5px solid ${canPreview ? "#DDD5C4" : "#EFE9DA"}`,
                borderRadius: 10, fontSize: 14, fontWeight: 600,
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
                width: "100%", padding: "11px 0",
                backgroundColor: canPreview ? "#7C8C4E" : "#DDD5C4",
                color: canPreview ? "#FFFFFF" : "#9C8670",
                border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
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

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}