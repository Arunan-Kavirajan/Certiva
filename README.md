# Certiva

**Certificates, without the chaos.**

Built by [Arunan Kavirajan](https://github.com/Arunan-Kavirajan) — a browser-based 
certificate automation platform built to eliminate the manual, repetitive process 
of generating certificates for events, workshops, competitions, and training programs.

Certiva is a web-based certificate automation platform that eliminates the manual, repetitive process of generating certificates for events, workshops, competitions, and training programs. Upload a certificate template and a participant spreadsheet, visually place text fields, and generate hundreds of personalized certificates in seconds — entirely in the browser.

---

## Features

- **PDF template upload** — drag and drop your certificate design as a PDF
- **Spreadsheet support** — upload participant data as XLSX or CSV (including raw Google Forms exports)
- **Visual field editor** — draw, drag, and resize text boxes directly on the certificate to mark where Name, Event, and Date should appear
- **Flexible data mapping** — map each field to a spreadsheet column, or enter fixed text that stays the same across every certificate
- **Per-field text formatting** — font family, font size, minimum font size (auto-shrink), and text alignment, configurable independently for each field
- **Live certificate preview** — see exactly how the first certificate will look before generating the full batch, rendered directly in-browser
- **Bulk generation** — generates a personalized PDF for every row in the spreadsheet
- **Error handling** — if any individual certificate fails to generate, the rest continue uninterrupted and a report is shown listing what failed and why
- **One-click ZIP export** — download every generated certificate bundled into a single ZIP file
- **Desktop-first experience** — the editor is intentionally desktop-only; visiting on a mobile or narrow viewport shows a friendly notice instead of a broken layout
- **Fully client-side** — no files are ever uploaded to a server; all PDF parsing, rendering, and generation happens locally in the browser

---

## Tech Stack

### Frontend

- **React** — UI library
- **Vite** — build tool and dev server
- **TypeScript** — static typing across the app
- **Tailwind CSS** — utility-first styling (supplemented with inline styles for fine-grained control)
- **React Router** — client-side routing between Upload → Editor → Generating → Download

### Core libraries

- **react-pdf** / **pdfjs-dist** — renders PDF templates and generated certificates directly in the browser
- **pdf-lib** — manipulates PDF files to stamp personalized text onto each certificate
- **xlsx** — parses uploaded Excel (.xlsx) and CSV spreadsheets
- **jszip** — bundles all generated certificates into a downloadable ZIP archive
- **react-dropzone** — drag-and-drop file upload handling

---

## Project Structure

```
src/
├── components/
│   ├── pdf/
│   │   ├── PdfViewer.tsx       # Renders the PDF template and manages field placement/drawing
│   │   └── FieldBox.tsx        # Draggable, resizable text field box with live preview text
│   ├── shared/
│   │   ├── Navbar.tsx          # Shared navbar with step indicator, used across all pages
│   │   └── MobileBlocker.tsx   # Desktop-only notice shown on narrow viewports
│   └── upload/
│       ├── PdfUploader.tsx     # PDF template dropzone
│       └── SpreadsheetUploader.tsx  # XLSX/CSV dropzone
├── context/
│   └── CertificateContext.tsx  # Global state: files, field positions, column mappings, results
├── pages/
│   ├── LandingPage.tsx         # Marketing landing page with animated particle background
│   ├── UploadPage.tsx          # File upload step
│   ├── TemplateEditorPage.tsx  # Visual field editor + live preview
│   ├── GeneratingPage.tsx      # Bulk generation progress screen
│   └── DownloadPage.tsx        # Final results + ZIP download
├── types/
│   └── certificate.ts          # Shared types: FieldPosition, FieldType, column mappings, color tokens
├── utils/
│   ├── generateCertificate.ts      # Stamps all configured fields onto a single PDF
│   └── generateAllCertificates.ts  # Iterates every spreadsheet row, builds the ZIP, tracks errors
└── App.tsx                     # Routes + mobile breakpoint detection
```

---

## How It Works

```
Upload Page
     │  PDF template + spreadsheet (XLSX/CSV)
     ▼
Template Editor
     │  Draw Name / Event / Date boxes on the certificate
     │  Map each field to a spreadsheet column, or enter fixed text
     │  Adjust font, size, and alignment per field
     │  Preview a single certificate to confirm placement
     ▼
Generating Page
     │  Iterates every row in the spreadsheet
     │  Stamps each field onto a copy of the PDF template
     │  Packages all results into a ZIP, tracking any failures
     ▼
Download Page
     │  Shows success/failure summary
     ▼
Certificates.zip
```

All certificate generation — text fitting, font embedding, coordinate placement — happens via `pdf-lib` directly in the browser. Nothing is sent to a server.

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
git clone <repository-url>
cd certiva
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Design System

Certiva uses a warm, editorial color palette inspired by stationery and certificate design:

| Token          | Color                 | Usage                                     |
| -------------- | --------------------- | ------------------------------------------ |
| Background     | `#F7F4EE`             | Page background (warm cream)              |
| Surface        | `#FFFFFF`             | Cards and panels                          |
| Subtle surface | `#EFE9DA`             | Section backgrounds, dividers             |
| Primary        | `#7C8C4E`             | Buttons, active states, Name field accent |
| Primary hover  | `#6A7A3E` / `#5C7030` | Hover/gradient states                     |
| Heading text   | `#2C1F0E`             | Headings, high-emphasis text              |
| Body text      | `#5C4A2A`             | Body copy                                 |
| Muted text     | `#9C8670`             | Labels, secondary text                    |
| Border         | `#DDD5C4`             | Default borders                           |
| Danger         | `#E05A4A`             | Errors, delete actions                    |

Typography pairs **Playfair Display** (serif, for headings and emphasis) with **Inter** (sans-serif, for body and UI text), loaded via Google Fonts.

---

## Browser Support

Certiva's editor is designed for desktop and laptop screens (768px width and above). Visiting on a mobile device or narrow window shows a dedicated notice asking the user to switch to a larger screen, since the visual field editor relies on precise mouse-based drag and resize interactions.

---

## Author

**Arunan Kavirajan** — IT undergraduate at SRM Institute of Science and Technology (SRMIST), Chennai, building software with AI integration.

[GitHub](https://github.com/Arunan-Kavirajan) · [LinkedIn](https://linkedin.com/in/arunan-kavirajan)
