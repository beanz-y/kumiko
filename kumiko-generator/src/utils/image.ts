export const processImageLuminance = async (
  imageUrl: string,
  cols: number,
  rows: number
): Promise<number[][]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve([]);

      // Process at a max width of 800px to save memory, height scaled proportionally
      const scale = Math.min(1, 800 / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const cellWidth = canvas.width / cols;
      const cellHeight = canvas.height / rows;
      const matrix: number[][] = [];

      for (let y = 0; y < rows; y++) {
        const row: number[] = [];
        for (let x = 0; x < cols; x++) {
          const imgData = ctx.getImageData(
            x * cellWidth, 
            y * cellHeight, 
            Math.max(1, cellWidth), 
            Math.max(1, cellHeight)
          );
          const data = imgData.data;
          let totalLuminance = 0;

          // Calculate average luminance of the cell (Standard perceived brightness formula)
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
          }
          
          const pixelCount = data.length / 4;
          const avgLuminance = totalLuminance / pixelCount;
          row.push(avgLuminance);
        }
        matrix.push(row);
      }
      resolve(matrix);
    };
  });
};