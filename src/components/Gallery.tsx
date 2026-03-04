import { useState } from 'react';
import { motion } from 'motion/react';
import { ImageModal } from './ImageModal';
import { WorkItem } from '../lib/sharedState';

interface GalleryProps {
  activeCollection: string;
  workItems: WorkItem[];
}

export function Gallery({ activeCollection, workItems }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredArtworks = activeCollection === 'all' 
    ? workItems 
    : workItems.filter(art => art.type === activeCollection);

  const handleImageClick = (artwork: WorkItem) => {
    // 비디오는 항상 모달에서 YouTube 임베드로 표시
    if (artwork.type === 'video') {
      setSelectedImage(artwork.id);
    } 
    // 포토는 외부 링크가 있으면 새 창에서 열기, 없으면 모달 열기
    else if (artwork.link) {
      window.open(artwork.link, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedImage(artwork.id);
    }
  };

  return (
    <>
      <main className="lg:ml-40 flex-1 pt-20 lg:pt-[30px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="aspect-square relative overflow-hidden cursor-pointer group"
              onClick={() => handleImageClick(artwork)}
            >
              <img
                src={artwork.thumbnail || artwork.url}
                alt={artwork.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              
              {/* 포토이면서 링크가 있으면 표시 */}
              {artwork.type === 'photo' && artwork.link && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  외부 링크 →
                </div>
              )}
              
              {/* 제목과 설명 오버레이 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white font-medium">{artwork.title}</h3>
                {artwork.description && (
                  <p className="text-white/80 text-sm mt-1 line-clamp-2">
                    {artwork.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <ImageModal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        image={workItems.find(a => a.id === selectedImage)}
      />
    </>
  );
}