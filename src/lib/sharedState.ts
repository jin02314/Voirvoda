// Type definitions for the application

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
