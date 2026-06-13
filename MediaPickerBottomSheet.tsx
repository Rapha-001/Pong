import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Video, Image, Folder, Loader2, X } from 'lucide-react';

interface MediaPickerBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMediaBatch: (mediaDataUrls: string[]) => void;
  onShowToast: (msg: string, type: 'success' | 'warn') => void;
  maxFiles?: number;
  currentFilesCount: number;
  theme?: 'light' | 'dark';
}

export default function MediaPickerBottomSheet({
  isOpen,
  onClose,
  onSelectMediaBatch,
  onShowToast,
  maxFiles = 4,
  currentFilesCount,
  theme = 'light',
}: MediaPickerBottomSheetProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Hidden file input refs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';

  // Helper code to compress images before saving them
  const compressAndConvertFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // For videos or documents, convert to dynamic DataURL directly without resizing
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
        return;
      }

      const img = new window.Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1100;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Context failure fallback
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.readAsDataURL(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // High savings quality setting (0.78) for immediate load speeds
          const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
          resolve(dataUrl);
        } catch (_) {
          // Fallback to base data URL on canvas security or conversion errors
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(file);
        }
      };

      img.onerror = () => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(file);
      };
    });
  };

  // Process selected file lists
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, source: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      onClose();
      return;
    }

    const remainingCount = maxFiles - currentFilesCount;
    if (remainingCount <= 0) {
      onShowToast(`You have reached the maximum allowance of ${maxFiles} attachments per post.`, 'warn');
      onClose();
      return;
    }

    const filesToProcess = (Array.from(files) as File[]).slice(0, remainingCount);
    setIsProcessing(true);

    try {
      const dataUrls: string[] = [];
      for (const file of filesToProcess) {
        // Enforce specific limits per media type
        let limitSize = 15 * 1024 * 1024; // Default: 15MB for Post Images / Photos
        let limitTypeLabel = "15MB";
        
        if (file.type.startsWith('video/')) {
          limitSize = 50 * 1024 * 1024; // Short Videos: 50MB
          limitTypeLabel = "50MB";
        } else if (file.type.startsWith('image/')) {
          limitSize = 15 * 1024 * 1024; // Post Images: 15MB
          limitTypeLabel = "15MB";
        } else if (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc') || file.type.includes('word') || file.type.includes('document')) {
          limitSize = 20 * 1024 * 1024; // Documents: 20MB
          limitTypeLabel = "20MB";
        } else {
          // General documents/files fallback
          limitSize = 20 * 1024 * 1024; // Documents: 20MB
          limitTypeLabel = "20MB";
        }

        if (file.size > limitSize) {
          onShowToast(`"${file.name}" exceeds the allowed upload limit of ${limitTypeLabel} for this media type.`, 'warn');
          continue;
        }

        const res = await compressAndConvertFile(file);
        dataUrls.push(res);
      }

      if (dataUrls.length > 0) {
        onSelectMediaBatch(dataUrls);
        onShowToast(`Loaded ${dataUrls.length} file(s) from ${source}.`, 'success');
      }
    } catch (err) {
      onShowToast('Could not convert or compress selected files.', 'warn');
    } finally {
      setIsProcessing(false);
      onClose();
      // Reset input value to allow selecting same file again
      e.target.value = '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* DARK TRANSLUCENT BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
            id="media-picker-backdrop"
          >
            {/* PREVENT BUBBLING TO CLOSE MODAL */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 290 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-t-3xl p-6 relative pb-8 text-left shadow-2xl focus:outline-none ${
                isDark 
                  ? 'bg-zinc-900 border-t border-zinc-800 text-zinc-100' 
                  : 'bg-white text-zinc-900 border-t border-zinc-100'
              }`}
              id="media-picker-bottom-sheet"
            >
              {/* TOP DRAG HANDLEBAR */}
              <div className="w-12 h-1.5 bg-zinc-350 dark:bg-zinc-700 rounded-full mx-auto mb-5 opacity-80" />

              {/* HEADING ACCENT */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                    Add Post Media
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-semibold leading-none mt-0.5">
                    Select a channel to upload assets ({currentFilesCount}/{maxFiles} attached)
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-zinc-150 dark:hover:bg-zinc-800 transition text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ACTION SKELETON LOADER OVERLAY */}
              {isProcessing && (
                <div className="absolute inset-0 bg-white/85 dark:bg-black/85 flex flex-col items-center justify-center gap-2 rounded-t-3xl z-10">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-xs font-black uppercase tracking-wider font-mono text-zinc-500">
                    Encrypting preview assets...
                  </p>
                </div>
              )}

              {/* HORIZONTAL MEDIA ACTIONS ROW */}
              <div className="grid grid-cols-4 gap-2 text-center" id="picker-actions-horizontal-row">
                
                {/* CAMERA BUTTON */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center gap-2.5 group cursor-pointer focus:outline-none"
                  title="Capture Instant Photo"
                >
                  <div className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 active:scale-95">
                    <Camera className="w-5.5 h-5.5 stroke-[2.35]" />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight text-zinc-650 dark:text-zinc-300">
                    Camera
                  </span>
                </button>

                {/* RECORD VIDEO BUTTON */}
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="flex flex-col items-center gap-2.5 group cursor-pointer focus:outline-none"
                  title="Record High-Quality Video"
                >
                  <div className="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 active:scale-95">
                    <Video className="w-5.5 h-5.5 stroke-[2.35]" />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight text-zinc-650 dark:text-zinc-300">
                    Record Video
                  </span>
                </button>

                {/* GALLERY BUTTON */}
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex flex-col items-center gap-2.5 group cursor-pointer focus:outline-none"
                  title="Browse Gallery Library"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 active:scale-95">
                    <Image className="w-5.5 h-5.5 stroke-[2.35]" />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight text-zinc-650 dark:text-zinc-300">
                    Gallery
                  </span>
                </button>

                {/* FILES BUTTON */}
                <button
                  onClick={() => filesInputRef.current?.click()}
                  className="flex flex-col items-center gap-2.5 group cursor-pointer focus:outline-none"
                  title="Attach Saved Files"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 active:scale-95">
                    <Folder className="w-5.5 h-5.5 stroke-[2.35]" />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight text-zinc-650 dark:text-zinc-300">
                    Files
                  </span>
                </button>

              </div>

              {/* HIDDEN FILE INPUT ACTIONS */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'Camera')}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'Record Video')}
              />
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'Gallery')}
              />
              <input
                ref={filesInputRef}
                type="file"
                multiple
                accept="*/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'Files')}
              />

              {/* FOOTER TEXT */}
              <p className="mt-8 text-[10px] text-zinc-400 dark:text-zinc-500 text-center font-semibold">
                By uploading files, you declare that your content adheres to the UniUyo Campus guidelines.
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
