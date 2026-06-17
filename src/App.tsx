import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import TemplateEditorPage from "./pages/TemplateEditorPage";
import GeneratingPage from "./pages/GeneratingPage";
import DownloadPage from "./pages/DownloadPage";
import MobileBlocker from "./components/shared/MobileBlocker";

const MOBILE_BREAKPOINT = 768;

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <MobileBlocker />;
  }

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