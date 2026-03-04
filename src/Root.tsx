import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Gallery } from './components/Gallery';
import { EquipmentShop } from './components/EquipmentShop';
import { Contact } from './components/Contact';
import { About } from './components/About';
import { Toaster } from './components/ui/sonner';
import { useSharedState } from './lib/sharedState';

export default function Root() {
  const [activeCollection, setActiveCollection] = useState('all');
  const { workItems, equipment } = useSharedState();

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        activeCollection={activeCollection}
        onCollectionChange={setActiveCollection}
        showAdmin={false}
      />
      {activeCollection === 'equipment' ? (
        <EquipmentShop equipment={equipment} />
      ) : activeCollection === 'contact' ? (
        <Contact />
      ) : activeCollection === 'about' ? (
        <About />
      ) : (
        <Gallery 
          activeCollection={activeCollection}
          workItems={workItems}
        />
      )}
      <Toaster />
    </div>
  );
}
