import { useDropzone } from "react-dropzone";

interface SpreadsheetUploaderProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export default function SpreadsheetUploader({ file, onFileSelect }: SpreadsheetUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) onFileSelect(acceptedFiles[0]);
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${file ? "#5C4A2A" : isDragActive ? "#7C8C4E" : "#DDD5C4"}`,
        background: file
          ? "linear-gradient(135deg, rgba(92,74,42,0.06), rgba(92,74,42,0.03))"
          : isDragActive
            ? "rgba(232,237,214,0.4)"
            : "rgba(247,244,238,0.6)",
        borderRadius: 14,
        padding: "20px 20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 16,
        backdropFilter: "blur(4px)",
      }}
    >
      <input {...getInputProps()} />

      <div style={{
        width: 44, height: 44,
        borderRadius: 12,
        background: file
          ? "linear-gradient(135deg, rgba(92,74,42,0.15), rgba(92,74,42,0.08))"
          : "linear-gradient(135deg, #EFE9DA, #E8E0D0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: file ? "0 2px 8px rgba(92,74,42,0.1)" : "none",
        transition: "all 0.2s ease",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2"
            stroke={file ? "#5C4A2A" : "#9C8670"} strokeWidth="2" />
          <path d="M3 9h18M3 15h18M9 3v18"
            stroke={file ? "#5C4A2A" : "#9C8670"} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 14, fontWeight: 600,
          color: file ? "#2C1F0E" : "#5C4A2A",
          margin: 0, marginBottom: 2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {file ? file.name : "Participant List"}
        </p>
        <p style={{ fontSize: 12, color: "#9C8670", margin: 0 }}>
          {file ? "✓ Spreadsheet uploaded" : isDragActive ? "Drop it here..." : "Drop your XLSX or CSV here or click to browse"}
        </p>
      </div>

      {file && (
        <div style={{
          width: 26, height: 26,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #5C4A2A, #3C2A0E)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(92,74,42,0.3)",
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}