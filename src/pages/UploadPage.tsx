import { useNavigate } from "react-router-dom";
import { useCertificate } from "../context/CertificateContext";
import PdfUploader from "../components/upload/PdfUploader";
import SpreadsheetUploader from "../components/upload/SpreadsheetUploader";
import Navbar from "../components/shared/Navbar";

export default function UploadPage() {
  const navigate = useNavigate();
  const { pdfFile, setPdfFile, sheetFile, setSheetFile } = useCertificate();
  const canContinue = !!pdfFile && !!sheetFile;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F7F4EE",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      <Navbar activeStep={0} />

      {/* Background wave decorations */}
      <svg
        style={{ position: "absolute", top: 60, left: 0, pointerEvents: "none", opacity: 0.4 }}
        width="400" height="400" viewBox="0 0 400 400" fill="none"
      >
        <path d="M-50 200 Q50 100 150 200 Q250 300 350 200 Q450 100 550 200"
          stroke="#7C8C4E" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M-50 240 Q50 140 150 240 Q250 340 350 240 Q450 140 550 240"
          stroke="#7C8C4E" strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M-50 280 Q50 180 150 280 Q250 380 350 280 Q450 180 550 280"
          stroke="#9C8670" strokeWidth="1" fill="none" opacity="0.2" />
      </svg>

      <svg
        style={{ position: "absolute", bottom: 0, right: 0, pointerEvents: "none", opacity: 0.4 }}
        width="400" height="400" viewBox="0 0 400 400" fill="none"
      >
        <path d="M550 200 Q450 100 350 200 Q250 300 150 200 Q50 100 -50 200"
          stroke="#7C8C4E" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M550 240 Q450 140 350 240 Q250 340 150 240 Q50 140 -50 240"
          stroke="#7C8C4E" strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M550 160 Q450 60 350 160 Q250 260 150 160 Q50 60 -50 160"
          stroke="#9C8670" strokeWidth="1" fill="none" opacity="0.2" />
      </svg>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-block",
            backgroundColor: "#E8EDD6",
            borderRadius: 20,
            padding: "6px 14px",
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#7C8C4E", letterSpacing: "0.06em" }}>
              CERTIFICATE AUTOMATION
            </span>
          </div>
          <h1 style={{
            fontSize: 42,
            fontWeight: 700,
            color: "#2C1F0E",
            margin: 0,
            marginBottom: 14,
            letterSpacing: "-0.8px",
            lineHeight: 1.15,
          }}>
            Generate certificates,
            <br />
            <span style={{ color: "#7C8C4E" }}>in seconds.</span>
          </h1>
          <p style={{ fontSize: 16, color: "#9C8670", margin: 0, lineHeight: 1.6 }}>
            Upload your template and participant list to get started.
          </p>
        </div>

        {/* Upload card */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
          padding: 36,
          width: "100%",
          maxWidth: 500,
          boxShadow: "0 4px 24px rgba(44, 31, 14, 0.08), 0 1px 4px rgba(44, 31, 14, 0.04)",
          border: "1px solid #EFE9DA",
        }}>
          <h2 style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#2C1F0E",
            margin: 0,
            marginBottom: 20,
          }}>
            Upload your files
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <PdfUploader file={pdfFile} onFileSelect={setPdfFile} />
            <SpreadsheetUploader file={sheetFile} onFileSelect={setSheetFile} />
          </div>

          <button
            onClick={() => canContinue && navigate("/editor")}
            disabled={!canContinue}
            style={{
              width: "100%",
              marginTop: 24,
              padding: "14px 0",
              backgroundColor: canContinue ? "#7C8C4E" : "#DDD5C4",
              color: canContinue ? "#FFFFFF" : "#9C8670",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: canContinue ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              letterSpacing: "0.1px",
            }}
          >
            Continue to Editor →
          </button>

          {!canContinue && (
            <p style={{
              textAlign: "center",
              fontSize: 12,
              color: "#9C8670",
              margin: 0,
              marginTop: 12,
            }}>
              {!pdfFile && !sheetFile
                ? "Upload both files to continue"
                : !pdfFile
                  ? "Upload your PDF template to continue"
                  : "Upload your participant list to continue"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}