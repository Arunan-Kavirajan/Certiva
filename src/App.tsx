import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import TemplateEditorPage from "./pages/TemplateEditorPage";
import GeneratingPage from "./pages/GeneratingPage";
import DownloadPage from "./pages/DownloadPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/editor" element={<TemplateEditorPage />} />
        <Route path="/generating" element={<GeneratingPage />} />
        <Route path="/download" element={<DownloadPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;