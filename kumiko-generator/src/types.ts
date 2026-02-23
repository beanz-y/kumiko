export interface Point {
  x: number;
  y: number;
}

export interface Line {
  p1: Point;
  p2: Point;
}

export interface CellContext {
  x: number;       // Top-left X of the grid cell
  y: number;       // Top-left Y of the grid cell
  width: number;   // Width of the cell
  height: number;  // Height of the cell
  luminance: number; // 0 (Dark) to 255 (Light)
}

export interface KumikoPattern {
  name: string;
  gridType: 'square' | 'hexagonal' | 'triangle';
  // The function that returns the SVG lines for a single cell based on its luminance
  generateLines: (context: CellContext) => Line[];
}