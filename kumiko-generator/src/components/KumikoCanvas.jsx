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
  getSVGString(scaleFactor = 1) {
    const scaledWidth = this.width * scaleFactor;
    const scaledHeight = this.height * scaleFactor;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" width="${scaledWidth}" height="${scaledHeight}">
  <rect width="100%" height="100%" fill="#fdfbf7" />
  ${this.elements.join('\n  ')}
</svg>`;
  }
}

const KumikoCanvas = forwardRef(({ imageSrc, gridSize, baseThickness, sensitivity, activePattern, useOriginalColors }, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const renderDataRef = useRef({ width: 0, height: 0, offscreenCtx: null });

  // --- Upgraded Viewport State ---
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [displayDims, setDisplayDims] = useState({ width: 0, height: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  const renderGrid = (ctxOrBuilder, width, height, offscreenCtx) => {
    const patternDef = kumikoPatterns[activePattern];
    if (!patternDef) return;

    const isHex = patternDef.type === 'hex';
    const rowHeight = isHex ? gridSize * (Math.sqrt(3) / 2) : gridSize;
    
    const cols = Math.floor(width / gridSize) + 2;
    const rows = Math.floor(height / rowHeight) + 2;

    for (let y = -1; y < rows; y++) {
      for (let x = -1; x < cols; x++) {
        let px = x * gridSize;
        let py = y * rowHeight;
        
        if (isHex && y % 2 !== 0) px += gridSize / 2;

        const centerX = isHex ? Math.floor(px) : Math.floor(px + gridSize / 2);
        const centerY = isHex ? Math.floor(py) : Math.floor(py + gridSize / 2);
        
        // Area Averaging Anti-Aliasing
        const sampleWidth = Math.max(1, Math.floor(gridSize * 0.8));
        const sampleHeight = Math.max(1, Math.floor(rowHeight * 0.8));
        const startX = Math.max(0, Math.min(Math.floor(centerX - sampleWidth / 2), width - sampleWidth));
        const startY = Math.max(0, Math.min(Math.floor(centerY - sampleHeight / 2), height - sampleHeight));

        const imgData = offscreenCtx.getImageData(startX, startY, sampleWidth, sampleHeight).data;
        let rSum = 0, gSum = 0, bSum = 0;
        let pixelCount = imgData.length / 4;

        if (pixelCount === 0) continue; // Safety check

        for (let i = 0; i < imgData.length; i += 4) {
          rSum += imgData[i];
          gSum += imgData[i + 1];
          bSum += imgData[i + 2];
        }

        const r = Math.round(rSum / pixelCount);
        const g = Math.round(gSum / pixelCount);
        const b = Math.round(bSum / pixelCount);
        
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
        const normalizedBrightness = brightness / 255;
        let dynamicThickness = baseThickness - (baseThickness * normalizedBrightness * sensitivity);
        const thickness = Math.max(0.3, dynamicThickness); 
        
        ctxOrBuilder.strokeStyle = useOriginalColors ? `rgb(${r}, ${g}, ${b})` : '#3e2723';
        patternDef.draw(ctxOrBuilder, px, py, gridSize, thickness);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    exportPNG: (targetHeight) => {
      const { width, height, offscreenCtx } = renderDataRef.current;
      if (!offscreenCtx) return;
      const scaleFactor = targetHeight / height;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width * scaleFactor;
      tempCanvas.height = targetHeight;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.scale(scaleFactor, scaleFactor);
      tempCtx.fillStyle = '#fdfbf7'; 
      tempCtx.fillRect(0, 0, width, height);
      tempCtx.lineCap = 'round';
      tempCtx.lineJoin = 'round';
      renderGrid(tempCtx, width, height, offscreenCtx);
      const link = document.createElement('a');
      link.download = `kumiko-${activePattern}-${targetHeight}p.png`;
      link.href = tempCanvas.toDataURL('image/png');
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    },
    exportSVG: (targetHeight) => {
      const { width, height, offscreenCtx } = renderDataRef.current;
      if (!offscreenCtx) return;
      const scaleFactor = targetHeight / height;
      const svgBuilder = new SVGBuilder(width, height);
      renderGrid(svgBuilder, width, height, offscreenCtx);
      const blob = new Blob([svgBuilder.getSVGString(scaleFactor)], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `kumiko-${activePattern}.svg`;
      link.href = url;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }), [activePattern, gridSize, baseThickness, sensitivity, useOriginalColors]);

  useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      setIsProcessing(true);
      
      // Calculate logical display dimensions (fitting to the container with 5% padding)
      const cWidth = container.clientWidth;
      const cHeight = container.clientHeight;
      const scaleToFit = Math.min(cWidth / img.width, cHeight / img.height, 1) * 0.95;
      const logicalWidth = img.width * scaleToFit;
      const logicalHeight = img.height * scaleToFit;
      
      setDisplayDims({ width: logicalWidth, height: logicalHeight });
      
      // Center the image initially
      setViewport({ 
        x: (cWidth - logicalWidth) / 2, 
        y: (cHeight - logicalHeight) / 2,
        scale: 1
      });

      // --- HIGH RESOLUTION OVERSAMPLING ---
      // We internally render the canvas at 4x the resolution, but display it at 1x.
      // This provides crystal clear detail when zooming in with CSS.
      const oversample = 4; 
      canvas.width = logicalWidth * oversample;
      canvas.height = logicalHeight * oversample;
      ctx.scale(oversample, oversample);

      // Set up the offscreen canvas (1:1 with logical pixels for math accuracy)
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
      offscreenCanvas.width = logicalWidth;
      offscreenCanvas.height = logicalHeight;
      offscreenCtx.drawImage(img, 0, 0, logicalWidth, logicalHeight);

      renderDataRef.current = { width: logicalWidth, height: logicalHeight, offscreenCtx };

      ctx.fillStyle = '#fdfbf7'; 
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      renderGrid(ctx, logicalWidth, logicalHeight, offscreenCtx);
      setIsProcessing(false);
    };
    img.src = imageSrc;
  }, [imageSrc, gridSize, baseThickness, sensitivity, activePattern, useOriginalColors]);

  // --- Zoom-to-Pointer Math ---
  const handleWheel = (e) => {
    // Determine mouse coordinates relative to the container
    const containerBounds = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerBounds.left;
    const mouseY = e.clientY - containerBounds.top;
    
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;

    setViewport((prev) => {
      const newScale = Math.min(Math.max(0.5, prev.scale * zoomFactor), 20);
      if (newScale === prev.scale) return prev; // Reached max/min zoom

      return {
        scale: newScale,
        // Calculate the exact offset needed to keep the pixel under the mouse static
        x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
        y: mouseY - (mouseY - prev.y) * (newScale / prev.scale)
      };
    });
  };

  const handleMouseDown = (e) => {
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - viewport.x, y: e.clientY - viewport.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setViewport(prev => ({
      ...prev,
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y
    }));
  };

  const resetView = () => {
    if (!containerRef.current) return;
    const cWidth = containerRef.current.clientWidth;
    const cHeight = containerRef.current.clientHeight;
    setViewport({ 
      x: (cWidth - displayDims.width) / 2, 
      y: (cHeight - displayDims.height) / 2,
      scale: 1
    });
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg shadow-inner border border-amber-900/20 group select-none">
      
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-30 backdrop-blur-sm rounded-lg">
          <span className="text-amber-800 font-semibold animate-pulse">Carving wood...</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 bg-white/90 p-1.5 rounded-lg shadow-sm border border-amber-900/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={resetView} className="w-8 h-8 flex items-center justify-center text-amber-900 bg-white rounded hover:bg-amber-100 transition-colors" title="Reset View">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      {/* Interactive Container */}
      <div 
        ref={containerRef}
        className={`w-full h-full relative overflow-hidden rounded-lg ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
      >
        {/* The Transformed Canvas */}
        <div 
          style={{ 
            position: 'absolute',
            left: 0, 
            top: 0,
            width: `${displayDims.width}px`,
            height: `${displayDims.height}px`,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`, // <--- UPDATE THIS LINE
            transformOrigin: '0 0', 
            transition: isPanning ? 'none' : 'transform 0.05s linear' 
          }}
        >
          {/* We force the CSS width/height to 100% of the parent wrapper, 
              but the actual canvas.width is 4x larger under the hood! */}
          <canvas 
            ref={canvasRef} 
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }} 
          />
        </div>
      </div>
    </div>
  );
});

export default KumikoCanvas;