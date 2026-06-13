import { useRef, useEffect } from "react";
import type { FieldPosition } from "../../types/certificate";

type ColorSet = {
  border: string;
  bg: string;
  text: string;
};

const FIELD_COLORS: { [key: string]: ColorSet } = {
  Name: {
    border: "rgba(124, 140, 78, 0.8)",
    bg: "rgba(124, 140, 78, 0.08)",
    text: "rgba(124, 140, 78, 0.9)",
  },
};

const DEFAULT_COLORS: ColorSet = {
  border: "rgba(107, 114, 128, 0.7)",
  bg: "rgba(107, 114, 128, 0.08)",
  text: "rgba(107, 114, 128, 0.9)",
};

const HORIZONTAL_PADDING = 16;
const MIN_WIDTH = 80;
const MIN_HEIGHT = 30;
const BASELINE_PADDING = 10;

// Map our fontFamily values to CSS-compatible font names
const FONT_CSS_MAP: { [key: string]: string } = {
  "Helvetica": "Helvetica, Arial, sans-serif",
  "Helvetica-Bold": "Helvetica, Arial, sans-serif",
  "Times-Roman": "Times New Roman, Times, serif",
  "Courier": "Courier New, Courier, monospace",
};

const FONT_WEIGHT_MAP: { [key: string]: string } = {
  "Helvetica": "400",
  "Helvetica-Bold": "700",
  "Times-Roman": "400",
  "Courier": "400",
};

type HandleType = "tl" | "tr" | "bl" | "br";

interface FieldBoxProps {
  position: FieldPosition;
  isDrawPreview?: boolean;
  onUpdate?: (updated: FieldPosition) => void;
  onDelete?: () => void;
}

export default function FieldBox({
  position,
  isDrawPreview = false,
  onUpdate,
  onDelete,
}: FieldBoxProps) {
  const { field, x, y, width, height, align, fontSize, minFontSize, fontFamily } = position;

  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors: ColorSet = FIELD_COLORS[field] ?? DEFAULT_COLORS;
  const isInteractive = !isDrawPreview;

  // Get the actual first name from the sheet, fall back to "John Doe"
  const previewText = "John Doe";

  const cssFont = FONT_CSS_MAP[fontFamily] ?? "Helvetica, Arial, sans-serif";
  const cssFontWeight = FONT_WEIGHT_MAP[fontFamily] ?? "400";

  // Draw text on canvas pinned to the bottom baseline
  const drawCanvas = (w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);

    const availableWidth = w - HORIZONTAL_PADDING * 2;

    // Find the fitting font size
    let fitSize = fontSize;
    while (fitSize >= minFontSize) {
      ctx.font = `${cssFontWeight} ${fitSize}px ${cssFont}`;
      if (ctx.measureText(previewText).width <= availableWidth) break;
      fitSize--;
    }

    ctx.font = `${cssFontWeight} ${fitSize}px ${cssFont}`;
    ctx.fillStyle = colors.text;
    ctx.textBaseline = "alphabetic";

    // Pin text baseline to bottom of canvas minus padding
    const textY = h - BASELINE_PADDING;

    const textWidth = ctx.measureText(previewText).width;
    let textX = HORIZONTAL_PADDING;
    if (align === "center") {
      textX = (w - textWidth) / 2;
    } else if (align === "right") {
      textX = w - HORIZONTAL_PADDING - textWidth;
    }

    ctx.fillText(previewText, textX, textY);
  };

  // Redraw whenever any formatting or size changes
  useEffect(() => {
    drawCanvas(width, height);
  }, [width, height, fontSize, minFontSize, fontFamily, align, previewText]);

  const startMove = (e: React.MouseEvent) => {
    if (isDrawPreview) return;
    e.stopPropagation();
    e.preventDefault();

    const startMX = e.clientX;
    const startMY = e.clientY;
    let latestX = x;
    let latestY = y;

    const onMouseMove = (ev: MouseEvent) => {
      latestX = x + (ev.clientX - startMX);
      latestY = y + (ev.clientY - startMY);
      if (boxRef.current) {
        boxRef.current.style.left = `${latestX - width / 2}px`;
        boxRef.current.style.top = `${latestY - height / 2}px`;
      }
    };

    const onMouseUp = () => {
      onUpdate?.({ ...position, x: latestX, y: latestY });
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const startResize = (e: React.MouseEvent, handle: HandleType) => {
    e.stopPropagation();
    e.preventDefault();

    const startMX = e.clientX;
    const startMY = e.clientY;

    const initLeft = x - width / 2;
    const initTop = y - height / 2;
    const initRight = x + width / 2;
    const initBottom = y + height / 2;

    let latestPos = { ...position };

    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startMX;
      const dy = ev.clientY - startMY;

      let newLeft = initLeft;
      let newTop = initTop;
      let newRight = initRight;
      let newBottom = initBottom;

      if (handle === "tl" || handle === "bl") newLeft = initLeft + dx;
      if (handle === "tr" || handle === "br") newRight = initRight + dx;
      if (handle === "tl" || handle === "tr") newTop = initTop + dy;
      if (handle === "bl" || handle === "br") newBottom = initBottom + dy;

      if (newRight - newLeft < MIN_WIDTH) {
        if (handle.includes("l")) newLeft = newRight - MIN_WIDTH;
        else newRight = newLeft + MIN_WIDTH;
      }
      if (newBottom - newTop < MIN_HEIGHT) {
        if (handle.includes("t")) newTop = newBottom - MIN_HEIGHT;
        else newBottom = newTop + MIN_HEIGHT;
      }

      const newW = newRight - newLeft;
      const newH = newBottom - newTop;
      const newCX = newLeft + newW / 2;
      const newCY = newTop + newH / 2;

      latestPos = { ...position, x: newCX, y: newCY, width: newW, height: newH };

      if (boxRef.current) {
        boxRef.current.style.left = `${newLeft}px`;
        boxRef.current.style.top = `${newTop}px`;
        boxRef.current.style.width = `${newW}px`;
        boxRef.current.style.height = `${newH}px`;
      }

      // Redraw canvas at new size
      drawCanvas(newW, newH);
    };

    const onMouseUp = () => {
      onUpdate?.(latestPos);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const Handle = ({
    style,
    handle,
  }: {
    style: React.CSSProperties;
    handle: HandleType;
  }) => (
    <div
      onMouseDown={(e) => startResize(e, handle)}
      style={{
        position: "absolute",
        width: 10,
        height: 10,
        backgroundColor: "white",
        border: `2px solid ${colors.border}`,
        borderRadius: "50%",
        boxSizing: "border-box",
        pointerEvents: "auto",
        zIndex: 10,
        ...style,
      }}
    />
  );

  return (
    <div
      ref={boxRef}
      onMouseDown={isInteractive ? startMove : undefined}
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        border: `2px dashed ${colors.border}`,
        backgroundColor: colors.bg,
        borderRadius: 6,
        boxSizing: "border-box",
        pointerEvents: isInteractive ? "auto" : "none",
        overflow: "visible",
        opacity: isDrawPreview ? 0.5 : 1,
        cursor: isInteractive ? "grab" : undefined,
        userSelect: "none",
      }}
    >
      {/* Field label */}
      <span
        style={{
          position: "absolute",
          top: -20,
          left: 0,
          fontSize: 11,
          fontWeight: 600,
          color: colors.text,
          backgroundColor: isDrawPreview ? "transparent" : "white",
          padding: "0 4px",
          borderRadius: 3,
          lineHeight: "16px",
          letterSpacing: "0.02em",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {field}
      </span>

      {/* Delete button */}
      {isInteractive && onDelete && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: "absolute",
            top: -28,
            right: -2,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "#E05A4A",
            border: "none",
            color: "white",
            fontSize: 13,
            cursor: "pointer",
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
          title="Remove field"
        >
          ×
        </button>
      )}

      {/* Canvas for preview text — pinned exactly to bottom */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          borderRadius: 6,
        }}
      />

      {/* 4 corner handles */}
      {isInteractive && (
        <>
          <Handle handle="tl" style={{ top: -5, left: -5, cursor: "nwse-resize" }} />
          <Handle handle="tr" style={{ top: -5, right: -5, cursor: "nesw-resize" }} />
          <Handle handle="bl" style={{ bottom: -5, left: -5, cursor: "nesw-resize" }} />
          <Handle handle="br" style={{ bottom: -5, right: -5, cursor: "nwse-resize" }} />
        </>
      )}
    </div>
  );
}