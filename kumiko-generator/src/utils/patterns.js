// src/utils/patterns.js

export const kumikoPatterns = {
  // --- SQUARE PATTERNS ---
  asanoha_square: {
    type: 'square',
    name: 'Square Asanoha',
    draw: (ctx, x, y, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const cx = x + size / 2;
      const cy = y + size / 2;

      ctx.rect(x, y, size, size);
      ctx.moveTo(cx, y); ctx.lineTo(cx, y + size);
      ctx.moveTo(x, cy); ctx.lineTo(x + size, cy);
      ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
      ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);
      ctx.moveTo(cx, y); ctx.lineTo(x + size, cy);
      ctx.lineTo(cx, y + size); ctx.lineTo(x, cy);
      
      ctx.stroke();
    }
  },

  kaku: {
    type: 'square',
    name: 'Kaku (Grid & Cross)',
    draw: (ctx, x, y, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const cx = x + size / 2;
      const cy = y + size / 2;

      ctx.rect(x, y, size, size);
      ctx.moveTo(cx, y); ctx.lineTo(cx, y + size);
      ctx.moveTo(x, cy); ctx.lineTo(x + size, cy);
      
      ctx.stroke();
    }
  },

  hishi: {
    type: 'square',
    name: 'Hishi (Diamond Crosshatch)',
    draw: (ctx, x, y, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      
      ctx.rect(x, y, size, size);
      ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
      ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);
      
      ctx.stroke();
    }
  },

  // --- HEXAGONAL / TRIANGULAR PATTERNS ---
  mitsukude: {
    type: 'hex',
    name: 'Mitsukude (Triangle Grid)',
    draw: (ctx, cx, cy, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const h = size * (Math.sqrt(3) / 2);
      
      // Draw the three fundamental radiating lines from the vertex
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size, cy); // Horizontal to right
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size / 2, cy + h); // Diagonal down-right
      ctx.moveTo(cx, cy); ctx.lineTo(cx - size / 2, cy + h); // Diagonal down-left
      
      ctx.stroke();
    }
  },

  asanoha_true: {
    type: 'hex',
    name: 'True Asanoha',
    draw: (ctx, cx, cy, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const h = size * (Math.sqrt(3) / 2);

      // 1. Base Mitsukude grid (The structural equilateral triangles)
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size, cy); 
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size / 2, cy + h); 
      ctx.moveTo(cx, cy); ctx.lineTo(cx - size / 2, cy + h); 

      // 2. Medians of the Downward-Pointing Triangle
      // Vertices: (cx, cy), (cx + size, cy), (cx + size/2, cy + h)
      // We connect each vertex to the exact midpoint of its opposite side
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size * 0.75, cy + h * 0.5);
      ctx.moveTo(cx + size, cy); ctx.lineTo(cx + size * 0.25, cy + h * 0.5);
      ctx.moveTo(cx + size / 2, cy + h); ctx.lineTo(cx + size * 0.5, cy);

      // 3. Medians of the Upward-Pointing Triangle
      // Vertices: (cx, cy), (cx - size/2, cy + h), (cx + size/2, cy + h)
      ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + h);
      ctx.moveTo(cx - size / 2, cy + h); ctx.lineTo(cx + size * 0.25, cy + h * 0.5);
      ctx.moveTo(cx + size / 2, cy + h); ctx.lineTo(cx - size * 0.25, cy + h * 0.5);

      ctx.stroke();
    }
  }
};