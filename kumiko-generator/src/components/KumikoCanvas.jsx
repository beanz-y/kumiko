import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { kumikoPatterns } from '../utils/patterns';

// --- The SVG Mock Context Builder ---
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
        this.currentPath += `M ${x.toFixed(2)} ${y.toFixed(2)} L ${(x + w).toFixed(2)} ${y.toFixed(2)} L ${(x + w).toFixed(2)} ${(y + h).toFixed(2)} L ${x.toFixed(2)} ${(y + h).toFixed(2)} Z `;
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

    // Store rendering data so we can rebuild the SVG without reloading the image
    const renderDataRef = useRef({ width: 0, height: 0, cols: 0, rows: 0, offscreenCtx: null });

    useImperativeHandle(ref, () => ({
        exportPNG: () => {
            const canvas = canvasRef.current;
            if (!canvas) {
                console.error("Canvas not found for export.");
                return;
            }
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `kumiko-${activePattern}.png`;
            link.href = dataUrl;

            // FIX: Append to the document body, trigger click, then clean up
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        exportSVG: () => {
            const { width, height, cols, rows, offscreenCtx } = renderDataRef.current;
            if (!offscreenCtx) {
                console.error("Render data not found for SVG export.");
                return;
            }

            const svgBuilder = new SVGBuilder(width, height);

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const px = x * gridSize;
                    const py = y * gridSize;
                    const centerX = Math.floor(px + gridSize / 2);
                    const centerY = Math.floor(py + gridSize / 2);

                    if (centerX >= width || centerY >= height) continue;

                    const pixelData = offscreenCtx.getImageData(centerX, centerY, 1, 1).data;
                    const brightness = (0.299 * pixelData[0] + 0.587 * pixelData[1] + 0.114 * pixelData[2]);

                    const normalizedBrightness = brightness / 255;
                    let dynamicThickness = baseThickness - (baseThickness * normalizedBrightness * sensitivity);
                    const thickness = Math.max(0.3, dynamicThickness);

                    const drawPattern = kumikoPatterns[activePattern];
                    if (drawPattern) {
                        drawPattern(svgBuilder, px, py, gridSize, thickness);
                    }
                }
            }

            const svgString = svgBuilder.getSVGString();
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `kumiko-${activePattern}.svg`;
            link.href = url;

            // FIX: Append to the document body, trigger click, then clean up
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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

            const cols = Math.floor(canvasWidth / gridSize);
            const rows = Math.floor(canvasHeight / gridSize);

            // Save to ref for SVG export
            renderDataRef.current = { width: canvasWidth, height: canvasHeight, cols, rows, offscreenCtx };

            ctx.fillStyle = '#fdfbf7';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.strokeStyle = '#3e2723';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const px = x * gridSize;
                    const py = y * gridSize;
                    const centerX = Math.floor(px + gridSize / 2);
                    const centerY = Math.floor(py + gridSize / 2);

                    if (centerX >= canvasWidth || centerY >= canvasHeight) continue;

                    const pixelData = offscreenCtx.getImageData(centerX, centerY, 1, 1).data;
                    const brightness = (0.299 * pixelData[0] + 0.587 * pixelData[1] + 0.114 * pixelData[2]);

                    const normalizedBrightness = brightness / 255;
                    let dynamicThickness = baseThickness - (baseThickness * normalizedBrightness * sensitivity);
                    const thickness = Math.max(0.3, dynamicThickness);

                    const drawPattern = kumikoPatterns[activePattern];
                    if (drawPattern) {
                        drawPattern(ctx, px, py, gridSize, thickness);
                    }
                }
            }
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