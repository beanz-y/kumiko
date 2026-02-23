import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { kumikoPatterns } from '../utils/patterns';

class SVGBuilder {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.elements = [];
    this.currentPath = '';
    this.lineWidth = 1;
    this.lineCap = 'round';
    this.strokeStyle = '#3e2723';
  }
  beginPath() { this.currentPath = ''; }
  moveTo(x, y) { this.currentPath += `M ${x.toFixed(2)} ${y.toFixed(2)} `; }
  lineTo(x, y) { this.currentPath += `L ${x.toFixed(2)} ${y.toFixed(2)} `; }
  rect(x, y, w, h) {
    this.currentPath += `M ${x.toFixed(2)} ${y.toFixed(2)} L ${(x+w).toFixed(2)} ${y.toFixed(2)} L ${(x+w).toFixed(2)} ${(y+h).toFixed(2)} L ${x.toFixed(2)} ${(y+h).toFixed(2)} Z `;
  }
  stroke() {
    if (this.currentPath) {
      this.elements.push(`<path d="${this.currentPath.trim()}" stroke="${this.strokeStyle}" stroke-width="${this.lineWidth.toFixed(2)}" stroke-linecap="${this.lineCap}" stroke-linejoin="round" fill="none" />`);
    }
  }
  getSVGString() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" width="${this.width}" height="${this.height}">
  <rect width="100%" height="100%" fill="#fdfbf7" />
  ${this.elements.join('\n  ')}
</svg>`;
  }
}

const KumikoCanvas = forwardRef(({ imageSrc, gridSize, baseThickness, sensitivity, activePattern }, ref) => {
  const canvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const renderDataRef = useRef({ width: 0, height: 0, offscreenCtx: null });

  // Shared rendering logic for both Canvas and SVG
  const renderGrid = (ctxOrBuilder, width, height, offscreenCtx) => {
    const patternDef = kumikoPatterns[activePattern];
    if (!patternDef) return;

    const isHex = patternDef.type === 'hex';
    const rowHeight = isHex ? gridSize * (Math.sqrt(3) / 2) : gridSize;
    
    // Add extra padding rows/cols so patterns reach the absolute edges
    const cols = Math.floor(width / gridSize) + 2;
    const rows = Math.floor(height / rowHeight) + 2;

    for (let y = -1; y < rows; y++) {
      for (let x = -1; x < cols; x++) {
        let px = x * gridSize;
        let py = y * rowHeight;
        
        // Hex grid stagger logic
        if (isHex && y % 2 !== 0) {
          px += gridSize / 2;
        }

        // Sampling logic
        const centerX = isHex ? Math.floor(px) : Math.floor(px + gridSize / 2);
        const centerY = isHex ? Math.floor(py) : Math.floor(py + gridSize / 2);
        
        // Clamp sampling to image boundaries to prevent errors at the edges
        const sampleX = Math.max(0, Math.min(centerX, width - 1));
        const sampleY = Math.max(0, Math.min(centerY, height - 1));

        const pixelData = offscreenCtx.getImageData(sampleX, sampleY, 1, 1).data;
        const brightness = (0.299 * pixelData[0] + 0.587 * pixelData[1] + 0.114 * pixelData[2]);
        
        const normalizedBrightness = brightness / 255;
        let dynamicThickness = baseThickness - (baseThickness * normalizedBrightness * sensitivity);
        const thickness = Math.max(0.3, dynamicThickness); 
        
        patternDef.draw(ctxOrBuilder, px, py, gridSize, thickness);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    exportPNG: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `kumiko-${activePattern}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    },
    exportSVG: () => {
      const { width, height, offscreenCtx } = renderDataRef.current;
      if (!offscreenCtx) return;
      const svgBuilder = new SVGBuilder(width, height);
      renderGrid(svgBuilder, width, height, offscreenCtx);
      
      const blob = new Blob([svgBuilder.getSVGString()], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `kumiko-${activePattern}.svg`;
      link.href = url;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }), [activePattern, gridSize, baseThickness, sensitivity]);

  useEffect(() => {
    if (!imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      setIsProcessing(true);
      
      const maxCanvasWidth = 800;
      const scale = Math.min(maxCanvasWidth / img.width, 1);
      const canvasWidth = img.width * scale;
      const canvasHeight = img.height * scale;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
      offscreenCanvas.width = canvasWidth;
      offscreenCanvas.height = canvasHeight;
      offscreenCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      renderDataRef.current = { width: canvasWidth, height: canvasHeight, offscreenCtx };

      ctx.fillStyle = '#fdfbf7'; 
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.strokeStyle = '#3e2723';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      renderGrid(ctx, canvasWidth, canvasHeight, offscreenCtx);
      
      setIsProcessing(false);
    };

    img.src = imageSrc;
  }, [imageSrc, gridSize, baseThickness, sensitivity, activePattern]);

  return (
    <div className="relative w-full flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden border border-amber-900/20 shadow-inner min-h-[400px]">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <span className="text-amber-800 font-semibold animate-pulse">Carving wood...</span>
        </div>
      )}
      <canvas ref={canvasRef} className="max-w-full h-auto shadow-md" style={{ imageRendering: 'high-quality' }} />
    </div>
  );
});

export default KumikoCanvas;