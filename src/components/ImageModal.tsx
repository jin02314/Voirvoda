import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { WorkItem } from '../lib/sharedState';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image?: WorkItem;
}

// YouTube URL을 임베드 URL로 변환하는 함수
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  // https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  
  // https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  
  // 이미 embed URL인 경우
  if (url.includes('youtube.com/embed/')) return url;
  
  return null;
}

export function ImageModal({ isOpen, onClose, image }: ImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!image) return null;

  const isVideo = image.type === 'video';
  const embedUrl = isVideo && image.link ? getYouTubeEmbedUrl(image.link) : null;
  const images = image.images || [image.url];
  const hasMultipleImages = images.length > 1;

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleClose = () => {
    setCurrentImageIndex(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={handleClose}
        >
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close modal"
          >
            <X size={32} />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo && embedUrl ? (
              // YouTube 임베드
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  title={image.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
              </div>
            ) : (
              // 이미지 표시
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={`${image.title} - ${currentImageIndex + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* 이미지 네비게이션 버튼 */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={handlePrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>

                    {/* 이미지 인디케이터 */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
                      <p className="text-white text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            
            <div className="mt-6 text-center text-white">
              <h3 className="text-2xl mb-2">{image.title}</h3>
              {image.description && (
                <p className="text-gray-300 mb-2">{image.description}</p>
              )}
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                {image.type} - {image.category}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}