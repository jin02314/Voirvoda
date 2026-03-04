import { useState, useEffect } from 'react';

export interface WorkItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  category: string;
  date: string;
  description?: string;
  link?: string;
  images?: string[]; // 포토의 경우 여러 이미지
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  priceNumber: number;
  description: string;
  image?: string;
  stock: number;
}

const STORAGE_KEY_WORK = 'voirvoda_work_items';
const STORAGE_KEY_EQUIPMENT = 'voirvoda_equipment';

const defaultWorkItems: WorkItem[] = [
  {
    id: '1',
    title: 'Abstract Composition 01',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
    category: 'commercial',
    date: '2024-03-01',
    description: '추상적인 구성의 상업 작품',
    link: ''
  },
  {
    id: '2',
    title: 'Portrait Series 02',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400',
    category: 'commercial',
    date: '2024-03-05',
    description: '인물 시리즈 촬영',
    link: ''
  },
  {
    id: '3',
    title: 'Graphic Design 03',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400',
    category: 'editorial',
    date: '2024-03-10',
    description: '그래픽 디자인 영상 작업',
    link: ''
  },
  {
    id: '4',
    title: 'Digital Artwork 05',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    category: 'editorial',
    date: '2024-03-15',
    description: '디지털 아트워크 영상',
    link: ''
  }
];

const defaultEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Sony A7C2',
    category: 'camera',
    brand: 'Sony',
    price: '₩50,000',
    priceNumber: 50000,
    description: '프로페셔널 풀프레임 미러리스 카메라',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
    stock: 1
  },
  {
    id: '2',
    name: 'Sony 24-70mm GM2 f/2.8',
    category: 'lens',
    brand: 'Sony',
    price: '₩40,000',
    priceNumber: 40000,
    description: '전문가용 줌 렌즈',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
    stock: 1
  },
  {
    id: '3',
    name: 'DJI RS4 MINI',
    category: 'gimbal',
    brand: 'DJI',
    price: '₩30,000',
    priceNumber: 30000,
    description: '3축 카메라 짐벌 스태빌라이저',
    image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400',
    stock: 1
  },
  {
    id: '4',
    name: 'iFootage Cobra 3 Pedal Monopod',
    category: 'monopod',
    brand: 'iFootage',
    price: '₩10,000',
    priceNumber: 10000,
    description: '전문가용 모노포드',
    image: 'https://images.unsplash.com/photo-1606933248922-48f1ba6e5a6b?w=400',
    stock: 1
  },
  {
    id: '5',
    name: 'GoPro Hero 12 with housing',
    category: 'action-camera',
    brand: 'GoPro',
    price: '₩30,000',
    priceNumber: 30000,
    description: '액션 카메라',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    stock: 1
  },
  {
    id: '6',
    name: 'DJI Mic Mini 무선마이크',
    category: 'microphone',
    brand: 'DJI',
    price: '₩10,000',
    priceNumber: 10000,
    description: '무선 마이크 시스템',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
    stock: 1
  }
];

export function useSharedState() {
  const [workItems, setWorkItems] = useState<WorkItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_WORK);
    return stored ? JSON.parse(stored) : defaultWorkItems;
  });

  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_EQUIPMENT);
    return stored ? JSON.parse(stored) : defaultEquipment;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WORK, JSON.stringify(workItems));
  }, [workItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EQUIPMENT, JSON.stringify(equipment));
  }, [equipment]);

  return {
    workItems,
    setWorkItems,
    equipment,
    setEquipment
  };
}