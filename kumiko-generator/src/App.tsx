import React, { useState, useEffect, useMemo } from 'react';
import { processImageLuminance } from './utils/image';
import { gomaPattern } from './patterns/goma';
import type { Line } from './types';

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [columns, setColumns] = useState<number>(30);
  const [thickness, setThickness] = useState<number>(1.5);
  const [luminanceMatrix, setLuminanceMatrix] = useState<number[][]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // When image or columns change, recalculate the luminance matrix
  useEffect(() => {
    if (!imageSrc) return;
    
    const process = async () => {
      setIsProcessing(true);
      // Assuming a square aspect ratio for the grid calculation right now for MVP
      const rows = columns; 
      const matrix = await processImageLuminance(imageSrc, columns, rows);
      setLuminanceMatrix(matrix);
      setIsProcessing(false);
    };
    
    process();
  }, [imageSrc, columns]);

  // Handle file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };

  // Generate all SVG lines based on the matrix and pattern
  const svgLines = useMemo(() => {
    if (!luminanceMatrix.length) return [];
    
    const rows = luminanceMatrix.length;
    const cols = luminanceMatrix[0].length;
    
    const CANVAS_SIZE = 800; // SVG viewBox coordinate system
    const cellWidth = CANVAS_SIZE / cols;
    const cellHeight = CANVAS_SIZE / rows;
    
    let allLines: Line[] = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const luminance = luminanceMatrix[y][x];
        const cellLines = gomaPattern.generateLines({
          x: x * cellWidth,
          y: y * cellHeight,
          width: cellWidth,
          height: cellHeight,
          luminance
        });
        allLines = [...allLines, ...cellLines];
      }
    }
    return allLines;
  }, [luminanceMatrix]);

  // Handle SVG Download
  const handleDownloadSVG = () => {
    if (!svgLines.length) return;

    // 1. Construct the raw SVG string
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" style="stroke-linecap: round; stroke-linejoin: round;">
        ${svgLines.map(line => 
          `<line x1="${line.p1.x}" y1="${line.p1.y}" x2="${line.p2.x}" y2="${line.p2.y}" stroke="#b48a66" stroke-width="${thickness}" />`
        ).join('\n        ')}
      </svg>
    `;

    // 2. Create a Blob and generate a temporary download URL
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // 3. Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kumiko-art.svg';
    document.body.appendChild(link);
    link.click();
    
    // 4. Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col md:flex-row gap-8 font-sans text-slate-800">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 flex flex-col gap-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h1 className="text-2xl font-bold">Kumiko Generator</h1>
        
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Upload Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm flex justify-between">
            <span>Grid Density</span>
            <span className="text-slate-500">{columns}x{columns}</span>
          </label>
          <input 
            type="range" min="10" max="80" value={columns} 
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full accent-slate-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm flex justify-between">
            <span>Wood Thickness</span>
            <span className="text-slate-500">{thickness}px</span>
          </label>
          <input 
            type="range" min="0.5" max="5" step="0.1" value={thickness} 
            onChange={(e) => setThickness(Number(e.target.value))}
            className="w-full accent-slate-800"
          />
        </div>
        {/* Export Button (Only show if an image is loaded and not processing) */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <button
            onClick={handleDownloadSVG}
            disabled={!imageSrc || isProcessing}
            className="w-full py-2 px-4 bg-slate-800 text-white font-semibold rounded-md shadow-sm hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Download SVG
          </button>
        </div>
      </div>

      {/* Render Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex items-center justify-center min-h-[500px]">
        {!imageSrc ? (
          <p className="text-slate-400">Upload an image to generate Kumiko art.</p>
        ) : isProcessing ? (
          <p className="text-slate-400 animate-pulse">Processing luminance...</p>
        ) : (
          <svg 
            viewBox="0 0 800 800" 
            className="w-full max-w-2xl h-auto"
            style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
          >
            {svgLines.map((line, i) => (
              <line 
                key={i}
                x1={line.p1.x} y1={line.p1.y} 
                x2={line.p2.x} y2={line.p2.y} 
                stroke="#b48a66" /* Traditional wood color */
                strokeWidth={thickness}
              />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}