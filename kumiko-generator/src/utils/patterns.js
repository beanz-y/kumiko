// src/utils/patterns.js

export const kumikoPatterns = {
  // --- HEXAGONAL / TRIANGULAR PATTERNS ---
  asanoha_true: {
    type: 'hex',
    name: 'True Asanoha',
    draw: (ctx, cx, cy, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const h = size * (Math.sqrt(3) / 2);

      // 1. Base Mitsukude frame for this cell
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size, cy);
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size / 2, cy + h);
      ctx.moveTo(cx, cy); ctx.lineTo(cx - size / 2, cy + h);

      // 2. Y-pieces for the Downward-Pointing Triangle
      const cxDown = cx + size / 2;
      const cyDown = cy + h / 3;
      ctx.moveTo(cx, cy); ctx.lineTo(cxDown, cyDown);
      ctx.moveTo(cx + size, cy); ctx.lineTo(cxDown, cyDown);
      ctx.moveTo(cx + size / 2, cy + h); ctx.lineTo(cxDown, cyDown);

      // 3. Y-pieces for the Upward-Pointing Triangle
      const cxUp = cx;
      const cyUp = cy + 2 * h / 3;
      ctx.moveTo(cx, cy); ctx.lineTo(cxUp, cyUp);
      ctx.moveTo(cx - size / 2, cy + h); ctx.lineTo(cxUp, cyUp);
      ctx.moveTo(cx + size / 2, cy + h); ctx.lineTo(cxUp, cyUp);
      
      ctx.stroke();
    }
  },

  mitsukude: {
    type: 'hex',
    name: 'Mitsukude (Triangle Grid)',
    draw: (ctx, cx, cy, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const h = size * (Math.sqrt(3) / 2);
      
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size, cy); 
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size / 2, cy + h); 
      ctx.moveTo(cx, cy); ctx.lineTo(cx - size / 2, cy + h); 
      
      ctx.stroke();
    }
  },

  kagome: {
    type: 'hex',
    name: 'Kagome (Woven Basket)',
    draw: (ctx, cx, cy, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const h = size * (Math.sqrt(3) / 2);

      // Base Mitsukude grid
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size, cy);
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size / 2, cy + h);
      ctx.moveTo(cx, cy); ctx.lineTo(cx - size / 2, cy + h);

      // Midpoint connections (Downward-Pointing)
      ctx.moveTo(cx + size / 2, cy); 
      ctx.lineTo(cx + size * 0.75, cy + h / 2);
      ctx.lineTo(cx + size * 0.25, cy + h / 2); 
      ctx.closePath();

      // Midpoint connections (Upward-Pointing)
      ctx.moveTo(cx, cy + h); 
      ctx.lineTo(cx - size * 0.25, cy + h / 2);
      ctx.lineTo(cx + size * 0.25, cy + h / 2);
      ctx.closePath();

      ctx.stroke();
    }
  },

  // --- SQUARE PATTERNS ---
  asanoha_square: {
    type: 'square',
    name: 'Square Asanoha (Kakuasa)',
    draw: (ctx, x, y, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const cx = x + size / 2;
      const cy = y + size / 2;

      // Frame & Cross
      ctx.rect(x, y, size, size);
      ctx.moveTo(cx, y); ctx.lineTo(cx, y + size);
      ctx.moveTo(x, cy); ctx.lineTo(x + size, cy);
      
      // Diagonals
      ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
      ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);

      // Authentic Kakuasa Inner Petals (Using 22.5° geometry)
      const d = (size / 2) * (Math.SQRT2 - 1); // Exact intersection point
      
      ctx.moveTo(cx, y + d); ctx.lineTo(x, y);
      ctx.moveTo(cx, y + d); ctx.lineTo(x + size, y);
      
      ctx.moveTo(cx, y + size - d); ctx.lineTo(x, y + size);
      ctx.moveTo(cx, y + size - d); ctx.lineTo(x + size, y + size);
      
      ctx.moveTo(x + d, cy); ctx.lineTo(x, y);
      ctx.moveTo(x + d, cy); ctx.lineTo(x, y + size);
      
      ctx.moveTo(x + size - d, cy); ctx.lineTo(x + size, y);
      ctx.moveTo(x + size - d, cy); ctx.lineTo(x + size, y + size);

      ctx.stroke();
    }
  },

  yotsume: {
    type: 'square',
    name: 'Yotsume (Four Eyes)',
    draw: (ctx, x, y, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      
      ctx.rect(x, y, size, size);
      const inset = size * 0.25;
      ctx.rect(x + inset, y + inset, size - inset * 2, size - inset * 2);
      
      const cx = x + size / 2;
      const cy = y + size / 2;
      ctx.moveTo(cx, y); ctx.lineTo(cx, y + inset);
      ctx.moveTo(cx, y + size - inset); ctx.lineTo(cx, y + size);
      ctx.moveTo(x, cy); ctx.lineTo(x + inset, cy);
      ctx.moveTo(x + size - inset, cy); ctx.lineTo(x + size, cy);
      
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
  }
};