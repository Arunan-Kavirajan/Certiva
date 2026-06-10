import { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import type { FieldPosition } from "../../types/certificate";
import FieldBox from "./FieldBox";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const MIN_DRAW_SIZE = 10;
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 60;

interface DrawState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface PdfViewerProps {
  file: File;
  selectedField: string;
  fieldPositions: FieldPosition[];
  onFieldChange: (position: FieldPosition) => void;
}

export default function PdfViewer({
  file,
  selectedField,
  fieldPositions,
  onFieldChange,
}: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawState, setDrawState] = useState<DrawState | null>(null);

  const getRelativePos = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  useEffect(() => {
    if (!drawState) return;

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getRelativePos(e);
      setDrawState((prev) =>
        prev ? { ...prev, currentX: pos.x, currentY: pos.y } : null
      );
    };

    const handleMouseUp = (e: MouseEvent) => {
      const pos = getRelativePos(e);
      const dx = Math.abs(pos.x - drawState.startX);
      const dy = Math.abs(pos.y - drawState.startY);

      let w: number, h: number, cx: number, cy: number;

      if (dx < MIN_DRAW_SIZE && dy < MIN_DRAW_SIZE) {
        w = DEFAULT_WIDTH;
        h = DEFAULT_HEIGHT;
        cx = drawState.startX;
        cy = drawState.startY;
      } else {
        const left = Math.min(drawState.startX, pos.x);
        const top = Math.min(drawState.startY, pos.y);
        w = Math.max(dx, 60);
        h = Math.max(dy, 30);
        cx = left + w / 2;
        cy = top + h / 2;
      }

      onFieldChange({
        field: selectedField,
        x: cx,
        y: cy,
        width: w,
        height: h,
        align: "center",
        fontSize: 32,
        minFontSize: 16,
      });

      setDrawState(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drawState, selectedField, onFieldChange, getRelativePos]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDrawState({ startX: x, startY: y, currentX: x, currentY: y });
    },
    []
  );

  const drawPreview: FieldPosition | null = drawState
    ? (() => {
        const left = Math.min(drawState.startX, drawState.currentX);
        const top = Math.min(drawState.startY, drawState.currentY);
        const w = Math.max(Math.abs(drawState.currentX - drawState.startX), 2);
        const h = Math.max(Math.abs(drawState.currentY - drawState.startY), 2);
        return {
          field: selectedField,
          x: left + w / 2,
          y: top + h / 2,
          width: w,
          height: h,
          align: "center" as const,
          fontSize: 32,
          minFontSize: 16,
        };
      })()
    : null;

  return (
    <Document
      file={file}
      onLoadSuccess={() => console.log("PDF loaded")}
      onLoadError={(error) => console.error("PDF error:", error)}
    >
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        className="inline-block cursor-crosshair"
        style={{ position: "relative", userSelect: "none" }}
      >
        <Page pageNumber={1} width={800} />

        {fieldPositions.map((pos) => (
          <FieldBox
            key={pos.field}
            position={pos}
            onUpdate={onFieldChange}
          />
        ))}

        {drawPreview && (
          <FieldBox
            key="__draw_preview__"
            position={drawPreview}
            isDrawPreview
          />
        )}
      </div>
    </Document>
  );
}