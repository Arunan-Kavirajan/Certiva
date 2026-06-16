import { useRef, useEffect, useState } from "react";
import type { FieldPosition } from "../../types/certificate";

type ColorSet = {
  border: string;
  bg: string;
  text: string;
};

const FIELD_COLORS: { [key: string]: ColorSet } = {
  Name: {
    border: "rgba(124, 140, 78, 0.85)",
    bg: "rgba(124, 140, 78, 0.08)",
    text: "rgba(124, 140, 78, 0.95)",
  },
  Event: {
    border: "rgba(92, 74, 42, 0.85)",
    bg: "rgba(92, 74, 42, 0.08)",
    text: "rgba(92, 74, 42, 0.95)",
  },
  Date: {
    border: "rgba(74, 96, 130, 0.85)",
    bg: "rgba(74, 96, 130, 0.08)",
    text: "rgba(74, 96, 130, 0.95)",
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
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  const colors: ColorSet = FIELD_COLORS[field] ?? DEFAULT_COLORS;
  const isInteractive = !isDrawPreview;
  const previewText = "John Doe";

  const cssFont = FONT_CSS_MAP[fontFamily] ?? "Helvetica, Arial, sans-serif";
  const cssFontWeight = FONT_WEIGHT_MAP[fontFamily] ?? "400";

  const drawCanvas = (w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    const availableWidth = w - HORIZONTAL_PADDING * 2;
    let fitSize = fontSize;
    while (fitSize >= minFontSize) {
      ctx.font = `${cssFontWeight} ${fitSize}px ${cssFont}`;
      if (ctx.measureText(previewText).width <= availableWidth) break;
      fitSize--;
    }

    ctx.font = `${cssFontWeight} ${fitSize}px ${cssFont}`;
    ctx.fillStyle = colors.text;
    ctx.textBaseline = "alphabetic";

    const textY = h - BASELINE_PADDING;
    const textWidth = ctx.measureText(previewText).width;
    let textX = HORIZONTAL_PADDING;
    if (align === "center") textX = (w - textWidth) / 2;
    else if (align === "right") textX = w - HORIZONTAL_PADDING - textWidth;

    ctx.fillText(previewText, textX, textY);
  };

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
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        ...style,
      }}
    />
  );

  return (
    <div
      ref={boxRef}
      onMouseDown={isInteractive ? startMove : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        border: `2px dashed ${colors.border}`,
        backgroundColor: colors.bg,
        borderRadius: 8,
        boxSizing: "border-box",
        pointerEvents: isInteractive ? "auto" : "none",
        overflow: "visible",
        opacity: isDrawPreview ? 0.5 : 1,
        cursor: isInteractive ? "grab" : undefined,
        userSelect: "none",
        transition: "box-shadow 0.15s ease",
        boxShadow: isHovered ? `0 0 0 3px ${colors.bg}` : "none",
      }}
    >
      {/* Field label */}
      <span
        style={{
          position: "absolute",
          top: -22,
          left: 0,
          fontSize: 11,
          fontWeight: 600,
          color: colors.text,
          backgroundColor: isDrawPreview ? "transparent" : "white",
          padding: "2px 7px",
          borderRadius: 5,
          lineHeight: "14px",
          letterSpacing: "0.02em",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          boxShadow: isDrawPreview ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        {field}
      </span>

      {/* Delete button — refined, fades in on hover */}
      {isInteractive && onDelete && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: "absolute",
            top: -12,
            right: -12,
            width: 22,
            height: 22,
            borderRadius: "50%",
            backgroundColor: isDeleteHovered ? "#E05A4A" : "#FFFFFF",
            border: `1.5px solid ${isDeleteHovered ? "#E05A4A" : "#DDD5C4"}`,
            color: isDeleteHovered ? "#FFFFFF" : "#9C8670",
            cursor: "pointer",
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "scale(1)" : "scale(0.8)",
            transition: "all 0.15s ease",
            boxShadow: "0 2px 6px rgba(44,31,14,0.15)",
          }}
          title="Remove field"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Canvas for preview text */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          borderRadius: 8,
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