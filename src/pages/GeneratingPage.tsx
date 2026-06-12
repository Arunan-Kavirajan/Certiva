import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCertificate } from "../context/CertificateContext";
import { generateAllCertificates } from "../utils/generateAllCertificates";

export default function GeneratingPage() {
  const navigate = useNavigate();
  const {
    pdfFile,
    fieldPositions,
    sheetRows,
    nameColumn,
    setZipBlob,
  } = useCertificate();

  const [current, setCurrent] = useState(0);
  const total = sheetRows.length;

  useEffect(() => {
    if (!pdfFile || fieldPositions.length === 0 || !nameColumn || sheetRows.length === 0) {
      navigate("/editor");
      return;
    }

    generateAllCertificates(
      pdfFile,
      fieldPositions[0],
      sheetRows,
      nameColumn,
      (done, _total) => setCurrent(done)
    ).then((zip) => {
      setZipBlob(zip);
      navigate("/download");
    });
  }, []);

  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Generating Certificates</h1>
        <p className="text-gray-500 mb-8">Please wait while we generate your certificates.</p>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-200"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-sm text-gray-500">
          {current} of {total} certificates done
        </p>
      </div>
    </div>
  );
}