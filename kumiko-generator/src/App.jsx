import { useState, useRef } from 'react';
import KumikoCanvas from './components/KumikoCanvas';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const canvasComponentRef = useRef(null);
  const [exportRes, setExportRes] = useState(2160);
  const [useOriginalColors, setUseOriginalColors] = useState(false);

  // --- Phase 3: Control Panel State ---
  const [gridSize, setGridSize] = useState(20);
  const [baseThickness, setBaseThickness] = useState(3.5);
  const [sensitivity, setSensitivity] = useState(1.0);
  const [activePattern, setActivePattern] = useState('asanoha_true');

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFile(files[0]);
  };

  const onButtonClick = () => fileInputRef.current.click();
  const onFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFile(files[0]);
  };

  const resetImage = () => setImageSrc(null);

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="w-full max-w-7xl text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-amber-900 sm:text-5xl mb-2">
          Kumiko Art Generator
        </h1>
        <p className="text-lg text-amber-800/70">
          Transform your images into traditional Japanese woodwork patterns.
        </p>
      </div>

      {!imageSrc ? (
        /* Upload Interface */
        <div className="w-full max-w-4xl text-center">
          <div
            className={`mt-2 flex justify-center rounded-xl border border-dashed border-amber-900/25 px-6 py-24 transition-colors duration-200 ${
              isDragging ? 'bg-amber-100 border-amber-900 border-2' : 'bg-white'
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-amber-900/25" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
              </svg>
              <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                <label className="relative cursor-pointer rounded-md bg-white font-semibold text-amber-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-600 focus-within:ring-offset-2 hover:text-amber-500">
                  <span onClick={onButtonClick}>Upload a file</span>
                  <input type="file" className="sr-only" ref={fileInputRef} onChange={onFileChange} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        /* Two-Column App Layout */
        <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-8 items-start">
          
          {/* Left Sidebar Controls */}
          <aside className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-sm border border-amber-900/10 shrink-0">
            <h2 className="text-xl font-bold text-amber-900 mb-6 border-b border-amber-100 pb-2">Pattern Controls</h2>
            
            <div className="space-y-6">
              {/* Pattern Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kumiko Style
                </label>
                <select 
                  value={activePattern}
                  onChange={(e) => setActivePattern(e.target.value)}
                  className="w-full rounded-md border border-amber-900/20 bg-white px-3 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <optgroup label="Hexagonal (Traditional)">
                    <option value="asanoha_true">True Asanoha</option>
                    <option value="mitsukude">Mitsukude (Triangle Grid)</option>
                  </optgroup>
                  <optgroup label="Square (Modern)">
                    <option value="asanoha_square">Square Asanoha</option>
                    <option value="kaku">Kaku (Grid & Cross)</option>
                    <option value="hishi">Hishi (Diamond Crosshatch)</option>
                  </optgroup>
                </select>
              </div>

              {/* Grid Density Slider */}
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Grid Density (Size)</span>
                  <span className="text-amber-700">{gridSize}px</span>
                </label>
                <input 
                  type="range" min="8" max="50" step="1" 
                  value={gridSize} 
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  className="w-full accent-amber-700 cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Smaller value = higher resolution</p>
              </div>

              {/* Base Thickness Slider */}
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Max Line Thickness</span>
                  <span className="text-amber-700">{baseThickness}</span>
                </label>
                <input 
                  type="range" min="0.5" max="8.0" step="0.1" 
                  value={baseThickness} 
                  onChange={(e) => setBaseThickness(Number(e.target.value))}
                  className="w-full accent-amber-700 cursor-pointer"
                />
              </div>

              {/* Sensitivity Slider */}
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Contrast Sensitivity</span>
                  <span className="text-amber-700">{sensitivity}</span>
                </label>
                <input 
                  type="range" min="0" max="2" step="0.1" 
                  value={sensitivity} 
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                  className="w-full accent-amber-700 cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Adjusts reaction to lighter areas</p>
              </div>
            </div>

            {/* Color Mode Toggle */}
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Use Original Image Colors</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={useOriginalColors}
                      onChange={() => setUseOriginalColors(!useOriginalColors)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${useOriginalColors ? 'bg-amber-700' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useOriginalColors ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>

            <button 
              onClick={resetImage}
              className="mt-8 w-full px-4 py-2 text-sm font-semibold text-amber-900 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors border border-amber-200"
            >
              Upload New Image
            </button>
            {/* --- NEW EXPORT SECTION --- */}
            <div className="mt-6 pt-6 border-t border-amber-100 space-y-3">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Export Art</h3>
              
              <div className="flex gap-2 mb-2">
                <select 
                  value={exportRes}
                  onChange={(e) => setExportRes(Number(e.target.value))}
                  className="w-full rounded-md border border-amber-900/20 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value={1080}>FHD (1080p)</option>
                  <option value={1440}>QHD (1440p)</option>
                  <option value={2160}>4K (2160p)</option>
                  <option value={4320}>8K (4320p)</option>
                </select>
              </div>

              <button 
                onClick={() => canvasComponentRef.current?.exportPNG(exportRes)}
                className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-amber-700 rounded-md hover:bg-amber-800 transition-colors shadow-sm"
              >
                Download PNG
              </button>
              <button 
                onClick={() => canvasComponentRef.current?.exportSVG(exportRes)}
                className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-800 bg-white border border-amber-300 rounded-md hover:bg-amber-50 transition-colors shadow-sm"
              >
                Download SVG
              </button>
            </div>
          </aside>

          {/* Main Canvas Area */}
          <main className="flex-grow w-full bg-white p-6 rounded-xl shadow-sm border border-amber-900/10 flex justify-center items-center">
            <KumikoCanvas
              ref={canvasComponentRef} 
              imageSrc={imageSrc} 
              gridSize={gridSize}
              baseThickness={baseThickness}
              sensitivity={sensitivity}
              activePattern={activePattern}
              useOriginalColors={useOriginalColors}
            />
          </main>
        </div>
      )}
    </div>
  );
}

export default App;