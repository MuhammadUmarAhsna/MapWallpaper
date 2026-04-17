import { toPng } from 'html-to-image';

export const exportToPng = async (elementId: string) => {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error('Element not found');
  }

  try {
    const dataUrl = await toPng(node, {
      quality: 0.95,
      pixelRatio: 2, // High resolution
    });
    
    const link = document.createElement('a');
    link.download = `iqdar-map-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting image:', error);
    throw error;
  }
};
