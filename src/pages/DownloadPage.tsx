import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCertificate } from "../context/CertificateContext";
import Navbar from "../components/shared/Navbar";
import type { GenerationResult } from "../utils/generateAllCertificates";

export default function DownloadPage() {
  const navigate = useNavigate();
  const { zipBlob, sheetRows } = useCertificate();
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [showFailed, setShowFailed] = useState(false);

  useEffect(() => {
    if (!zipBlob) {
      navigate("/editor");
      return;
    }
    const stored = sessionStorage.getItem("generationResult");
    if (stored) {
      setResult(JSON.parse(stored));
      sessionStorage.removeItem("generationResult");
    }
  }, [navigate]);

  const handleDownload = () => {
    if (!zipBlob) return;
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Certificates.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F7F4EE",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      <Navbar activeStep={3} />

      <svg style={{ position: "absolute", top: 60, right: 0, pointerEvents: "none", opacity: 0.35 }}
        width="500" height="400" viewBox="0 0 500 400" fill="none">
        <path d="M600 200 Q500 100 400 200 Q300 300 200 200 Q100 100 0 200"
          stroke="#7C8C4E" strokeWidth="1.5" fill="none" />
        <path d="M600 240 Q500 140 400 240 Q300 340 200 240 Q100 140 0 240"
          stroke="#7C8C4E" strokeWidth="1" fill="none" opacity="0.6" />
      </svg>

      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
          padding: 48,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 4px 24px rgba(44, 31, 14, 0.08)",
          border: "1px solid #EFE9DA",
          textAlign: "center",
        }}>
          {/* Icon */}
          <div style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "#E8EDD6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            border: "3px solid #C8D4A0",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="22 4 12 14.01 9 11.01"
                stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2C1F0E", margin: 0, marginBottom: 8 }}>
            All Done!
          </h1>

          {/* Result summary */}
          {result ? (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 15, color: "#9C8670", margin: 0, marginBottom: 8, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600, color: "#5C4A2A" }}>
                  {result.succeeded} certificate{result.succeeded !== 1 ? "s" : ""}
                </span>{" "}
                generated successfully.
                {result.failed.length > 0 && (
                  <span style={{ color: "#E05A4A" }}>
                    {" "}{result.failed.length} failed.
                  </span>
                )}
              </p>

              {result.failed.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowFailed(!showFailed)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 12,
                      color: "#E05A4A",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    {showFailed ? "Hide" : "Show"} failed entries
                  </button>

                  {showFailed && (
                    <div style={{
                      marginTop: 12,
                      padding: "12px 16px",
                      backgroundColor: "#FEF2F0",
                      borderRadius: 10,
                      border: "1px solid #FAD4CE",
                      textAlign: "left",
                      maxHeight: 160,
                      overflowY: "auto",
                    }}>
                      {result.failed.map((f, i) => (
                        <div key={i} style={{
                          paddingBottom: 8,
                          marginBottom: 8,
                          borderBottom: i < result.failed.length - 1 ? "1px solid #FAD4CE" : "none",
                        }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#C0392B", margin: 0 }}>
                            {f.name}
                          </p>
                          <p style={{ fontSize: 11, color: "#E05A4A", margin: 0 }}>
                            {f.error}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: 15, color: "#9C8670", margin: 0, marginBottom: 28, lineHeight: 1.6 }}>
              <span style={{ fontWeight: 600, color: "#5C4A2A" }}>{sheetRows.length} certificates</span>{" "}
              have been generated successfully.
            </p>
          )}

          <p style={{ fontSize: 13, color: "#9C8670", margin: 0, marginBottom: 28 }}>
            Your ZIP file is ready to download.
          </p>

          <button
            onClick={handleDownload}
            style={{
              width: "100%",
              padding: "14px 0",
              backgroundColor: "#7C8C4E",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 12,
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6A7A3E"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7C8C4E"}
          >
            Download Certificates.zip
          </button>

          <button
            onClick={() => navigate("/editor")}
            style={{
              width: "100%",
              padding: "14px 0",
              backgroundColor: "transparent",
              color: "#9C8670",
              border: "1.5px solid #DDD5C4",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
}