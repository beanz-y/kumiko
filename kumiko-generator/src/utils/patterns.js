// src/utils/patterns.js

export const kumikoPatterns = {
  asanoha: (ctx, x, y, size, thickness) => {
    ctx.lineWidth = thickness;
    ctx.beginPath();
    const cx = x + size / 2;
    const cy = y + size / 2;

    // Frame
    ctx.rect(x, y, size, size);
    // Cross
    ctx.moveTo(cx, y); ctx.lineTo(cx, y + size);
    ctx.moveTo(x, cy); ctx.lineTo(x + size, cy);
    // Diagonals
    ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);
    // Inner Diamonds
    ctx.moveTo(cx, y); ctx.lineTo(x + size, cy);
    ctx.lineTo(cx, y + size); ctx.lineTo(x, cy);
    
    ctx.stroke();
  },

  kaku: (ctx, x, y, size, thickness) => {
    ctx.lineWidth = thickness;
    ctx.beginPath();
    const cx = x + size / 2;
    const cy = y + size / 2;

    // Frame
    ctx.rect(x, y, size, size);
    // Simple Cross
    ctx.moveTo(cx, y); ctx.lineTo(cx, y + size);
    ctx.moveTo(x, cy); ctx.lineTo(x + size, cy);
    
    ctx.stroke();
  },

  hishi: (ctx, x, y, size, thickness) => {
    ctx.lineWidth = thickness;
    ctx.beginPath();
    
    // Frame
    ctx.rect(x, y, size, size);
    // Diagonals only
    ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);
    
    ctx.stroke();
  }
};