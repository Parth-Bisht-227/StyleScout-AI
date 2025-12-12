import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file (JPG, PNG).");
      return;
    }
    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large. Please upload an image under 5MB.");
      return;
    }
    onImageSelect(file);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
          ${dragActive ? "border-primary bg-primary/10" : "border-gray-600 bg-surface hover:border-gray-500"}
          ${error ? "border-red-500 bg-red-500/10" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {error ? (
            <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
          ) : (
            <div className={`p-4 rounded-full mb-4 ${dragActive ? 'bg-primary text-secondary' : 'bg-secondary text-primary'}`}>
               <Upload className="w-8 h-8" />
            </div>
          )}
          
          <p className="mb-2 text-lg font-semibold text-text">
            {error ? error : "Click to upload or drag and drop"}
          </p>
          <p className="text-sm text-gray-400">
            {error ? "Try again with a valid image" : "JPG, PNG (max 5MB)"}
          </p>
        </div>
      </div>
      
      {!error && (
        <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
           <ImageIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
           <p>For best results, use a well-lit photo facing the camera directly with no accessories (sunglasses, hats).</p>
        </div>
      )}
    </div>
  );
};