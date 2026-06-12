export interface FieldPosition {
  field: string;
  x: number;
  y: number;
  width: number;
  height: number;
  align: "center" | "left" | "right";
  fontSize: number;
  minFontSize: number;
}

export type SheetRow = { [key: string]: string };