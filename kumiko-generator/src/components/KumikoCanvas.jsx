import React, { useRef, useEffect, useState } from 'react';

const KumikoCanvas = ({ imageSrc, gridSize, baseThickness, sensitivity }) => {
  const canvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(true);

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

      const cols = Math.floor(canvasWidth / gridSize);
      const rows = Math.floor(canvasHeight / gridSize);

      ctx.fillStyle = '#fdfbf7'; 
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * gridSize;
          const py = y * gridSize;

          const centerX = Math.floor(px + gridSize / 2);
          const centerY = Math.floor(py + gridSize / 2);
          
          // Safety check to prevent sampling out of bounds
          if (centerX >= canvasWidth || centerY >= canvasHeight) continue;

          const pixelData = offscreenCtx.getImageData(centerX, centerY, 1, 1).data;
          const brightness = (0.299 * pixelData[0] + 0.587 * pixelData[1] + 0.114 * pixelData[2]);
          
          drawSquareAsanoha(ctx, px, py, gridSize, brightness);
        }
      }
      setIsProcessing(false);
    };

    img.src = imageSrc;
    // By adding our parameters here, the canvas automatically re-renders when a slider moves
  }, [imageSrc, gridSize, baseThickness, sensitivity]);

  const drawSquareAsanoha = (ctx, x, y, size, brightness) => {
    // Normalize brightness from 0-255 to 0-1
    const normalizedBrightness = brightness / 255;
    
    // Calculate dynamic thickness based on user parameters
    let dynamicThickness = baseThickness - (baseThickness * normalizedBrightness * sensitivity);
    const thickness = Math.max(0.3, dynamicThickness); // Minimum thickness of 0.3px so lines don't vanish entirely
    
    ctx.lineWidth = thickness;
    ctx.strokeStyle = '#3e2723';
    ctx.lineCap = 'round';
    ctx.beginPath();

    const cx = x + size / 2;
    const cy = y + size / 2;

    // Outer Square
    ctx.rect(x, y, size, size);
    
    // Cross
    ctx.moveTo(cx, y); ctx.lineTo(cx, y + size);
    ctx.moveTo(x, cy); ctx.lineTo(x + size, cy);

    // X Diagonals
    ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);

    // Inner Diamonds
    ctx.moveTo(cx, y); ctx.lineTo(x + size, cy);
    ctx.lineTo(cx, y + size); ctx.lineTo(x, cy);
    ctx.closePath();

    ctx.stroke();
  };

  return (
    <div className="relative w-full flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden border border-amber-900/20 shadow-inner min-h-[400px]">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <span className="text-amber-800 font-semibold animate-pulse">Carving wood...</span>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto shadow-md"
        style={{ imageRendering: 'high-quality' }}
      />
    </div>
  );
};

export default KumikoCanvas;