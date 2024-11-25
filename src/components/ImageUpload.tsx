import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error('Image upload configuration is missing. Please check your environment variables.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${await response.text()}`);
      }

      const data = await response.json();
      if (!data.secure_url) {
        throw new Error('No URL received from upload service');
      }

      onImageUpload(data.secure_url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [onImageUpload]);

  return (
    <div className="space-y-4">
      {currentImage && (
        <img
          src={currentImage}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg"
        />
      )}
      <label className={`flex items-center gap-2 bg-beige-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-beige-700 transition-colors w-fit ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <Upload size={20} />
        {uploading ? 'Uploading...' : 'Upload Image'}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
    </div>
  );
}