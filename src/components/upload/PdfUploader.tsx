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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke={file ? "#7C8C4E" : "#9C8670"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14 2 14 8 20 8"
            stroke={file ? "#7C8C4E" : "#9C8670"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          {file ? file.name : "Certificate Template"}
        </p>
        <p style={{
          fontSize: 12,
          color: "#9C8670",
          margin: 0,
        }}>
          {file ? "PDF uploaded successfully" : "Drop your PDF here or click to browse"}
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