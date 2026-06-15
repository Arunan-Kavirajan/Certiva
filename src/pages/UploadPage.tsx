import { useNavigate } from "react-router-dom";
import { useCertificate } from "../context/CertificateContext";
import PdfUploader from "../components/upload/PdfUploader";
import SpreadsheetUploader from "../components/upload/SpreadsheetUploader";
import Navbar from "../components/shared/Navbar";

export default function UploadPage() {
  const navigate = useNavigate();
  const { pdfFile, setPdfFile, sheetFile, setSheetFile } = useCertificate();
  const canContinue = !!pdfFile && !!sheetFile;
  const bothDone = !!pdfFile && !!sheetFile;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F7F4EE",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    }}>
      <Navbar activeStep={0} />

      {/* Ambient orbs */}
      <div style={{
        position: "absolute", top: -100, left: -100,
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,140,78,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -150, right: -100,
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(92,74,42,0.09) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "50%", right: "20%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,140,78,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Certificate border motifs */}
      <svg style={{ position: "absolute", top: 64, left: 0, pointerEvents: "none", opacity: 0.055 }}
        width="280" height="280" viewBox="0 0 280 280" fill="none">
        <rect x="16" y="16" width="248" height="248" rx="4" stroke="#2C1F0E" strokeWidth="1" strokeDasharray="6 4" />
        <rect x="30" y="30" width="220" height="220" rx="2" stroke="#2C1F0E" strokeWidth="0.5" />
        <circle cx="16" cy="16" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="264" cy="16" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="16" cy="264" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="264" cy="264" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <path d="M140 16 L144 26 L140 36 L136 26 Z" fill="#2C1F0E" opacity="0.4" />
      </svg>

      <svg style={{ position: "absolute", bottom: 0, right: 0, pointerEvents: "none", opacity: 0.055 }}
        width="280" height="280" viewBox="0 0 280 280" fill="none">
        <rect x="16" y="16" width="248" height="248" rx="4" stroke="#2C1F0E" strokeWidth="1" strokeDasharray="6 4" />
        <rect x="30" y="30" width="220" height="220" rx="2" stroke="#2C1F0E" strokeWidth="0.5" />
        <circle cx="16" cy="16" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="264" cy="16" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="16" cy="264" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="264" cy="264" r="5" stroke="#2C1F0E" strokeWidth="1" />
      </svg>

      {/* Main content — two column layout */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 60px",
        position: "relative",
        zIndex: 1,
        gap: 80,
        maxWidth: 1100,
        margin: "0 auto",
        width: "100%",
      }}>

        {/* Left — headline */}
        <div style={{ flex: 1, maxWidth: 420 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            backgroundColor: "rgba(232,237,214,0.8)",
            backdropFilter: "blur(8px)",
            borderRadius: 99,
            padding: "5px 14px",
            marginBottom: 28,
            border: "1px solid #C8D4A0",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              backgroundColor: "#7C8C4E",
              boxShadow: "0 0 6px rgba(124,140,78,0.6)",
            }} />
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: "#5C7030", letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              Step 1 of 4
            </span>
          </div>

          <h1 style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#2C1F0E",
            margin: 0,
            marginBottom: 8,
            letterSpacing: "-1.5px",
            lineHeight: 1.05,
            fontFamily: "'Playfair Display', serif",
          }}>
            Upload your
          </h1>
          <h1 style={{
            fontSize: 48,
            fontWeight: 700,
            fontStyle: "italic",
            color: "#7C8C4E",
            margin: 0,
            marginBottom: 24,
            letterSpacing: "-1.5px",
            lineHeight: 1.05,
            fontFamily: "'Playfair Display', serif",
          }}>
            files.
          </h1>

          <p style={{
            fontSize: 16, color: "#9C8670",
            margin: 0, marginBottom: 40,
            lineHeight: 1.7,
            maxWidth: 340,
          }}>
            Start by uploading your certificate PDF template and the spreadsheet containing your participant list.
          </p>

          {/* Progress indicators */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Certificate Template", done: !!pdfFile, color: "#7C8C4E" },
              { label: "Participant List", done: !!sheetFile, color: "#5C4A2A" },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 20, height: 20,
                  borderRadius: "50%",
                  background: item.done
                    ? `linear-gradient(135deg, ${item.color}, ${item.color}CC)`
                    : "transparent",
                  border: item.done ? "none" : `2px solid #DDD5C4`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                }}>
                  {item.done && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  fontSize: 13,
                  color: item.done ? "#2C1F0E" : "#9C8670",
                  fontWeight: item.done ? 500 : 400,
                  transition: "all 0.3s ease",
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Decorative seal */}
          <div style={{
            marginTop: 48,
            display: "flex", alignItems: "center", gap: 12,
            opacity: 0.5,
          }}>
            <div style={{
              width: 36, height: 36,
              borderRadius: "50%",
              border: "2px solid #DDD5C4",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="#9C8670" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 12, color: "#9C8670" }}>
              Files are processed locally — never uploaded to any server
            </span>
          </div>
        </div>

        {/* Right — upload card */}
        <div style={{ flex: 1, maxWidth: 460 }}>
          <div style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            borderRadius: 24,
            padding: 36,
            boxShadow: "0 8px 40px rgba(44, 31, 14, 0.1), 0 2px 8px rgba(44, 31, 14, 0.04)",
            border: "1px solid rgba(221,213,196,0.8)",
            position: "relative",
            overflow: "hidden",
          }}>

            {/* Card top accent */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: 3,
              background: bothDone
                ? "linear-gradient(to right, #7C8C4E, #5C7030)"
                : "linear-gradient(to right, #DDD5C4, #EFE9DA)",
              transition: "all 0.4s ease",
            }} />

            <div style={{ marginBottom: 24 }}>
              <h2 style={{
                fontSize: 17, fontWeight: 600,
                color: "#2C1F0E", margin: 0, marginBottom: 4,
              }}>
                Upload your files
              </h2>
              <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>
                Both files are required to proceed
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <PdfUploader file={pdfFile} onFileSelect={setPdfFile} />
              <SpreadsheetUploader file={sheetFile} onFileSelect={setSheetFile} />
            </div>

            {/* Continue button */}
            <button
              onClick={() => canContinue && navigate("/editor")}
              disabled={!canContinue}
              style={{
                width: "100%",
                marginTop: 24,
                padding: "14px 0",
                background: canContinue
                  ? "linear-gradient(135deg, #7C8C4E 0%, #5C7030 100%)"
                  : "#EFE9DA",
                color: canContinue ? "#FFFFFF" : "#9C8670",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: canContinue ? "pointer" : "not-allowed",
                transition: "all 0.25s ease",
                letterSpacing: "0.01em",
                boxShadow: canContinue ? "0 4px 16px rgba(124,140,78,0.3)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!canContinue) return;
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(124,140,78,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = canContinue ? "0 4px 16px rgba(124,140,78,0.3)" : "none";
              }}
            >
              {canContinue ? "Continue to Editor →" : "Upload both files to continue"}
            </button>

            {canContinue && (
              <p style={{
                textAlign: "center", fontSize: 12,
                color: "#9C8670", margin: 0, marginTop: 12,
              }}>
                Ready to go! Click above to continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}