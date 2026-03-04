import { Instagram, Menu, X, Youtube } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeCollection: string;
  onCollectionChange: (collection: string) => void;
  showAdmin?: boolean;
}

export function Sidebar({ activeCollection, onCollectionChange, showAdmin = false }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCollectionClick = (id: string) => {
    onCollectionChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-50 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-black"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-2xl">Voir, Voda</h1>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-[73px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-40 pl-6 pt-6 pb-6 flex flex-col justify-between bg-white z-40
        fixed lg:sticky top-0 h-screen overflow-y-auto
        transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:mt-0 mt-[73px]
      `}>
        <div>
          <h1 className="text-3xl font-bold mb-8 hidden lg:block whitespace-nowrap">Voir, Voda</h1>
          
          <nav>
            <div className="mb-6">
              <button
                onClick={() => handleCollectionClick('all')}
                className={`text-left transition-colors mb-3 text-xs ${
                  activeCollection === 'all'
                    ? 'text-black'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                Work Archive
              </button>
              <ul className="space-y-2 pl-3">
                <li>
                  <button
                    onClick={() => handleCollectionClick('photo')}
                    className={`text-left transition-colors text-xs ${
                      activeCollection === 'photo'
                        ? 'text-black'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    Photo
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCollectionClick('video')}
                    className={`text-left transition-colors text-xs ${
                      activeCollection === 'video'
                        ? 'text-black'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    Video
                  </button>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <button
                onClick={() => handleCollectionClick('equipment')}
                className={`text-left transition-colors mb-3 text-xs ${
                  activeCollection === 'equipment'
                    ? 'text-black'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                Equipment
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleCollectionClick('contact')}
                    className={`text-left transition-colors text-xs ${
                      activeCollection === 'contact'
                        ? 'text-black'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleCollectionClick('about')}
                    className={`text-left transition-colors text-xs ${
                      activeCollection === 'about'
                        ? 'text-black'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    About
                  </button>
                </li>
              </ul>
              
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="https://instagram.com/voirvoda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://www.youtube.com/@voirvoda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-600 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={16} />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}