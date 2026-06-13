import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCertificate } from "../context/CertificateContext";
import { generateAllCertificates } from "../utils/generateAllCertificates";
import Navbar from "../components/shared/Navbar";

export default function GeneratingPage() {
  const navigate = useNavigate();
  const { pdfFile, fieldPositions, sheetRows, nameColumn, setZipBlob } = useCertificate();
  const [current, setCurrent] = useState(0);
  const total = sheetRows.length;

  useEffect(() => {
    if (!pdfFile || fieldPositions.length === 0 || !nameColumn || sheetRows.length === 0) {
      navigate("/editor");
      return;
    }

    generateAllCertificates(
      pdfFile,
      fieldPositions[0],
      sheetRows,
      nameColumn,
      (done) => setCurrent(done)
    ).then((zip) => {
      setZipBlob(zip);
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
    }}>
      <Navbar activeStep={2} />

      <svg style={{ position: "absolute", top: 60, left: 0, pointerEvents: "none", opacity: 0.3 }}
        width="500" height="300" viewBox="0 0 500 300" fill="none">
        <path d="M-50 150 Q100 50 200 150 Q300 250 400 150 Q500 50 600 150"
          stroke="#7C8C4E" strokeWidth="1.5" fill="none" />
        <path d="M-50 180 Q100 80 200 180 Q300 280 400 180 Q500 80 600 180"
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
          maxWidth: 440,
          boxShadow: "0 4px 24px rgba(44, 31, 14, 0.08)",
          border: "1px solid #EFE9DA",
          textAlign: "center",
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#E8EDD6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="14 2 14 8 20 8"
                stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="13" x2="8" y2="13"
                stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="17" x2="8" y2="17"
                stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2C1F0E", margin: 0, marginBottom: 8 }}>
            Generating Certificates
          </h1>
          <p style={{ fontSize: 14, color: "#9C8670", margin: 0, marginBottom: 32 }}>
            Please wait while we process all {total} certificates.
          </p>

          <div style={{
            width: "100%",
            height: 8,
            backgroundColor: "#EFE9DA",
            borderRadius: 99,
            overflow: "hidden",
            marginBottom: 12,
          }}>
            <div style={{
              height: "100%",
              width: `${percent}%`,
              backgroundColor: "#7C8C4E",
              borderRadius: 99,
              transition: "width 0.3s ease",
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, color: "#9C8670", margin: 0 }}>
              {current} of {total} done
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#7C8C4E", margin: 0 }}>
              {percent}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}