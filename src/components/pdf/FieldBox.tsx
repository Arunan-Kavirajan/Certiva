import { useMemo, useRef } from "react";
import type { FieldPosition } from "../../types/certificate";

type ColorSet = {
  border: string;
  bg: string;
  text: string;
};

const SAMPLE_TEXT: { [key: string]: string } = {
  Name: "John Doe",
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

const FONT_FAMILY = "sans-serif";
const HORIZONTAL_PADDING = 16;
const MIN_WIDTH = 80;
const MIN_HEIGHT = 30;
const BASELINE_PADDING = 10;

function computeFittedFontSize(
  text: string,
  maxWidth: number,
  maxFontSize: number,
  minFontSize: number
): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return minFontSize;
  for (let size = maxFontSize; size >= minFontSize; size--) {
    ctx.font = `${size}px ${FONT_FAMILY}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
  }
  return minFontSize;
}

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
  const { field, x, y, width, height, align, fontSize, minFontSize } = position;

  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const text = SAMPLE_TEXT[field] ?? field;
  const colors: ColorSet = FIELD_COLORS[field] ?? DEFAULT_COLORS;
  const availableWidth = width - HORIZONTAL_PADDING * 2;

  const fittedSize = useMemo(
    () => computeFittedFontSize(text, availableWidth, fontSize, minFontSize),
    [text, availableWidth, fontSize, minFontSize]
  );

  const textAlign = align as React.CSSProperties["textAlign"];
  const textTop = height - BASELINE_PADDING - fittedSize;

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

      // Update text position directly so it stays pinned to bottom during resize
      if (textRef.current) {
        textRef.current.style.top = `${newH - BASELINE_PADDING - fittedSize}px`;
      }
    };

    const onMouseUp = () => {
      onUpdate?.(latestPos);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const isInteractive = !isDrawPreview;

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

      {/* Sample text pinned to bottom */}
      <span
        ref={textRef}
        style={{
          position: "absolute",
          top: textTop,
          left: HORIZONTAL_PADDING,
          right: HORIZONTAL_PADDING,
          fontSize: fittedSize,
          fontFamily: FONT_FAMILY,
          color: colors.text,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign,
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {text}
      </span>

      {/* 4 corner resize handles only */}
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