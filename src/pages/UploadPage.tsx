import { useNavigate } from "react-router-dom";
import { useCertificate } from "../context/CertificateContext";
import PdfUploader from "../components/upload/PdfUploader";
import SpreadsheetUploader from "../components/upload/SpreadsheetUploader";

export default function UploadPage() {
  const navigate = useNavigate();

const {
  pdfFile,
  setPdfFile,
  sheetFile,
  setSheetFile,
} = useCertificate();

  const handleContinue = () => {
    if (!pdfFile || !sheetFile) return;

    navigate("/editor");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-2">
        Certiva
      </h1>

      <p className="text-gray-600 mb-10">
        Certificate Automation Platform
      </p>

      <div className="w-full max-w-md space-y-4">
        <PdfUploader
          file={pdfFile}
          onFileSelect={setPdfFile}
        />

        <SpreadsheetUploader
          file={sheetFile}
          onFileSelect={setSheetFile}
        />

        <button
          onClick={handleContinue}
          disabled={!pdfFile || !sheetFile}
          className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}