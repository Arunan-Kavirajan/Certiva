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
        border: `2px dashed ${file ? "#7C8C4E" : isDragActive ? "#7C8C4E" : "#DDD5C4"}`,
        backgroundColor: file ? "#F4F6ED" : isDragActive ? "#F4F6ED" : "#FFFFFF",
        borderRadius: 16,
        padding: "28px 24px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <input {...getInputProps()} />

      {/* Icon */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: file ? "#E8EDD6" : "#EFE9DA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2"
            stroke={file ? "#7C8C4E" : "#9C8670"} strokeWidth="2" />
          <path d="M3 9h18M3 15h18M9 3v18"
            stroke={file ? "#7C8C4E" : "#9C8670"} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Text */}
      <div>
        <p style={{
          fontSize: 14,
          fontWeight: 600,
          color: file ? "#2C1F0E" : "#5C4A2A",
          margin: 0,
          marginBottom: 2,
        }}>
          {file ? file.name : "Participant List"}
        </p>
        <p style={{
          fontSize: 12,
          color: "#9C8670",
          margin: 0,
        }}>
          {file ? "Spreadsheet uploaded successfully" : "Drop your XLSX or CSV here or click to browse"}
        </p>
      </div>

      {/* Check mark if uploaded */}
      {file && (
        <div style={{
          marginLeft: "auto",
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: "#7C8C4E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}