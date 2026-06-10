import { useDropzone } from "react-dropzone";

interface PdfUploaderProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export default function PdfUploader({
  file,
  onFileSelect,
}: PdfUploaderProps) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-xl p-8 bg-white text-center cursor-pointer"
    >
      <input {...getInputProps()} />

      {file ? (
        <p className="font-medium">{file.name}</p>
      ) : (
        <p>Upload PDF Template</p>
      )}
    </div>
  );
}