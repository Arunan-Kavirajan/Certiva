export type FieldType = "Name" | "Event" | "Date";

export interface FieldPosition {
  field: FieldType;
  x: number;
  y: number;
  width: number;
  height: number;
  align: "center" | "left" | "right";
  fontSize: number;
  minFontSize: number;
  fontFamily: "Helvetica" | "Helvetica-Bold" | "Times-Roman" | "Courier";
}

export type SheetRow = { [key: string]: string };

export type ColumnMappings = {
  [key in FieldType]?: string;
};

export const FIELD_TYPES: FieldType[] = ["Name", "Event", "Date"];

export const FIELD_COLORS: {
  [key in FieldType]: { border: string; bg: string; text: string };
} = {
  Name: {
    border: "rgba(124, 140, 78, 0.8)",
    bg: "rgba(124, 140, 78, 0.08)",
    text: "rgba(124, 140, 78, 0.9)",
  },
  Event: {
    border: "rgba(92, 74, 42, 0.8)",
    bg: "rgba(92, 74, 42, 0.08)",
    text: "rgba(92, 74, 42, 0.9)",
  },
  Date: {
    border: "rgba(74, 96, 130, 0.8)",
    bg: "rgba(74, 96, 130, 0.08)",
    text: "rgba(74, 96, 130, 0.9)",
  },
};