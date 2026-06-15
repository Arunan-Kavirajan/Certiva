import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

const PARTICLE_COLORS = [
  "rgba(124, 140, 78,",
  "rgba(156, 134, 112,",
  "rgba(44, 31, 14,",
  "rgba(124, 140, 78,",
];

const steps = [
  {
    num: "01",
    title: "Upload your files",
    desc: "Upload your PDF certificate template and your participant spreadsheet or CSV.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="17 8 12 3 7 8" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="3" x2="12" y2="15" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Design your layout",
    desc: "Place text fields on your certificate to mark exactly where each detail should appear.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#7C8C4E" strokeWidth="2" />
        <path d="M9 9h6M12 9v6" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Generate & download",
    desc: "Click generate and download a ZIP of personalized certificates for every participant.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="22 4 12 14.01 9 11.01" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2.5 + 0.8,
      opacity: Math.random() * 0.35 + 0.08,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 140, 78, ${0.1 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

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

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Ambient glow orbs */}
      <div style={{
        position: "absolute", top: -200, left: -200,
        width: 700, height: 700,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,140,78,0.12) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", bottom: -150, right: -150,
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(92,74,42,0.1) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", top: "40%", right: "10%",
        width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,140,78,0.07) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Decorative certificate border motif — top left */}
      <svg style={{ position: "absolute", top: 64, left: 0, pointerEvents: "none", zIndex: 0, opacity: 0.06 }}
        width="320" height="320" viewBox="0 0 320 320" fill="none">
        <rect x="20" y="20" width="280" height="280" rx="4" stroke="#2C1F0E" strokeWidth="1" strokeDasharray="6 4" />
        <rect x="36" y="36" width="248" height="248" rx="2" stroke="#2C1F0E" strokeWidth="0.5" />
        <circle cx="20" cy="20" r="6" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="300" cy="20" r="6" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="20" cy="300" r="6" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="300" cy="300" r="6" stroke="#2C1F0E" strokeWidth="1" />
        <path d="M160 20 L165 32 L160 44 L155 32 Z" fill="#2C1F0E" opacity="0.5" />
        <path d="M20 160 L32 155 L44 160 L32 165 Z" fill="#2C1F0E" opacity="0.5" />
      </svg>

      {/* Decorative certificate border motif — bottom right */}
      <svg style={{ position: "absolute", bottom: 0, right: 0, pointerEvents: "none", zIndex: 0, opacity: 0.06 }}
        width="320" height="320" viewBox="0 0 320 320" fill="none">
        <rect x="20" y="20" width="280" height="280" rx="4" stroke="#2C1F0E" strokeWidth="1" strokeDasharray="6 4" />
        <rect x="36" y="36" width="248" height="248" rx="2" stroke="#2C1F0E" strokeWidth="0.5" />
        <circle cx="20" cy="20" r="6" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="300" cy="20" r="6" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="20" cy="300" r="6" stroke="#2C1F0E" strokeWidth="1" />
        <circle cx="300" cy="300" r="6" stroke="#2C1F0E" strokeWidth="1" />
      </svg>

      {/* Navbar */}
      <nav style={{
        position: "relative", zIndex: 10,
        backgroundColor: "rgba(247, 244, 238, 0.8)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(221, 213, 196, 0.6)",
        padding: "0 48px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: 8,
            backgroundColor: "#7C8C4E",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(124,140,78,0.3)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{
            fontSize: 22, fontWeight: 700,
            color: "#2C1F0E", letterSpacing: "-0.4px",
            fontFamily: "'Playfair Display', serif",
          }}>
            Certiva
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#9C8670" }}>
            Free · No account needed
          </span>
          <button
            onClick={() => navigate("/upload")}
            style={{
              padding: "9px 22px",
              background: "linear-gradient(135deg, #7C8C4E 0%, #6A7A3E 100%)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(124,140,78,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,140,78,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(124,140,78,0.25)";
            }}
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px 40px",
        position: "relative",
        zIndex: 1,
        textAlign: "center",
      }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          backgroundColor: "rgba(232, 237, 214, 0.8)",
          backdropFilter: "blur(8px)",
          borderRadius: 99,
          padding: "6px 16px",
          marginBottom: 32,
          border: "1px solid #C8D4A0",
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            backgroundColor: "#7C8C4E",
            boxShadow: "0 0 6px rgba(124,140,78,0.6)",
          }} />
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: "#5C7030", letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Certificate Automation · Free Forever
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 68,
          fontWeight: 700,
          color: "#2C1F0E",
          margin: 0,
          marginBottom: 12,
          letterSpacing: "-2px",
          lineHeight: 1.0,
          maxWidth: 700,
          fontFamily: "'Playfair Display', serif",
        }}>
          Certificates,
        </h1>
        <h1 style={{
          fontSize: 68,
          fontWeight: 700,
          fontStyle: "italic",
          color: "#7C8C4E",
          margin: 0,
          marginBottom: 28,
          letterSpacing: "-2px",
          lineHeight: 1.0,
          maxWidth: 700,
          fontFamily: "'Playfair Display', serif",
        }}>
          without the chaos.
        </h1>

        <p style={{
          fontSize: 18,
          color: "#9C8670",
          margin: 0,
          marginBottom: 44,
          maxWidth: 460,
          lineHeight: 1.75,
          fontWeight: 400,
        }}>
          Upload your template, map your participant list, and generate
          hundreds of personalized certificates in seconds.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => navigate("/upload")}
            style={{
              padding: "16px 40px",
              background: "linear-gradient(135deg, #7C8C4E 0%, #5C7030 100%)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "0 6px 24px rgba(124, 140, 78, 0.35), 0 2px 8px rgba(124, 140, 78, 0.2)",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 32px rgba(124, 140, 78, 0.4), 0 4px 12px rgba(124, 140, 78, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(124, 140, 78, 0.35), 0 2px 8px rgba(124, 140, 78, 0.2)";
            }}
          >
            Get Started — it's free →
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {["No account needed", "No watermarks", "Instant download"].map((t, i) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i > 0 && <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "#C4B8A8" }} />}
                <span style={{ fontSize: 12, color: "#9C8670" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps section */}
        <div style={{ marginTop: 96, width: "100%", maxWidth: 860 }}>

          {/* Section label */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: 16, marginBottom: 48,
          }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #DDD5C4)" }} />
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: "#9C8670", letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              How it works
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #DDD5C4)" }} />
          </div>

          {/* Step cards with connecting line */}
          <div style={{ position: "relative", display: "flex", gap: 24, alignItems: "stretch" }}>

            {/* Dashed connecting line */}
            <div style={{
              position: "absolute",
              top: 36,
              left: "16.67%",
              right: "16.67%",
              height: 1,
              borderTop: "2px dashed rgba(124,140,78,0.25)",
              pointerEvents: "none",
              zIndex: 0,
            }} />

            {steps.map((item, i) => (
              <div
                key={item.num}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{
                  flex: 1,
                  position: "relative",
                  zIndex: 1,
                  backgroundColor: hoveredStep === i
                    ? "#FFFFFF"
                    : "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 20,
                  padding: "28px 24px",
                  border: hoveredStep === i
                    ? "1px solid #C8D4A0"
                    : "1px solid rgba(221,213,196,0.8)",
                  textAlign: "left",
                  boxShadow: hoveredStep === i
                    ? "0 8px 32px rgba(44, 31, 14, 0.1), 0 2px 8px rgba(124,140,78,0.1)"
                    : "0 2px 12px rgba(44, 31, 14, 0.05)",
                  transition: "all 0.25s ease",
                  transform: hoveredStep === i ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {/* Large faded step number */}
                <div style={{
                  position: "absolute",
                  top: 12, right: 16,
                  fontSize: 56,
                  fontWeight: 700,
                  color: "#7C8C4E",
                  opacity: 0.07,
                  lineHeight: 1,
                  pointerEvents: "none",
                  fontFamily: "'Playfair Display', serif",
                  userSelect: "none",
                }}>
                  {item.num}
                </div>

                {/* Icon */}
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #E8EDD6 0%, #D8E4B0 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                  border: "1px solid #C8D4A0",
                  boxShadow: "0 2px 8px rgba(124,140,78,0.1)",
                }}>
                  {item.icon}
                </div>

                <p style={{
                  fontSize: 11, fontWeight: 700,
                  color: "#7C8C4E", letterSpacing: "0.1em",
                  margin: 0, marginBottom: 8,
                  textTransform: "uppercase",
                }}>
                  Step {item.num}
                </p>

                <h3 style={{
                  fontSize: 17, fontWeight: 600,
                  color: "#2C1F0E",
                  margin: 0, marginBottom: 10,
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: "-0.2px",
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontSize: 13, color: "#9C8670",
                  margin: 0, lineHeight: 1.65,
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(221,213,196,0.6)",
        padding: "20px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backgroundColor: "rgba(247,244,238,0.7)",
        backdropFilter: "blur(8px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            backgroundColor: "#7C8C4E",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{
            fontSize: 15, fontWeight: 700,
            color: "#2C1F0E",
            fontFamily: "'Playfair Display', serif",
          }}>
            Certiva
          </span>
        </div>
        <span style={{ fontSize: 12, color: "#9C8670" }}>
          Certificate automation, done right.
        </span>
      </div>
    </div>
  );
}