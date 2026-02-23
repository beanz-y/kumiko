import { useState, useRef } from 'react';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file reading
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

  // Drag and drop event handlers
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Click to upload handlers
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const resetImage = () => {
    setImageSrc(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-amber-900 sm:text-5xl mb-2">
          Kumiko Art Generator
        </h1>
        <p className="text-lg text-amber-800/70 mb-10">
          Transform your images into traditional Japanese woodwork patterns.
        </p>

        {/* Upload Interface */}
        {!imageSrc ? (
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
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-amber-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-600 focus-within:ring-offset-2 hover:text-amber-500"
                >
                  <span onClick={onButtonClick}>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={onFileChange} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        ) : (
          /* Preview Section (Temporary placeholder for Phase 2 Canvas) */
          <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm border border-amber-900/10">
             <div className="w-full max-w-2xl bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center">
               <img src={imageSrc} alt="Uploaded preview" className="max-h-[600px] object-contain" />
             </div>
             <div className="mt-6 flex gap-4">
                <button 
                  onClick={resetImage}
                  className="px-4 py-2 text-sm font-semibold text-amber-900 bg-amber-100 rounded-md hover:bg-amber-200 transition-colors"
                >
                  Choose Different Image
                </button>
                <button 
                  className="px-4 py-2 text-sm font-semibold text-white bg-amber-800 rounded-md hover:bg-amber-900 transition-colors cursor-not-allowed opacity-50"
                  disabled
                >
                  Generate Pattern (Coming Next)
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;