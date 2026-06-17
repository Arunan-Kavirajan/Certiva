import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCertificate } from "../context/CertificateContext";
import Navbar from "../components/shared/Navbar";
import type { GenerationResult } from "../utils/generateAllCertificates";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  shape: "rect" | "circle";
}

const CONFETTI_COLORS = ["#7C8C4E", "#9CB05E", "#C8D4A0", "#5C4A2A", "#E8EDD6"];

export default function DownloadPage() {
  const navigate = useNavigate();
  const { zipBlob, sheetRows } = useCertificate();
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [showFailed, setShowFailed] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetCount = result?.succeeded ?? sheetRows.length;

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

  // Counting animation
  useEffect(() => {
    if (targetCount === 0) return;
    let frame = 0;
    const totalFrames = 40;
    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      setDisplayCount(Math.round(progress * targetCount));
      if (progress >= 1) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [targetCount]);

  // Confetti burst on load
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: ConfettiPiece[] = Array.from({ length: 60 }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 2 - 50,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 6 - 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      size: Math.random() * 6 + 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    let frameCount = 0;
    const maxFrames = 100;
    let animId: number;

    const draw = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach((p) => {
        p.vy += 0.15; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const opacity = Math.max(0, 1 - frameCount / maxFrames);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (frameCount < maxFrames) {
        animId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

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
      fontFamily: "'Inter', sans-serif",
    }}>
      <Navbar activeStep={3} />

      {/* Confetti canvas */}
      <canvas ref={canvasRef} style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 50,
      }} />

      {/* Ambient orbs */}
      <div style={{
        position: "absolute", top: -150, right: -150,
        width: 650, height: 650, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,140,78,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -180, left: -150,
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(92,74,42,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Decorative certificate border motifs */}
      <svg style={{ position: "absolute", top: 80, right: "10%", pointerEvents: "none", opacity: 0.06 }}
        width="220" height="220" viewBox="0 0 220 220" fill="none">
        <rect x="10" y="10" width="200" height="200" rx="4" stroke="#2C1F0E" strokeWidth="1" strokeDasharray="6 4" />
        <circle cx="10" cy="10" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="210" cy="10" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="10" cy="210" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="210" cy="210" r="5" stroke="#2C1F0E" strokeWidth="1" />
        <path d="M110 10 L114 20 L110 30 L106 20 Z" fill="#2C1F0E" opacity="0.5" />
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
          maxWidth: 500,
          boxShadow: "0 16px 56px rgba(44, 31, 14, 0.14), 0 2px 8px rgba(124,140,78,0.08)",
          border: "1px solid rgba(200,212,160,0.6)",
          textAlign: "center",
          position: "relative",
        }}>
          {/* Top accent line */}
          <div style={{
            position: "absolute", top: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 60, height: 3,
            background: "linear-gradient(to right, #7C8C4E, #C8D4A0)",
            borderRadius: "0 0 4px 4px",
          }} />

          {/* Success icon */}
          <div style={{
            width: 80, height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #E8EDD6, #D8E4B0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px",
            border: "3px solid #C8D4A0",
            boxShadow: "0 6px 20px rgba(124,140,78,0.2)",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                stroke="#5C7030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="22 4 12 14.01 9 11.01"
                stroke="#5C7030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 style={{
            fontSize: 30, fontWeight: 700, color: "#2C1F0E",
            margin: 0, marginBottom: 4,
            fontFamily: "'Playfair Display', serif",
          }}>
            All Done!
          </h1>

          {/* Big counting number */}
          <div style={{ margin: "20px 0 8px" }}>
            <span style={{
              fontSize: 56, fontWeight: 700,
              color: "#7C8C4E",
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
            }}>
              {displayCount}
            </span>
            <span style={{ fontSize: 18, color: "#9C8670", marginLeft: 8 }}>
              certificate{targetCount !== 1 ? "s" : ""}
            </span>
          </div>

          {result && result.failed.length > 0 && (
            <p style={{ fontSize: 13, color: "#E05A4A", margin: "0 0 8px" }}>
              {result.failed.length} failed to generate
            </p>
          )}

          {result && result.failed.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={() => setShowFailed(!showFailed)}
                style={{
                  background: "none", border: "none",
                  fontSize: 12, color: "#E05A4A",
                  cursor: "pointer", textDecoration: "underline", padding: 0,
                }}
              >
                {showFailed ? "Hide" : "Show"} failed entries
              </button>

              {showFailed && (
                <div style={{
                  marginTop: 12, padding: "12px 16px",
                  backgroundColor: "#FEF2F0", borderRadius: 12,
                  border: "1px solid #FAD4CE", textAlign: "left",
                  maxHeight: 160, overflowY: "auto",
                }}>
                  {result.failed.map((f, i) => (
                    <div key={i} style={{
                      paddingBottom: 8, marginBottom: 8,
                      borderBottom: i < result.failed.length - 1 ? "1px solid #FAD4CE" : "none",
                    }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#C0392B", margin: 0 }}>{f.name}</p>
                      <p style={{ fontSize: 11, color: "#E05A4A", margin: 0 }}>{f.error}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <p style={{ fontSize: 13, color: "#9C8670", margin: "16px 0 32px", lineHeight: 1.6 }}>
            Your certificates are bundled up and ready to go.
          </p>

          <button
            onClick={handleDownload}
            style={{
              width: "100%", padding: "15px 0",
              background: "linear-gradient(135deg, #7C8C4E 0%, #5C7030 100%)",
              color: "#FFFFFF",
              border: "none", borderRadius: 13,
              fontSize: 15, fontWeight: 600,
              cursor: "pointer", marginBottom: 12,
              transition: "all 0.25s ease",
              boxShadow: "0 6px 20px rgba(124,140,78,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,140,78,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,140,78,0.3)";
            }}
          >
            ↓ Download Certificates.zip
          </button>

          <button
            onClick={() => navigate("/editor")}
            style={{
              width: "100%", padding: "14px 0",
              backgroundColor: "transparent",
              color: "#9C8670",
              border: "1.5px solid #DDD5C4",
              borderRadius: 13,
              fontSize: 14, fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FAF8F3";
              e.currentTarget.style.borderColor = "#C4B8A8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#DDD5C4";
            }}
          >
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
}