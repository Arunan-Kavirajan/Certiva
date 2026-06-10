import PdfViewer from "../components/pdf/PdfViewer";
import { useCertificate } from "../context/CertificateContext";
import type { FieldPosition } from "../context/CertificateContext";

export default function TemplateEditorPage() {
  const { pdfFile, fieldPositions, setFieldPositions } = useCertificate();

  if (!pdfFile) {
    return <div className="p-6">No PDF uploaded.</div>;
  }

  const handleFieldChange = (updated: FieldPosition) => {
    setFieldPositions([updated]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Template Editor</h1>

      <div className="bg-white p-4 rounded-xl shadow">
        <PdfViewer
          file={pdfFile}
          selectedField="Name"
          fieldPositions={fieldPositions}
          onFieldChange={handleFieldChange}
        />
      </div>
    </div>
  );
}