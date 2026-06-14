import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Document, Page } from "react-pdf";
import PdfViewer from "../components/pdf/PdfViewer";
import { useCertificate } from "../context/CertificateContext";
import type { FieldPosition, FieldType } from "../types/certificate";
import { FIELD_TYPES, FIELD_COLORS } from "../types/certificate";
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
    columnMappings,
    setColumnMappings,
    staticValues,
    setStaticValues,
  } = useCertificate();

  const [columns, setColumns] = useState<string[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldType>("Name");
  const [activeFormattingField, setActiveFormattingField] = useState<FieldType>("Name");

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
      if (!columnMappings["Name"] && headers.length > 0) {
        setColumnMappings({ ...columnMappings, Name: headers[0] });
      }
    };
    reader.readAsArrayBuffer(sheetFile);
  }, [sheetFile]);

  const handleFieldChange = (updated: FieldPosition) => {
    const others = fieldPositions.filter((p) => p.field !== updated.field);
    setFieldPositions([...others, updated]);
  };

  const handleFieldDelete = (field: FieldType) => {
    setFieldPositions(fieldPositions.filter((p) => p.field !== field));
  };

  const updateFormatting = (patch: Partial<FieldPosition>) => {
    const existing = fieldPositions.find((p) => p.field === activeFormattingField);
    if (!existing) return;
    handleFieldChange({ ...existing, ...patch });
  };

  const handlePreview = async () => {
    if (!pdfFile || fieldPositions.length === 0 || sheetRows.length === 0) return;
    setIsGenerating(true);
    try {
      const blob = await generateCertificate(pdfFile, fieldPositions, columnMappings, sheetRows[0], staticValues);
      setPreviewBlob(blob);
      setIsPreviewMode(true);
    } catch (err) {
      console.error("Preview generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const canPreview = !!(pdfFile && fieldPositions.length > 0 && sheetRows.length > 0);
  const activeFieldPos = fieldPositions.find((p) => p.field === activeFormattingField) ?? null;

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

        {/* Left — canvas */}
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
                  ? `Showing for: ${sheetRows[0]?.[columnMappings["Name"] ?? ""] ?? "—"}`
                  : fieldPositions.find(p => p.field === selectedField)
                    ? `${selectedField} placed — pick another field or adjust positioning`
                    : `Click or drag on the certificate to place the ${selectedField} field`}
              </p>
            </div>

            {isPreviewMode && (
              <button
                onClick={() => setIsPreviewMode(false)}
                style={{
                  marginLeft: 8,
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

          {/* Editor canvas */}
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
              selectedField={selectedField}
              fieldPositions={fieldPositions}
              onFieldChange={handleFieldChange}
              onFieldDelete={handleFieldDelete}
            />
          </div>

          {/* Preview */}
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
                    width: 800, height: 566,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: "#F7F4EE",
                  }}>
                    <p style={{ fontSize: 13, color: "#9C8670" }}>Loading preview...</p>
                  </div>
                }
              >
                <Page pageNumber={1} width={800} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
            </div>
          )}
        </div>

        {/* Right — sidebar */}
        <div style={{
          width: 300,
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

            {/* Field placement */}
            <div>
              <p style={{
                fontSize: 12, fontWeight: 600, color: "#9C8670",
                margin: 0, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                Fields
              </p>

              {/* Field selector tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {FIELD_TYPES.map((ft) => {
                  const isSelected = selectedField === ft;
                  const isPlaced = fieldPositions.some(p => p.field === ft);
                  const colors = FIELD_COLORS[ft];
                  return (
                    <button
                      key={ft}
                      onClick={() => {
                        setSelectedField(ft);
                        setActiveFormattingField(ft);
                      }}
                      style={{
                        flex: 1,
                        padding: "7px 4px",
                        backgroundColor: isSelected ? colors.bg : "#F7F4EE",
                        color: isSelected ? colors.text : "#9C8670",
                        border: `1.5px solid ${isSelected ? colors.border : "#DDD5C4"}`,
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        position: "relative",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {ft}
                      {isPlaced && (
                        <span style={{
                          position: "absolute",
                          top: -4, right: -4,
                          width: 8, height: 8,
                          borderRadius: "50%",
                          backgroundColor: colors.border,
                          border: "1.5px solid white",
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Field status list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {FIELD_TYPES.map((ft) => {
                  const isPlaced = fieldPositions.some(p => p.field === ft);
                  const colors = FIELD_COLORS[ft];
                  return (
                    <div
                      key={ft}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: isPlaced ? colors.bg : "#F7F4EE",
                        borderRadius: 8,
                        border: `1px solid ${isPlaced ? colors.border : "#DDD5C4"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 7, height: 7, borderRadius: "50%",
                          backgroundColor: isPlaced ? colors.border : "#DDD5C4",
                        }} />
                        <span style={{
                          fontSize: 12, fontWeight: 500,
                          color: isPlaced ? colors.text : "#9C8670",
                        }}>
                          {ft}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: isPlaced ? colors.text : "#9C8670" }}>
                        {isPlaced ? "Placed ✓" : "Not placed"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ height: 1, backgroundColor: "#EFE9DA" }} />

            {/* Column mapping */}
            <div>
              <p style={{
                fontSize: 12, fontWeight: 600, color: "#9C8670",
                margin: 0, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                Column Mapping
              </p>

              {fieldPositions.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {FIELD_TYPES.filter(ft => fieldPositions.some(p => p.field === ft)).map((ft) => {
                    const isUsingColumn = !!columnMappings[ft];
                    const colors = FIELD_COLORS[ft];

                    return (
                      <div key={ft}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>
                            {ft}
                          </label>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              onClick={() => {
                                setColumnMappings({ ...columnMappings, [ft]: columns[0] ?? "" });
                                const newStatic = { ...staticValues };
                                delete newStatic[ft];
                                setStaticValues(newStatic);
                              }}
                              style={{
                                padding: "3px 8px",
                                backgroundColor: isUsingColumn ? "#E8EDD6" : "transparent",
                                color: isUsingColumn ? "#5C4A2A" : "#9C8670",
                                border: `1px solid ${isUsingColumn ? "#C8D4A0" : "#DDD5C4"}`,
                                borderRadius: 5,
                                fontSize: 10,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              From sheet
                            </button>
                            <button
                              onClick={() => {
                                const newMappings = { ...columnMappings };
                                delete newMappings[ft];
                                setColumnMappings(newMappings);
                                setStaticValues({ ...staticValues, [ft]: staticValues[ft] ?? "" });
                              }}
                              style={{
                                padding: "3px 8px",
                                backgroundColor: !isUsingColumn ? "#E8EDD6" : "transparent",
                                color: !isUsingColumn ? "#5C4A2A" : "#9C8670",
                                border: `1px solid ${!isUsingColumn ? "#C8D4A0" : "#DDD5C4"}`,
                                borderRadius: 5,
                                fontSize: 10,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Fixed text
                            </button>
                          </div>
                        </div>

                        {isUsingColumn ? (
                          columns.length > 0 ? (
                            <select
                              value={columnMappings[ft] ?? ""}
                              onChange={(e) => setColumnMappings({ ...columnMappings, [ft]: e.target.value })}
                              style={{
                                width: "100%", padding: "9px 12px",
                                border: "1.5px solid #DDD5C4", borderRadius: 10,
                                fontSize: 13, color: "#2C1F0E", backgroundColor: "#FFFFFF",
                                outline: "none", cursor: "pointer",
                              }}
                            >
                              <option value="">— Select column —</option>
                              {columns.map((col) => (
                                <option key={col} value={col}>{col}</option>
                              ))}
                            </select>
                          ) : (
                            <p style={{ fontSize: 12, color: "#9C8670", margin: 0 }}>
                              No spreadsheet uploaded
                            </p>
                          )
                        ) : (
                          <input
                            type="text"
                            placeholder={`Enter ${ft.toLowerCase()} text...`}
                            value={staticValues[ft] ?? ""}
                            onChange={(e) => setStaticValues({ ...staticValues, [ft]: e.target.value })}
                            style={{
                              width: "100%", padding: "9px 12px",
                              border: "1.5px solid #DDD5C4", borderRadius: 10,
                              fontSize: 13, color: "#2C1F0E", backgroundColor: "#FFFFFF",
                              outline: "none", boxSizing: "border-box",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}

                  {sheetRows.length > 0 && (
                    <div style={{
                      padding: "8px 12px", backgroundColor: "#F7F4EE",
                      borderRadius: 8, border: "1px solid #EFE9DA",
                    }}>
                      <p style={{ fontSize: 11, color: "#9C8670", margin: 0 }}>
                        {sheetRows.length} participants found
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  padding: 12, backgroundColor: "#F7F4EE",
                  borderRadius: 10, border: "1.5px dashed #DDD5C4", textAlign: "center",
                }}>
                  <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>
                    Place a field on the canvas first
                  </p>
                </div>
              )}
            </div>

            <div style={{ height: 1, backgroundColor: "#EFE9DA" }} />

            {/* Text formatting */}
            <div>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 12,
              }}>
                <p style={{
                  fontSize: 12, fontWeight: 600, color: "#9C8670",
                  margin: 0, textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  Text Formatting
                </p>
                {fieldPositions.length > 1 && (
                  <div style={{ display: "flex", gap: 4 }}>
                    {FIELD_TYPES.filter(ft => fieldPositions.some(p => p.field === ft)).map((ft) => {
                      const colors = FIELD_COLORS[ft];
                      return (
                        <button
                          key={ft}
                          onClick={() => setActiveFormattingField(ft)}
                          style={{
                            padding: "3px 8px",
                            backgroundColor: activeFormattingField === ft ? colors.bg : "transparent",
                            color: activeFormattingField === ft ? colors.text : "#9C8670",
                            border: `1px solid ${activeFormattingField === ft ? colors.border : "#DDD5C4"}`,
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {ft}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {activeFieldPos ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#9C8670", display: "block", marginBottom: 6 }}>Font</label>
                    <select
                      value={activeFieldPos.fontFamily}
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

                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, color: "#9C8670", display: "block", marginBottom: 6 }}>Font size</label>
                      <input
                        type="number" min={8} max={72}
                        value={activeFieldPos.fontSize}
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
                        type="number" min={6} max={activeFieldPos.fontSize}
                        value={activeFieldPos.minFontSize}
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

                  <div>
                    <label style={{ fontSize: 12, color: "#9C8670", display: "block", marginBottom: 6 }}>Alignment</label>
                    <div style={{ display: "flex", gap: 6 }}>
                      {(["left", "center", "right"] as const).map((a) => (
                        <button
                          key={a}
                          onClick={() => updateFormatting({ align: a })}
                          style={{
                            flex: 1, padding: "8px 0",
                            backgroundColor: activeFieldPos.align === a ? "#7C8C4E" : "#F7F4EE",
                            color: activeFieldPos.align === a ? "#FFFFFF" : "#9C8670",
                            border: `1.5px solid ${activeFieldPos.align === a ? "#7C8C4E" : "#DDD5C4"}`,
                            borderRadius: 8, fontSize: 12, fontWeight: 500,
                            cursor: "pointer", transition: "all 0.15s ease",
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
                  <p style={{ fontSize: 12, color: "#9C8670", margin: 0 }}>
                    Place a field to format it
                  </p>
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
              }}
            >
              Generate All →
            </button>

            {!canPreview && (
              <p style={{ fontSize: 11, color: "#9C8670", margin: 0, textAlign: "center" }}>
                Place at least one field and upload a spreadsheet
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}