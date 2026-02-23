import type { KumikoPattern, Line } from '../types';

export const gomaPattern: KumikoPattern = {
  name: 'Goma (Sesame)',
  gridType: 'square',
  generateLines: ({ x, y, width, height, luminance }) => {
    const lines: Line[] = [];
    
    // 1. ALWAYS draw the Jigumi (Base Square Grid)
    lines.push({ p1: { x, y }, p2: { x: x + width, y } }); // Top
    lines.push({ p1: { x, y }, p2: { x, y: y + height } }); // Left
    
    // Bottom and Right are drawn by adjacent cells, but we add them to the outer edges in the main render loop to be safe, 
    // or just draw them all here and let SVG overlapping handle it (easier for MVP).
    lines.push({ p1: { x, y: y + height }, p2: { x: x + width, y: y + height } }); // Bottom
    lines.push({ p1: { x: x + width, y }, p2: { x: x + width, y: y + height } }); // Right

    // 2. Add complexity based on darkness (Lower luminance = darker = more wood)
    if (luminance < 180) {
      // Add a diagonal cross
      lines.push({ p1: { x, y }, p2: { x: x + width, y: y + height } });
      lines.push({ p1: { x: x + width, y }, p2: { x, y: y + height } });
    }
    
    if (luminance < 90) {
      // Add the inner diamond (The true Goma detail)
      const midX = x + width / 2;
      const midY = y + height / 2;
      lines.push({ p1: { x: midX, y }, p2: { x: x + width, y: midY } });
      lines.push({ p1: { x: x + width, y: midY }, p2: { x: midX, y: y + height } });
      lines.push({ p1: { x: midX, y: y + height }, p2: { x, y: midY } });
      lines.push({ p1: { x, y: midY }, p2: { x: midX, y } });
    }

    return lines;
  }
};