export default function MobileBlocker() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F7F4EE",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
      textAlign: "center",
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: "absolute", top: -120, left: -120,
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,140,78,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -100, right: -100,
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(92,74,42,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo mark */}
      <div style={{
        width: 64, height: 64,
        borderRadius: 16,
        background: "linear-gradient(135deg, #7C8C4E, #5C7030)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 28,
        boxShadow: "0 6px 20px rgba(124,140,78,0.3)",
        position: "relative",
        zIndex: 1,
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <span style={{
        fontSize: 24, fontWeight: 700, color: "#2C1F0E",
        fontFamily: "'Playfair Display', serif",
        marginBottom: 32,
        position: "relative", zIndex: 1,
      }}>
        Certiva
      </span>

      {/* Desktop icon illustration */}
      <div style={{
        width: 90, height: 64,
        position: "relative",
        marginBottom: 28,
        zIndex: 1,
      }}>
        <svg width="90" height="64" viewBox="0 0 90 64" fill="none">
          <rect x="4" y="2" width="82" height="50" rx="4" fill="#FFFFFF" stroke="#DDD5C4" strokeWidth="2"/>
          <rect x="10" y="10" width="70" height="34" rx="2" fill="#EFE9DA"/>
          <rect x="34" y="56" width="22" height="4" rx="2" fill="#DDD5C4"/>
          <rect x="28" y="52" width="34" height="6" rx="2" fill="#C4B8A8"/>
        </svg>
      </div>

      <h1 style={{
        fontSize: 22, fontWeight: 700, color: "#2C1F0E",
        margin: 0, marginBottom: 12,
        fontFamily: "'Playfair Display', serif",
        maxWidth: 320, lineHeight: 1.3,
        position: "relative", zIndex: 1,
      }}>
        Best experienced on a larger screen
      </h1>

      <p style={{
        fontSize: 14, color: "#9C8670",
        margin: 0, maxWidth: 320,
        lineHeight: 1.7,
        position: "relative", zIndex: 1,
      }}>
        Certiva's certificate editor needs more room to work its magic.
        Please open this page on a desktop or laptop computer to continue.
      </p>

      <div style={{
        marginTop: 32,
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 16px",
        backgroundColor: "rgba(232,237,214,0.6)",
        borderRadius: 99,
        border: "1px solid #C8D4A0",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          backgroundColor: "#7C8C4E",
        }} />
        <span style={{ fontSize: 12, color: "#5C7030", fontWeight: 500 }}>
          Works great on screens 768px and wider
        </span>
      </div>
    </div>
  );
}