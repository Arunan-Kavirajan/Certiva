const STEPS = ["Upload", "Edit", "Generate", "Download"];

interface NavbarProps {
  activeStep: number;
}

export default function Navbar({ activeStep }: NavbarProps) {
  return (
    <nav style={{
      backgroundColor: "rgba(247, 244, 238, 0.9)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(221, 213, 196, 0.6)",
      padding: "0 40px",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      zIndex: 10,
      position: "relative",
    }}>
      {/* Logo */}
      <div
        onClick={() => window.location.href = "/"}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
      >
        <div style={{
          width: 30, height: 30,
          borderRadius: 8,
          backgroundColor: "#7C8C4E",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(124,140,78,0.3)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{
          fontSize: 20, fontWeight: 700,
          color: "#2C1F0E", letterSpacing: "-0.3px",
          fontFamily: "'Playfair Display', serif",
        }}>
          Certiva
        </span>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {STEPS.map((step, i) => {
          const isActive = i === activeStep;
          const isComplete = i < activeStep;
          return (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 10px",
                borderRadius: 20,
                backgroundColor: isActive ? "#E8EDD6" : "transparent",
              }}>
                <div style={{
                  width: 20, height: 20,
                  borderRadius: "50%",
                  background: isActive || isComplete
                    ? "linear-gradient(135deg, #7C8C4E, #5C7030)"
                    : "#DDD5C4",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                  color: isActive || isComplete ? "white" : "#9C8670",
                  boxShadow: isActive ? "0 2px 6px rgba(124,140,78,0.3)" : "none",
                }}>
                  {isComplete ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#2C1F0E" : isComplete ? "#7C8C4E" : "#9C8670",
                }}>
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 24, height: 1.5,
                  background: isComplete
                    ? "linear-gradient(to right, #7C8C4E, #C8D4A0)"
                    : "#DDD5C4",
                  transition: "background 0.3s",
                }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ width: 120 }} />
    </nav>
  );
}