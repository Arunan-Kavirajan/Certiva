import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCertificate } from "../context/CertificateContext";

export default function DownloadPage() {
  const navigate = useNavigate();
  const { zipBlob, sheetRows } = useCertificate();

  useEffect(() => {
    if (!zipBlob) {
      navigate("/editor");
    }
  }, []);

  const handleDownload = () => {
    if (!zipBlob) return;
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Certificates.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Certificates Ready!</h1>
        <p className="text-gray-500 mb-8">
          {sheetRows.length} certificates have been generated successfully.
        </p>

        <button
          onClick={handleDownload}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
        >
          Download ZIP
        </button>

        <button
          onClick={() => navigate("/editor")}
          className="mt-3 w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
        >
          Back to Editor
        </button>
      </div>
    </div>
  );
}