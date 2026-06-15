import { useDropzone } from "react-dropzone";

interface PdfUploaderProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export default function PdfUploader({ file, onFileSelect }: PdfUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
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
        background: file
          ? "linear-gradient(135deg, rgba(232,237,214,0.5), rgba(200,212,160,0.2))"
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
          ? "linear-gradient(135deg, #E8EDD6, #C8D4A0)"
          : "linear-gradient(135deg, #EFE9DA, #E8E0D0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: file ? "0 2px 8px rgba(124,140,78,0.15)" : "none",
        transition: "all 0.2s ease",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke={file ? "#7C8C4E" : "#9C8670"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14 2 14 8 20 8"
            stroke={file ? "#7C8C4E" : "#9C8670"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 14, fontWeight: 600,
          color: file ? "#2C1F0E" : "#5C4A2A",
          margin: 0, marginBottom: 2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {file ? file.name : "Certificate Template"}
        </p>
        <p style={{ fontSize: 12, color: "#9C8670", margin: 0 }}>
          {file ? "✓ PDF uploaded" : isDragActive ? "Drop it here..." : "Drop your PDF here or click to browse"}
        </p>
      </div>

      {file && (
        <div style={{
          width: 26, height: 26,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7C8C4E, #5C7030)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(124,140,78,0.3)",
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}