import JSZip from 'jszip';
import saveAs from 'file-saver';
import { GeneratedImage } from '../types';

/**
 * Resizes a Base64 image to exactly 584x584 pixels
 */
export const resizeImage = (base64Str: string, targetWidth: number, targetHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      // High quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (e) => reject(e);
  });
};

/**
 * Zips the generated images organized by Template/Section
 */
export const zipAndDownload = async (images: GeneratedImage[]) => {
  const zip = new JSZip();

  for (const img of images) {
    if (img.status !== 'completed' || !img.base64) continue;

    // Remove data:image/png;base64, prefix
    const base64Data = img.base64.split(',')[1];
    
    // Clean filename
    const cleanPrompt = img.prompt.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    const fileName = `${cleanPrompt}_${img.id.substring(0,4)}.png`;
    
    // Folder Structure: Template Name / Category Name / Image
    const folderPath = `${img.template}/${img.category}`;
    
    zip.file(`${folderPath}/${fileName}`, base64Data, { base64: true });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'educational_images_collection.zip');
};