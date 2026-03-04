import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Upload, 
  Trash2, 
  Edit, 
  Camera,
  DollarSign,
  Package,
  GripVertical
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Equipment } from '../../lib/sharedState';
import * as api from '../../lib/api';

interface EquipmentManagerProps {
  equipment: Equipment[];
  setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
}

export function EquipmentManager({ equipment, setEquipment }: EquipmentManagerProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    description: '',
    stock: 0,
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddEquipment = async () => {
    if (!formData.name || !formData.category || !formData.brand || !formData.price) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    setIsUploading(true);

    // Extract number from price string for priceNumber field
    const priceNumber = parseInt(formData.price.replace(/[^0-9]/g, '')) || 0;

    const equipmentData = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      price: formData.price.startsWith('₩') ? formData.price : `₩${formData.price}`,
      priceNumber: priceNumber,
      description: formData.description,
      stock: formData.stock
    };

    try {
      await api.addEquipment(equipmentData, imageFile);
      // 서버에서 최신 데이터 다시 로드
      const updatedEquipment = await api.getEquipment();
      setEquipment(updatedEquipment);
      toast.success('장비가 추가되었습니다');
      resetForm();
    } catch (error: any) {
      console.error('장비 추가 오류:', error);
      toast.error(error.message || '장비 추가에 실패했습니다');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateEquipment = async () => {
    if (!isEditing) return;

    setIsUploading(true);

    const priceNumber = parseInt(formData.price.replace(/[^0-9]/g, '')) || 0;

    const equipmentData = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      price: formData.price.startsWith('₩') ? formData.price : `₩${formData.price}`,
      priceNumber: priceNumber,
      description: formData.description,
      stock: formData.stock
    };

    try {
      const response = await api.updateEquipment(isEditing, equipmentData, imageFile);
      setEquipment(equipment.map(item => 
        item.id === isEditing ? { ...item, ...equipmentData, ...response.equipment } : item
      ));
      toast.success('장비가 수정되었습니다');
      resetForm();
    } catch (error: any) {
      console.error('장비 수정 오류:', error);
      toast.error(error.message || '장비 수정에 실패했습니다');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (item: Equipment) => {
    setIsEditing(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      brand: item.brand,
      price: item.price,
      description: item.description,
      stock: item.stock,
      image: item.image
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 이 장비를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await api.deleteEquipment(id);
      // 서버에서 최신 데이터 다시 로드
      const updatedEquipment = await api.getEquipment();
      setEquipment(updatedEquipment);
      toast.success('장비가 삭제되었습니다');
    } catch (error: any) {
      console.error('장비 삭제 오류:', error);
      toast.error(error.message || '장비 삭제에 실패했습니다');
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedItemId(id);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedItemId || draggedItemId === targetId) return;

    const draggedIndex = equipment.findIndex(item => item.id === draggedItemId);
    const targetIndex = equipment.findIndex(item => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newEquipment = [...equipment];
    const [draggedItem] = newEquipment.splice(draggedIndex, 1);
    newEquipment.splice(targetIndex, 0, draggedItem);

    setEquipment(newEquipment);
    setDraggedItemId(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      brand: '',
      price: '',
      description: '',
      stock: 0,
      image: ''
    });
    setIsEditing(null);
    setImageFile(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      toast.success('이미지가 선택되었습니다');
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Equipment Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? '장비 수정' : '새 장비 추가'}
          </CardTitle>
          <CardDescription>
            {isEditing ? '장비 정보를 수정하세요' : '새로운 장비를 추가하세요'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eq-name">장비명 *</Label>
              <Input
                id="eq-name"
                placeholder="예: Sony A7S III"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eq-brand">브랜드 *</Label>
              <Input
                id="eq-brand"
                placeholder="예: Sony"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eq-category">카테고리 *</Label>
              <Input
                id="eq-category"
                placeholder="예: camera, lens, gimbal"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eq-price">가격 *</Label>
              <Input
                id="eq-price"
                placeholder="예: ₩4,500,000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eq-stock">재고 수량</Label>
              <Input
                id="eq-stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="image">장비 이미지 변경 (선택사항)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {imageFile && (
                  <p className="text-xs text-green-600">
                    새 이미지가 선택됨: {imageFile.name}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eq-description">설명</Label>
            <Textarea
              id="eq-description"
              placeholder="장비에 대한 설명을 입력하세요"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eq-image">장비 이미지 {isEditing ? '변경 (선택사항)' : '업로드 (선택사항)'}</Label>
            <Input
              id="eq-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {imageFile && (
              <p className="text-xs text-green-600">
                선택된 이미지: {imageFile.name}
              </p>
            )}
            {formData.image && !imageFile && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="현재 이미지" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">현재 이미지</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleUpdateEquipment} className="bg-black text-white hover:bg-gray-800">
                  수정 완료
                </Button>
                <Button onClick={resetForm} variant="outline">
                  취소
                </Button>
              </>
            ) : (
              <Button onClick={handleAddEquipment} className="bg-black text-white hover:bg-gray-800">
                <Upload className="w-4 h-4 mr-2" />
                추가하기
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Equipment List */}
      <Card>
        <CardHeader>
          <CardTitle>장비 목록</CardTitle>
          <CardDescription>
            총 {equipment.length}개의 장비 • 드래그하여 순서 변경
          </CardDescription>
        </CardHeader>
        <CardContent>
          {equipment.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 장비가 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {equipment.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg transition-all cursor-move relative ${
                    draggedItemId === item.id 
                      ? 'opacity-50 scale-95' 
                      : 'hover:bg-gray-50 hover:shadow-md'
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(item.id)}
                >
                  {/* Drag Handle */}
                  <div className="flex items-center justify-center w-8 pt-8">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{item.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <Badge variant="outline">
                        {item.brand}
                      </Badge>
                      <Badge variant="secondary">
                        {item.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <DollarSign className="w-3 h-3" />
                        {item.price}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Package className="w-3 h-3" />
                        재고: {item.stock}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="h-8 w-8 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>

                  {/* Order Number Badge */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}