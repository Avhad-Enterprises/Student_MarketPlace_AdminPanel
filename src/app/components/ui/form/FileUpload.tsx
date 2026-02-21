/**
 * FILE UPLOAD COMPONENT
 * 
 * Branded replacement for native <input type="file">
 * 
 * Features:
 * - Drag & drop support
 * - File validation (type, size)
 * - Preview thumbnails
 * - Progress indicators
 * - Multiple file support
 * - Remove/replace files
 */

import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  onUpload?: (files: File[]) => void | Promise<void>;
  onChange?: (files: File[]) => void;
  preview?: boolean;
  dragAndDrop?: boolean;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  maxFiles?: number;
}

export interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// ============================================
// FILE TYPE HELPERS
// ============================================

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return ImageIcon;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('pdf')) return FileText;
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return Archive;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// ============================================
// COMPONENT
// ============================================

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  onUpload,
  onChange,
  preview = true,
  dragAndDrop = true,
  disabled = false,
  label,
  helperText,
  maxFiles,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Generate preview for images
  const generatePreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  }, []);

  // Validate file
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (maxSize && file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${formatFileSize(maxSize)}`,
      };
    }

    // Check file type
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const fileMimeType = file.type;

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith('/*')) {
          return fileMimeType.startsWith(type.replace('/*', ''));
        }
        return fileMimeType === type;
      });

      if (!isAccepted) {
        return {
          valid: false,
          error: `File type not accepted. Allowed: ${accept}`,
        };
      }
    }

    // Check max files
    if (maxFiles && files.length >= maxFiles) {
      return {
        valid: false,
        error: `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`,
      };
    }

    return { valid: true };
  }, [accept, maxSize, maxFiles, files.length]);

  // Process files
  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(fileList)) {
      const validation = validateFile(file);

      const uploadedFile: UploadedFile = {
        file,
        id: `${Date.now()}-${Math.random()}`,
        progress: 0,
        status: validation.valid ? 'pending' : 'error',
        error: validation.error,
      };

      if (validation.valid && preview && file.type.startsWith('image/')) {
        uploadedFile.preview = await generatePreview(file);
      }

      newFiles.push(uploadedFile);

      if (!multiple) break;
    }

    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);

    // Call onChange
    if (onChange) {
      onChange(newFiles.map(f => f.file));
    }

    // Auto-upload if onUpload is provided
    if (onUpload) {
      uploadFiles(newFiles);
    }
  }, [validateFile, preview, multiple, onChange, onUpload, generatePreview]);

  // Upload files
  const uploadFiles = useCallback(async (filesToUpload: UploadedFile[]) => {
    for (const uploadedFile of filesToUpload) {
      if (uploadedFile.status !== 'pending') continue;

      // Update status to uploading
      setFiles(prev => prev.map(f =>
        f.id === uploadedFile.id
          ? { ...f, status: 'uploading' as const }
          : f
      ));

      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => prev.map(f =>
            f.id === uploadedFile.id
              ? { ...f, progress: i }
              : f
          ));
        }

        // Call onUpload
        if (onUpload) {
          await onUpload([uploadedFile.file]);
        }

        // Update status to success
        setFiles(prev => prev.map(f =>
          f.id === uploadedFile.id
            ? { ...f, status: 'success' as const, progress: 100 }
            : f
        ));
      } catch (error) {
        // Update status to error
        setFiles(prev => prev.map(f =>
          f.id === uploadedFile.id
            ? { ...f, status: 'error' as const, error: 'Upload failed' }
            : f
        ));
      }
    }
  }, [onUpload]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Remove file
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const acceptedFormats = accept?.split(',').map(t => t.trim().toUpperCase()).join(', ') || 'All files';

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={dragAndDrop && !disabled ? handleDragEnter : undefined}
        onDragLeave={dragAndDrop && !disabled ? handleDragLeave : undefined}
        onDragOver={dragAndDrop && !disabled ? handleDragOver : undefined}
        onDrop={dragAndDrop && !disabled ? handleDrop : undefined}
        onClick={!disabled ? openFilePicker : undefined}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
          ${isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mb-4
            ${isDragging ? 'bg-purple-100' : 'bg-gray-100'}
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-purple-600' : 'text-gray-400'}`} />
          </div>

          <p className="text-base font-medium text-gray-900 mb-1">
            {isDragging ? 'Drop files here' : 'Drop files here or click to upload'}
          </p>

          <p className="text-sm text-gray-500">
            {acceptedFormats}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Max size: {formatFileSize(maxSize)}
            {maxFiles && ` • Max ${maxFiles} file${maxFiles > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {files.map((uploadedFile) => (
              <FileItem
                key={uploadedFile.id}
                uploadedFile={uploadedFile}
                onRemove={() => removeFile(uploadedFile.id)}
                showPreview={preview}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// ============================================
// FILE ITEM COMPONENT
// ============================================

const FileItem: React.FC<{
  uploadedFile: UploadedFile;
  onRemove: () => void;
  showPreview: boolean;
}> = ({ uploadedFile, onRemove, showPreview }) => {
  const { file, preview, progress, status, error } = uploadedFile;
  const FileIcon = getFileIcon(file.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`
        flex items-center gap-3 p-3 rounded-lg border
        ${status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}
      `}
    >
      {/* Preview/Icon */}
      <div className="w-12 h-12 flex-shrink-0">
        {showPreview && preview ? (
          <img
            src={preview}
            alt={file.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
            <FileIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </p>

        {/* Progress Bar */}
        {status === 'uploading' && (
          <div className="mt-2">
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-purple-600"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}%</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && error && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}

        {/* Success */}
        {status === 'success' && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Upload complete
          </p>
        )}
      </div>

      {/* Status Icon */}
      <div className="flex-shrink-0">
        {status === 'uploading' && (
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        )}
        {status === 'error' && (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        {(status === 'pending' || status === 'success') && (
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
