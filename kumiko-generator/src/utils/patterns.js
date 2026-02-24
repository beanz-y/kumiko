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

  mikado: {
    type: 'hex',
    name: 'Mikado (Radioactive Triangles)',
    draw: (ctx, cx, cy, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const h = size * (Math.sqrt(3) / 2);

      ctx.moveTo(cx, cy); ctx.lineTo(cx + size, cy);
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size / 2, cy + h);
      ctx.moveTo(cx, cy); ctx.lineTo(cx - size / 2, cy + h);

      const drawWedge = (centerX, centerY, angle, dist) => {
         const baseHalfWidth = dist / Math.sqrt(3);
         const baseX = centerX + dist * Math.cos(angle);
         const baseY = centerY + dist * Math.sin(angle);
         const px = baseHalfWidth * Math.cos(angle + Math.PI/2);
         const py = baseHalfWidth * Math.sin(angle + Math.PI/2);
         ctx.moveTo(centerX, centerY);
         ctx.lineTo(baseX + px, baseY + py);
         ctx.lineTo(baseX - px, baseY - py);
         ctx.closePath();
      };

      const d = h / 3; 

      const cxDown = cx + size / 2; const cyDown = cy + h / 3;
      drawWedge(cxDown, cyDown, -Math.PI/2, d); 
      drawWedge(cxDown, cyDown, 5*Math.PI/6, d); 
      drawWedge(cxDown, cyDown, Math.PI/6, d); 

      const cxUp = cx; const cyUp = cy + 2 * h / 3;
      drawWedge(cxUp, cyUp, Math.PI/2, d); 
      drawWedge(cxUp, cyUp, -5*Math.PI/6, d); 
      drawWedge(cxUp, cyUp, -Math.PI/6, d); 

      ctx.stroke();
    }
  },

  sakura: {
    type: 'hex',
    name: 'Sakura (Cherry Blossom)',
    draw: (ctx, cx, cy, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const h = size * (Math.sqrt(3) / 2);
      
      const capD = size * 0.30; 

      ctx.moveTo(cx, cy); ctx.lineTo(cx + size, cy);
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size / 2, cy + h);
      ctx.moveTo(cx, cy); ctx.lineTo(cx - size / 2, cy + h);

      const drawCapAndLine = (vx, vy, centroidX, centroidY, angle1, angle2) => {
         const p1x = vx + capD * Math.cos(angle1);
         const p1y = vy + capD * Math.sin(angle1);
         const p2x = vx + capD * Math.cos(angle2);
         const p2y = vy + capD * Math.sin(angle2);
         
         ctx.moveTo(p1x, p1y); ctx.lineTo(p2x, p2y); 
         ctx.moveTo(centroidX, centroidY); ctx.lineTo((p1x + p2x) / 2, (p1y + p2y) / 2); 
      };

      const cxDown = cx + size / 2; const cyDown = cy + h / 3;
      const cxUp = cx; const cyUp = cy + 2 * h / 3;

      drawCapAndLine(cx, cy, cxDown, cyDown, 0, Math.PI/3);
      drawCapAndLine(cx + size, cy, cxDown, cyDown, Math.PI, 2*Math.PI/3);
      drawCapAndLine(cx + size / 2, cy + h, cxDown, cyDown, -Math.PI/3, -2*Math.PI/3);

      drawCapAndLine(cx, cy, cxUp, cyUp, 2*Math.PI/3, Math.PI/3);
      drawCapAndLine(cx - size / 2, cy + h, cxUp, cyUp, 0, -Math.PI/3);
      drawCapAndLine(cx + size / 2, cy + h, cxUp, cyUp, Math.PI, -2*Math.PI/3);

      ctx.stroke();
    }
  },

  // --- REBUILT RINDO ---
  rindo: {
    type: 'hex',
    name: 'Rindo (Gentian)',
    draw: (ctx, cx, cy, size, thickness) => {
      ctx.lineWidth = thickness;
      ctx.beginPath();
      const h = size * (Math.sqrt(3) / 2);

      // Base Structural Grid
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size, cy);
      ctx.moveTo(cx, cy); ctx.lineTo(cx + size / 2, cy + h);
      ctx.moveTo(cx, cy); ctx.lineTo(cx - size / 2, cy + h);

      // Helper to draw the exact "X" shape (two intersecting lines without the middle median)
      const drawFullX = (base1, base2, point) => {
          // Calculate the midpoints of the opposite edges
          const mid1x = (base2.x + point.x) / 2;
          const mid1y = (base2.y + point.y) / 2;
          const mid2x = (base1.x + point.x) / 2;
          const mid2y = (base1.y + point.y) / 2;
          
          // Draw the two intersecting lines from the base to the opposite midpoints
          ctx.moveTo(base1.x, base1.y); ctx.lineTo(mid1x, mid1y);
          ctx.moveTo(base2.x, base2.y); ctx.lineTo(mid2x, mid2y);
      };

      // Coordinate tracking for the alternating hexagon/star weave
      const col = Math.round(cx / (size/2));
      const row = Math.round(cy / h);

      // Downward Triangle
      const d1 = {x: cx, y: cy};
      const d2 = {x: cx + size, y: cy};
      const d3 = {x: cx + size / 2, y: cy + h};
      
      // Draw the "X" in alternating triangles to form the stars
      if ((col + row) % 3 !== 0) {
          drawFullX(d1, d2, d3); // Base is the top horizontal edge
      }

      // Upward Triangle
      const u1 = {x: cx, y: cy};
      const u2 = {x: cx - size / 2, y: cy + h};
      const u3 = {x: cx + size / 2, y: cy + h};
      
      if ((col + row + 1) % 3 !== 0) {
          drawFullX(u2, u3, u1); // Base is the bottom horizontal edge
      }

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

      const downCx = cx + size / 2;
      const downCy = cy + h / 3;

      ctx.moveTo(downCx, downCy); ctx.lineTo(cx, cy + 2 * h / 3); 
      ctx.moveTo(downCx, downCy); ctx.lineTo(cx + size, cy + 2 * h / 3); 
      ctx.moveTo(downCx, downCy); ctx.lineTo(cx + size / 2, cy - h / 3); 
      
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

  // --- SQUARE PATTERNS ---
  kakuasa: {
    type: 'square',
    name: 'Kakuasa (Square Asanoha)',
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
      const d = size * 0.25; 
      ctx.rect(x, y, size, size); 
      
      ctx.moveTo(x + d, y); ctx.lineTo(x, y + d);
      ctx.moveTo(x + size - d, y); ctx.lineTo(x + size, y + d);
      ctx.moveTo(x + size, y + size - d); ctx.lineTo(x + size - d, y + size);
      ctx.moveTo(x, y + size - d); ctx.lineTo(x + d, y + size);

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
      ctx.rect(x, y, size, size); 
      
      const cx = x + size / 2; const cy = y + size / 2;
      const d = size * 0.15; 
      
      ctx.moveTo(cx, cy - d); ctx.lineTo(cx + d, cy); ctx.lineTo(cx, cy + d); ctx.lineTo(cx - d, cy); ctx.closePath();
      
      ctx.moveTo(x, y); ctx.lineTo(cx - d, cy); ctx.moveTo(x, y); ctx.lineTo(cx, cy - d);
      ctx.moveTo(x + size, y); ctx.lineTo(cx + d, cy); ctx.moveTo(x + size, y); ctx.lineTo(cx, cy - d);
      ctx.moveTo(x + size, y + size); ctx.lineTo(cx + d, cy); ctx.moveTo(x + size, y + size); ctx.lineTo(cx, cy + d);
      ctx.moveTo(x, y + size); ctx.lineTo(cx - d, cy); ctx.moveTo(x, y + size); ctx.lineTo(cx, cy + d);
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
  }
};