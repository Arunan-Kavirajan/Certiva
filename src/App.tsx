import { BrowserRouter, Routes, Route } from "react-router-dom";

import UploadPage from "./pages/UploadPage";
import TemplateEditorPage from "./pages/TemplateEditorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/editor" element={<TemplateEditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;