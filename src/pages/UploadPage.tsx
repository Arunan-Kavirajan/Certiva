import { useNavigate } from "react-router-dom";
import { useCertificate } from "../context/CertificateContext";
import PdfUploader from "../components/upload/PdfUploader";
import SpreadsheetUploader from "../components/upload/SpreadsheetUploader";

const STEPS = ["Upload", "Edit", "Generate", "Download"];

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
    }}>

      {/* Navbar */}
      <nav style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #DDD5C4",
        padding: "0 40px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#2C1F0E",
          letterSpacing: "-0.3px",
        }}>
          Certiva
        </span>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {STEPS.map((step, i) => {
            const isActive = i === 0;
            const isComplete = false;
            return (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 20,
                  backgroundColor: isActive ? "#E8EDD6" : "transparent",
                }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: isActive ? "#7C8C4E" : isComplete ? "#7C8C4E" : "#DDD5C4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: isActive || isComplete ? "white" : "#9C8670",
                  }}>
                    {isComplete ? "✓" : i + 1}
                  </div>
                  <span style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#2C1F0E" : "#9C8670",
                  }}>
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 20, height: 1, backgroundColor: "#DDD5C4" }} />
                )}
              </div>
            );
          })}
        </div>

        <div style={{ width: 80 }} />
      </nav>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}>

        {/* Hero text */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#2C1F0E",
            margin: 0,
            marginBottom: 12,
            letterSpacing: "-0.5px",
          }}>
            Generate certificates,
            <br />
            <span style={{ color: "#7C8C4E" }}>in seconds.</span>
          </h1>
          <p style={{
            fontSize: 16,
            color: "#9C8670",
            margin: 0,
          }}>
            Upload your template and participant list to get started.
          </p>
        </div>

        {/* Upload card */}
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 32,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 2px 12px rgba(44, 31, 14, 0.08)",
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

          {/* Continue button */}
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