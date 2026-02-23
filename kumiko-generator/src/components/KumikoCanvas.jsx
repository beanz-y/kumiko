import React, { useRef, useEffect, useState } from 'react';

const KumikoCanvas = ({ imageSrc }) => {
  const canvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      setIsProcessing(true);
      
      // 1. Set up our maximum display dimensions
      const maxCanvasWidth = 800;
      const scale = Math.min(maxCanvasWidth / img.width, 1);
      const canvasWidth = img.width * scale;
      const canvasHeight = img.height * scale;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // 2. Create an off-screen canvas to read the original image pixels
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
      offscreenCanvas.width = canvasWidth;
      offscreenCanvas.height = canvasHeight;
      offscreenCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // 3. Grid Parameters (We will make these interactive in Phase 3)
      const gridSize = 20; // Size of each Kumiko block in pixels
      const cols = Math.floor(canvasWidth / gridSize);
      const rows = Math.floor(canvasHeight / gridSize);

      // 4. Fill background with a light wood tone
      ctx.fillStyle = '#fdfbf7'; 
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 5. Processing Engine: Loop through the grid
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * gridSize;
          const py = y * gridSize;

          // Sample the center pixel of this grid cell to determine brightness
          const centerX = Math.floor(px + gridSize / 2);
          const centerY = Math.floor(py + gridSize / 2);
          const pixelData = offscreenCtx.getImageData(centerX, centerY, 1, 1).data;
          
          // Calculate perceived brightness (standard grayscale formula)
          const brightness = (0.299 * pixelData[0] + 0.587 * pixelData[1] + 0.114 * pixelData[2]);
          
          // Draw the pattern for this cell based on brightness
          drawSquareAsanoha(ctx, px, py, gridSize, brightness);
        }
      }
      setIsProcessing(false);
    };

    img.src = imageSrc;
  }, [imageSrc]);

  // The base pattern logic
  const drawSquareAsanoha = (ctx, x, y, size, brightness) => {
    // Map brightness (0-255) to wood thickness. Darker = thicker lines.
    const thickness = Math.max(0.5, 3.5 - (brightness / 255) * 3);
    
    ctx.lineWidth = thickness;
    ctx.strokeStyle = '#3e2723'; // Darker wood line color
    ctx.lineCap = 'round';
    ctx.beginPath();

    const cx = x + size / 2;
    const cy = y + size / 2;

    // Structural Frame (Square & Cross)
    ctx.rect(x, y, size, size);
    ctx.moveTo(cx, y); ctx.lineTo(cx, y + size); // Vertical
    ctx.moveTo(x, cy); ctx.lineTo(x + size, cy); // Horizontal

    // Diagonals
    ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);

    // Inner Diamonds (Completing the simplified Asanoha look)
    ctx.moveTo(cx, y); ctx.lineTo(x + size, cy);
    ctx.lineTo(cx, y + size); ctx.lineTo(x, cy);
    ctx.closePath();

    ctx.stroke();
  };

  return (
    <div className="relative w-full flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden border border-amber-900/20 p-4 shadow-inner">
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