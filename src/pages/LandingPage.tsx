import { useEffect, useRef } from "react";
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

export default function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

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

    // Init particles
    const count = 60;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 140, 78, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
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
    }}>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <nav style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: "rgba(247, 244, 238, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #DDD5C4",
        padding: "0 48px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#2C1F0E",
          letterSpacing: "-0.4px",
        }}>
          Certiva
        </span>

        <button
          onClick={() => navigate("/upload")}
          style={{
            padding: "9px 22px",
            backgroundColor: "#7C8C4E",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6A7A3E"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7C8C4E"}
        >
          Get Started →
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px 60px",
        position: "relative",
        zIndex: 1,
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block",
          backgroundColor: "#E8EDD6",
          borderRadius: 20,
          padding: "6px 16px",
          marginBottom: 24,
          border: "1px solid #C8D4A0",
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#7C8C4E",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Certificate Automation
          </span>
        </div>

        <h1 style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#2C1F0E",
          margin: 0,
          marginBottom: 20,
          letterSpacing: "-1px",
          lineHeight: 1.1,
          maxWidth: 640,
        }}>
          Certificates,{" "}
          <span style={{ color: "#7C8C4E" }}>without</span>
          <br />
          the chaos.
        </h1>

        <p style={{
          fontSize: 18,
          color: "#9C8670",
          margin: 0,
          marginBottom: 40,
          maxWidth: 480,
          lineHeight: 1.7,
        }}>
          Upload your template, map your participant list, and generate
          hundreds of personalized certificates in seconds.
        </p>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => navigate("/upload")}
            style={{
              padding: "14px 32px",
              backgroundColor: "#7C8C4E",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 16px rgba(124, 140, 78, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#6A7A3E";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#7C8C4E";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get Started — it's free →
          </button>
        </div>

        {/* How it works */}
        <div style={{
          marginTop: 100,
          display: "flex",
          gap: 32,
          alignItems: "flex-start",
          maxWidth: 780,
          width: "100%",
        }}>
          {[
            {
              step: "01",
              title: "Upload your files",
              desc: "Upload your PDF certificate template and your participant spreadsheet or CSV.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="17 8 12 3 7 8" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="3" x2="12" y2="15" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              step: "02",
              title: "Place the name field",
              desc: "Drag a text box onto your certificate template to mark where names should appear.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#7C8C4E" strokeWidth="2" />
                  <path d="M9 9h6M12 9v6" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              step: "03",
              title: "Generate & download",
              desc: "Click generate and download a ZIP of personalized certificates for every participant.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="22 4 12 14.01 9 11.01" stroke="#7C8C4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(8px)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #EFE9DA",
                textAlign: "left",
                boxShadow: "0 2px 12px rgba(44, 31, 14, 0.06)",
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: "#E8EDD6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                border: "1px solid #C8D4A0",
              }}>
                {item.icon}
              </div>

              <p style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#7C8C4E",
                letterSpacing: "0.08em",
                margin: 0,
                marginBottom: 6,
                textTransform: "uppercase",
              }}>
                Step {item.step}
              </p>

              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#2C1F0E",
                margin: 0,
                marginBottom: 8,
              }}>
                {item.title}
              </h3>

              <p style={{
                fontSize: 13,
                color: "#9C8670",
                margin: 0,
                lineHeight: 1.6,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid #DDD5C4",
        padding: "20px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(247, 244, 238, 0.6)",
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#2C1F0E" }}>
          Certiva
        </span>
        <span style={{ fontSize: 12, color: "#9C8670" }}>
          Certificate automation, done right.
        </span>
      </div>
    </div>
  );
}