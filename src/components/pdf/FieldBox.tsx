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
    border: "rgba(99, 102, 241, 0.7)",
    bg: "rgba(99, 102, 241, 0.08)",
    text: "rgba(99, 102, 241, 0.9)",
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

type HandleType = "tl" | "tc" | "tr" | "ml" | "mr" | "bl" | "bc" | "br";

interface FieldBoxProps {
  position: FieldPosition;
  isDrawPreview?: boolean;
  onUpdate?: (updated: FieldPosition) => void;
}

export default function FieldBox({
  position,
  isDrawPreview = false,
  onUpdate,
}: FieldBoxProps) {
  const { field, x, y, width, height, align, fontSize, minFontSize } = position;

  const liveRef = useRef<HTMLDivElement>(null);

  const text = SAMPLE_TEXT[field] ?? field;
  const colors: ColorSet = FIELD_COLORS[field] ?? DEFAULT_COLORS;
  const availableWidth = width - HORIZONTAL_PADDING * 2;

  const fittedSize = useMemo(
    () => computeFittedFontSize(text, availableWidth, fontSize, minFontSize),
    [text, availableWidth, fontSize, minFontSize]
  );

  const textAlign = align as React.CSSProperties["textAlign"];

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
      if (liveRef.current) {
        liveRef.current.style.left = `${latestX - width / 2}px`;
        liveRef.current.style.top = `${latestY - height / 2}px`;
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

      if (handle === "tl" || handle === "ml" || handle === "bl") newLeft = initLeft + dx;
      if (handle === "tr" || handle === "mr" || handle === "br") newRight = initRight + dx;
      if (handle === "tl" || handle === "tc" || handle === "tr") newTop = initTop + dy;
      if (handle === "bl" || handle === "bc" || handle === "br") newBottom = initBottom + dy;

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

      if (liveRef.current) {
        liveRef.current.style.left = `${newLeft}px`;
        liveRef.current.style.top = `${newTop}px`;
        liveRef.current.style.width = `${newW}px`;
        liveRef.current.style.height = `${newH}px`;
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
        width: 9,
        height: 9,
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
      ref={liveRef}
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${HORIZONTAL_PADDING}px`,
        boxSizing: "border-box",
        pointerEvents: isInteractive ? "auto" : "none",
        overflow: "visible",
        opacity: isDrawPreview ? 0.5 : 1,
        cursor: isInteractive ? "grab" : undefined,
        userSelect: "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -18,
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

      <span
        style={{
          fontSize: fittedSize,
          fontFamily: FONT_FAMILY,
          color: colors.text,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign,
          width: "100%",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {text}
      </span>

      {isInteractive && (
        <>
          <Handle handle="tl" style={{ top: -5, left: -5, cursor: "nwse-resize" }} />
          <Handle handle="tc" style={{ top: -5, left: "calc(50% - 4px)", cursor: "ns-resize" }} />
          <Handle handle="tr" style={{ top: -5, right: -5, cursor: "nesw-resize" }} />
          <Handle handle="ml" style={{ top: "calc(50% - 4px)", left: -5, cursor: "ew-resize" }} />
          <Handle handle="mr" style={{ top: "calc(50% - 4px)", right: -5, cursor: "ew-resize" }} />
          <Handle handle="bl" style={{ bottom: -5, left: -5, cursor: "nesw-resize" }} />
          <Handle handle="bc" style={{ bottom: -5, left: "calc(50% - 4px)", cursor: "ns-resize" }} />
          <Handle handle="br" style={{ bottom: -5, right: -5, cursor: "nwse-resize" }} />
        </>
      )}
    </div>
  );
}