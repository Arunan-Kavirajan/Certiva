const STEPS = ["Upload", "Edit", "Generate", "Download"];

interface NavbarProps {
  activeStep: number; // 0-indexed
}

export default function Navbar({ activeStep }: NavbarProps) {
  return (
    <nav style={{
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #DDD5C4",
      padding: "0 40px",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      zIndex: 10,
      position: "relative",
    }}>
      <span style={{
        fontSize: 20,
        fontWeight: 700,
        color: "#2C1F0E",
        letterSpacing: "-0.3px",
      }}>
        Certiva
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {STEPS.map((step, i) => {
          const isActive = i === activeStep;
          const isComplete = i < activeStep;
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
                  backgroundColor: isActive || isComplete ? "#7C8C4E" : "#DDD5C4",
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
                  color: isActive ? "#2C1F0E" : isComplete ? "#7C8C4E" : "#9C8670",
                }}>
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 24,
                  height: 1.5,
                  backgroundColor: isComplete ? "#7C8C4E" : "#DDD5C4",
                  transition: "background-color 0.3s",
                }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ width: 100 }} />
    </nav>
  );
}