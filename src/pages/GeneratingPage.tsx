import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCertificate } from "../context/CertificateContext";
import { generateAllCertificates } from "../utils/generateAllCertificates";
import Navbar from "../components/shared/Navbar";

export default function GeneratingPage() {
  const navigate = useNavigate();
  const { pdfFile, fieldPositions, sheetRows, columnMappings, staticValues, setZipBlob } = useCertificate();

  const [current, setCurrent] = useState(0);
  const total = sheetRows.length;

  useEffect(() => {
    if (!pdfFile || fieldPositions.length === 0 || sheetRows.length === 0) {
      navigate("/editor");
      return;
    }

    generateAllCertificates(
      pdfFile,
      fieldPositions,
      sheetRows,
      columnMappings,
      staticValues,
      (done) => setCurrent(done)
    ).then(({ zip, result }) => {
      setZipBlob(zip);
      sessionStorage.setItem("generationResult", JSON.stringify(result));
      navigate("/download");
    });
  }, [navigate]);

  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

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
      <Navbar activeStep={2} />

      {/* Ambient orbs */}
      <div style={{
        position: "absolute", top: -150, left: -150,
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,140,78,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -180, right: -150,
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(92,74,42,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Decorative certificate motif */}
      <svg style={{ position: "absolute", top: "20%", right: "8%", pointerEvents: "none", opacity: 0.05 }}
        width="200" height="200" viewBox="0 0 200 200" fill="none">
        <rect x="10" y="10" width="180" height="180" rx="4" stroke="#2C1F0E" strokeWidth="1" strokeDasharray="6 4" />
        <circle cx="10" cy="10" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="190" cy="10" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="10" cy="190" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="190" cy="190" r="5" stroke="#2C1F0E" strokeWidth="1" />
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
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(20px)",
          borderRadius: 28,
          padding: 52,
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 12px 48px rgba(44, 31, 14, 0.12), 0 2px 8px rgba(44, 31, 14, 0.04)",
          border: "1px solid rgba(221,213,196,0.8)",
          textAlign: "center",
        }}>
          {/* Spinning icon ring */}
          <div style={{
            width: 72, height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #E8EDD6, #D8E4B0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px",
            position: "relative",
            boxShadow: "0 4px 16px rgba(124,140,78,0.15)",
          }}>
            <div style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#7C8C4E",
              animation: "spin 1.2s linear infinite",
            }} />
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="14 2 14 8 20 8" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="13" x2="8" y2="13" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="17" x2="8" y2="17" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <h1 style={{
            fontSize: 24, fontWeight: 700, color: "#2C1F0E",
            margin: 0, marginBottom: 8,
            fontFamily: "'Playfair Display', serif",
          }}>
            Generating Certificates
          </h1>
          <p style={{ fontSize: 14, color: "#9C8670", margin: 0, marginBottom: 36 }}>
            Crafting {total} personalized certificate{total !== 1 ? "s" : ""}, one by one.
          </p>

          {/* Progress bar */}
          <div style={{
            width: "100%", height: 10,
            backgroundColor: "#EFE9DA",
            borderRadius: 99,
            overflow: "hidden",
            marginBottom: 14,
            position: "relative",
          }}>
            <div style={{
              height: "100%",
              width: `${percent}%`,
              background: "linear-gradient(90deg, #7C8C4E, #9CB05E)",
              borderRadius: 99,
              transition: "width 0.3s ease",
              boxShadow: "0 0 10px rgba(124,140,78,0.4)",
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>
              {current} of {total} done
            </p>
            <p style={{
              fontSize: 14, fontWeight: 700, color: "#7C8C4E", margin: 0,
              fontFamily: "'Playfair Display', serif",
            }}>
              {percent}%
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}