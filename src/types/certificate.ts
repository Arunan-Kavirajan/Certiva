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