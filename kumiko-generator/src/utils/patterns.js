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

      ctx.moveTo(cx, cy); ctx.lineTo(cx + size, cy);
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size / 2, cy + h);
      ctx.moveTo(cx, cy); ctx.lineTo(cx - size / 2, cy + h);

      const cxDown = cx + size / 2; const cyDown = cy + h / 3;
      ctx.moveTo(cx, cy); ctx.lineTo(cxDown, cyDown);
      ctx.moveTo(cx + size, cy); ctx.lineTo(cxDown, cyDown);
      ctx.moveTo(cx + size / 2, cy + h); ctx.lineTo(cxDown, cyDown);

      const cxUp = cx; const cyUp = cy + 2 * h / 3;
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

      ctx.moveTo(cx, cy); ctx.lineTo(cx + size, cy);
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size / 2, cy + h);
      ctx.moveTo(cx, cy); ctx.lineTo(cx - size / 2, cy + h);

      ctx.moveTo(cx + size / 2, cy); ctx.lineTo(cx + size * 0.75, cy + h / 2); ctx.lineTo(cx + size * 0.25, cy + h / 2); ctx.closePath();
      ctx.moveTo(cx, cy + h); ctx.lineTo(cx - size * 0.25, cy + h / 2); ctx.lineTo(cx + size * 0.25, cy + h / 2); ctx.closePath();
      ctx.stroke();
    }
  },

  kikko: {
    type: 'hex',
    name: 'Kikko (Tortoise Shell)',
    draw: (ctx, cx, cy, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const h = size * (Math.sqrt(3) / 2);

      // We tessellate the honeycomb by connecting the centroid of the downward-pointing 
      // triangle to the centroids of its three adjacent upward-pointing triangles.
      const downCx = cx + size / 2;
      const downCy = cy + h / 3;

      ctx.moveTo(downCx, downCy); ctx.lineTo(cx, cy + 2 * h / 3); // Up-Left
      ctx.moveTo(downCx, downCy); ctx.lineTo(cx + size, cy + 2 * h / 3); // Up-Right
      ctx.moveTo(downCx, downCy); ctx.lineTo(cx + size / 2, cy - h / 3); // Directly Above
      
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
      const cx = x + size / 2; const cy = y + size / 2;

      ctx.rect(x, y, size, size);
      ctx.moveTo(cx, y); ctx.lineTo(cx, y + size);
      ctx.moveTo(x, cy); ctx.lineTo(x + size, cy);
      ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
      ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);

      const d = (size / 2) * (Math.SQRT2 - 1); 
      ctx.moveTo(cx, y + d); ctx.lineTo(x, y); ctx.moveTo(cx, y + d); ctx.lineTo(x + size, y);
      ctx.moveTo(cx, y + size - d); ctx.lineTo(x, y + size); ctx.moveTo(cx, y + size - d); ctx.lineTo(x + size, y + size);
      ctx.moveTo(x + d, cy); ctx.lineTo(x, y); ctx.moveTo(x + d, cy); ctx.lineTo(x, y + size);
      ctx.moveTo(x + size - d, cy); ctx.lineTo(x + size, y); ctx.moveTo(x + size - d, cy); ctx.lineTo(x + size, y + size);
      ctx.stroke();
    }
  },

  shokko: {
    type: 'square',
    name: 'Shokko (Octagon & Square)',
    draw: (ctx, x, y, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      
      const d = size * 0.25; // 25% corner cut
      ctx.rect(x, y, size, size); // Frame
      
      // Octagon corner diagonals
      ctx.moveTo(x + d, y); ctx.lineTo(x, y + d);
      ctx.moveTo(x + size - d, y); ctx.lineTo(x + size, y + d);
      ctx.moveTo(x + size, y + size - d); ctx.lineTo(x + size - d, y + size);
      ctx.moveTo(x, y + size - d); ctx.lineTo(x + d, y + size);

      // Inner Square
      ctx.moveTo(x + d, y + d); ctx.lineTo(x + size - d, y + d);
      ctx.moveTo(x + size - d, y + d); ctx.lineTo(x + size - d, y + size - d);
      ctx.moveTo(x + size - d, y + size - d); ctx.lineTo(x + d, y + size - d);
      ctx.moveTo(x + d, y + size - d); ctx.lineTo(x + d, y + d);
      
      ctx.stroke();
    }
  },

  goma: {
    type: 'square',
    name: 'Goma-gara (Sesame)',
    draw: (ctx, x, y, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      
      ctx.rect(x, y, size, size); // Frame
      
      const cx = x + size / 2;
      const cy = y + size / 2;
      const d = size * 0.15; // Inner diamond radius
      
      // Inner central diamond
      ctx.moveTo(cx, cy - d); ctx.lineTo(cx + d, cy);
      ctx.lineTo(cx, cy + d); ctx.lineTo(cx - d, cy);
      ctx.closePath();
      
      // Connecting corners to the diamond points to form the "woven" look
      ctx.moveTo(x, y); ctx.lineTo(cx - d, cy); 
      ctx.moveTo(x, y); ctx.lineTo(cx, cy - d);
      ctx.moveTo(x + size, y); ctx.lineTo(cx + d, cy);
      ctx.moveTo(x + size, y); ctx.lineTo(cx, cy - d);
      ctx.moveTo(x + size, y + size); ctx.lineTo(cx + d, cy);
      ctx.moveTo(x + size, y + size); ctx.lineTo(cx, cy + d);
      ctx.moveTo(x, y + size); ctx.lineTo(cx - d, cy);
      ctx.moveTo(x, y + size); ctx.lineTo(cx, cy + d);

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
      const cx = x + size / 2; const cy = y + size / 2;
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
      const cx = x + size / 2; const cy = y + size / 2;
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