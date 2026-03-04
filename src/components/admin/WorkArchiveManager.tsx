import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
  Calendar,
  Tag,
  Edit,
  Link as LinkIcon,
  GripVertical,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { WorkItem } from '../../lib/sharedState';
import * as api from '../../lib/api';

interface WorkArchiveManagerProps {
  workItems: WorkItem[];
  setWorkItems: React.Dispatch<React.SetStateAction<WorkItem[]>>;
}

export function WorkArchiveManager({ workItems, setWorkItems }: WorkArchiveManagerProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'photo' as 'photo' | 'video',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    link: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      toast.success(`썸네일 "${file.name}"이 선택되었습니다`);
    }
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImageFiles(fileArray);
      toast.success(`${fileArray.length}개의 이미지가 선택되었습니다`);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImageFiles = [...imageFiles];
    const [movedItem] = newImageFiles.splice(fromIndex, 1);
    newImageFiles.splice(toIndex, 0, movedItem);
    setImageFiles(newImageFiles);
  };

  const removeImage = (index: number) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newImageFiles);
    toast.success('이미지가 제거되었습니다');
  };

  const handleAddWork = async () => {
    if (!uploadForm.title || !uploadForm.category) {
      toast.error('제목과 카테고리를 입력해주세요');
      return;
    }

    if (!thumbnailFile) {
      toast.error('썸네일 이미지를 선택해주세요');
      return;
    }

    if (uploadForm.type === 'photo' && imageFiles.length === 0) {
      toast.error('작품 이미지를 최소 1개 이상 선택해주세요');
      return;
    }

    if (uploadForm.type === 'video' && !uploadForm.link) {
      toast.error('YouTube 링크를 입력해주세요');
      return;
    }

    setIsUploading(true);

    try {
      const response = await api.addWork(uploadForm, thumbnailFile, imageFiles);
      const newWork: WorkItem = {
        ...uploadForm,
        ...response.work,
        id: response.id
      };
      setWorkItems([newWork, ...workItems]);
      toast.success('작품이 추가되었습니다');
      resetForm();
    } catch (error: any) {
      console.error('작품 추가 오류:', error);
      toast.error(error.message || '작품 추가에 실패했습니다');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!isEditing) return;

    setIsUploading(true);

    try {
      const response = await api.updateWork(isEditing, uploadForm, thumbnailFile, imageFiles);
      setWorkItems(workItems.map(item =>
        item.id === isEditing ? { ...item, ...uploadForm, ...response.work } : item
      ));
      toast.success('작품이 수정되었습니다');
      resetForm();
    } catch (error: any) {
      console.error('작품 수정 오류:', error);
      toast.error(error.message || '작품 수정에 실패했습니다');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (item: WorkItem) => {
    setIsEditing(item.id);
    setUploadForm({
      title: item.title,
      type: item.type,
      category: item.category,
      date: item.date,
      description: item.description || '',
      link: item.link || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 이 작품을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await api.deleteWork(id);
      setWorkItems(workItems.filter(item => item.id !== id));
      toast.success('작품이 삭제되었습니다');
    } catch (error: any) {
      console.error('작품 삭제 오류:', error);
      toast.error(error.message || '작품 삭제에 실패했습니다');
    }
  };

  const resetForm = () => {
    setUploadForm({
      title: '',
      type: 'photo',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      link: ''
    });
    setThumbnailFile(null);
    setImageFiles([]);
    setIsEditing(null);
  };

  const photoItems = workItems.filter(item => item.type === 'photo');
  const videoItems = workItems.filter(item => item.type === 'video');

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? '작품 수정' : '새 작품 업로드'}
          </CardTitle>
          <CardDescription>
            {isEditing ? '작품 정보를 수정하세요' : '포토 또는 비디오 작품을 추가하세요'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">작품 제목 *</Label>
              <Input
                id="title"
                placeholder="예: 프로젝트 이름"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Input
                id="category"
                placeholder="예: commercial, editorial"
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">타입</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={uploadForm.type}
                onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as 'photo' | 'video' })}
              >
                <option value="photo">포토</option>
                <option value="video">비디오</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">날짜</Label>
              <Input
                id="date"
                type="date"
                value={uploadForm.date}
                onChange={(e) => setUploadForm({ ...uploadForm, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">작품 설명</Label>
            <Textarea
              id="description"
              placeholder="작품에 대한 설명을 입력하세요"
              rows={3}
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
            />
          </div>

          {uploadForm.type === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="link">
                <LinkIcon className="w-4 h-4 inline mr-2" />
                YouTube 링크 *
              </Label>
              <Input
                id="link"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={uploadForm.link}
                onChange={(e) => setUploadForm({ ...uploadForm, link: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                YouTube 영상 링크를 입력하세요. 클릭 시 임베드 영상이 재생됩니다.
              </p>
            </div>
          )}

          {!isEditing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">
                  썸네일 이미지 * (1:1 비율 권장)
                </Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                />
                <p className="text-xs text-gray-500">
                  갤러리에 표시될 정사각형 썸네일 이미지를 선택하세요
                </p>
              </div>

              {uploadForm.type === 'photo' && (
                <div className="space-y-2">
                  <Label htmlFor="images">
                    작품 이미지 * (여러 장 선택 가능)
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                  />
                  <p className="text-xs text-gray-500">
                    클릭 시 표시될 이미지들을 선택하세요. 여러 장을 선택하면 좌우로 넘겨볼 수 있습니다.
                  </p>
                  
                  {/* Instagram-style Image Preview and Reorder */}
                  {imageFiles.length > 0 && (
                    <div className="mt-6 p-4 border-2 border-dashed rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            선택된 이미지 {imageFiles.length}개
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            드래그하여 순서 변경 • 첫 번째 이미지가 대표 이미지로 표시됩니다
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {imageFiles.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="relative aspect-square group cursor-move bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.effectAllowed = 'move';
                              e.dataTransfer.setData('text/plain', index.toString());
                              e.currentTarget.style.opacity = '0.5';
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                              e.currentTarget.classList.add('ring-2', 'ring-blue-500');
                            }}
                            onDragLeave={(e) => {
                              e.currentTarget.classList.remove('ring-2', 'ring-blue-500');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('ring-2', 'ring-blue-500');
                              const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                              moveImage(fromIndex, index);
                            }}
                          >
                            {/* Image */}
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`${index + 1}번째 이미지`}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                              <GripVertical className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            {/* Number Badge */}
                            <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                              index === 0 ? 'bg-blue-600' : 'bg-gray-900 bg-opacity-80'
                            }`}>
                              {index + 1}
                            </div>
                            
                            {/* First Image Badge */}
                            {index === 0 && (
                              <div className="absolute bottom-2 left-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded text-center shadow-lg">
                                대표 이미지
                              </div>
                            )}
                            
                            {/* Remove Button */}
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {isEditing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">
                  썸네일 이미지 변경 (선택사항)
                </Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                />
                {thumbnailFile && (
                  <p className="text-xs text-green-600">
                    새 썸네일이 선택됨: {thumbnailFile.name}
                  </p>
                )}
              </div>

              {uploadForm.type === 'photo' && (
                <div className="space-y-2">
                  <Label htmlFor="images">
                    작품 이미지 변경 (선택사항, 여러 장 가능)
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                  />
                  {imageFiles.length > 0 && (
                    <>
                      <p className="text-xs text-green-600">
                        {imageFiles.length}개의 새 이미지가 선택됨
                      </p>
                      
                      {/* Instagram-style Image Preview and Reorder in Edit Mode */}
                      <div className="mt-6 p-4 border-2 border-dashed rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              선택된 이미지 {imageFiles.length}개
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              드래그하여 순서 변경 • 첫 번째 이미지가 대표 이미지로 표시됩니다
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {imageFiles.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="relative aspect-square group cursor-move bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData('text/plain', index.toString());
                                e.currentTarget.style.opacity = '0.5';
                              }}
                              onDragEnd={(e) => {
                                e.currentTarget.style.opacity = '1';
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                e.currentTarget.classList.add('ring-2', 'ring-blue-500');
                              }}
                              onDragLeave={(e) => {
                                e.currentTarget.classList.remove('ring-2', 'ring-blue-500');
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('ring-2', 'ring-blue-500');
                                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                moveImage(fromIndex, index);
                              }}
                            >
                              {/* Image */}
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`${index + 1}번째 이미지`}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Overlay on hover */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                <GripVertical className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              
                              {/* Number Badge */}
                              <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                                index === 0 ? 'bg-blue-600' : 'bg-gray-900 bg-opacity-80'
                              }`}>
                                {index + 1}
                              </div>
                              
                              {/* First Image Badge */}
                              {index === 0 && (
                                <div className="absolute bottom-2 left-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded text-center shadow-lg">
                                  대표 이미지
                                </div>
                              )}
                              
                              {/* Remove Button */}
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(index);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleUpdate} className="bg-black text-white hover:bg-gray-800">
                  수정 완료
                </Button>
                <Button onClick={resetForm} variant="outline">
                  취소
                </Button>
              </>
            ) : (
              <Button onClick={handleAddWork} className="bg-black text-white hover:bg-gray-800">
                <Upload className="w-4 h-4 mr-2" />
                추가하기
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Work Items List */}
      <Card>
        <CardHeader>
          <CardTitle>작품 목록</CardTitle>
          <CardDescription>
            총 {workItems.length}개의 작품 (포토: {photoItems.length}, 비디오: {videoItems.length}) • 드래그하여 순서 변경
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">전체 ({workItems.length})</TabsTrigger>
              <TabsTrigger value="photo">포토 ({photoItems.length})</TabsTrigger>
              <TabsTrigger value="video">비디오 ({videoItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <WorkItemsList 
                items={workItems} 
                onDelete={handleDelete} 
                onEdit={handleEdit}
                onReorder={(newItems) => setWorkItems(newItems)}
              />
            </TabsContent>

            <TabsContent value="photo" className="mt-4">
              <WorkItemsList 
                items={photoItems} 
                onDelete={handleDelete} 
                onEdit={handleEdit}
                onReorder={(newItems) => {
                  const otherItems = workItems.filter(item => item.type !== 'photo');
                  setWorkItems([...newItems, ...otherItems]);
                }}
              />
            </TabsContent>

            <TabsContent value="video" className="mt-4">
              <WorkItemsList 
                items={videoItems} 
                onDelete={handleDelete} 
                onEdit={handleEdit}
                onReorder={(newItems) => {
                  const otherItems = workItems.filter(item => item.type !== 'video');
                  setWorkItems([...newItems, ...otherItems]);
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface WorkItemsListProps {
  items: WorkItem[];
  onDelete: (id: string) => void;
  onEdit: (item: WorkItem) => void;
  onReorder: (items: WorkItem[]) => void;
}

function WorkItemsList({ items, onDelete, onEdit, onReorder }: WorkItemsListProps) {
  const [draggedItem, setDraggedItem] = useState<WorkItem | null>(null);

  const handleDragStart = (e: React.DragEvent, item: WorkItem) => {
    setDraggedItem(item);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    
    const dropTarget = e.currentTarget as HTMLElement;
    const targetId = dropTarget.id;
    
    if (!draggedItem || draggedItem.id === targetId) return;

    const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
    const targetIndex = items.findIndex(item => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newItems = [...items];
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    onReorder(newItems);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        작품이 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="relative flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all cursor-move"
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          id={item.id}
        >
          {/* Drag Handle */}
          <div className="flex items-center justify-center w-8 pt-8">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>

          {/* Thumbnail */}
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {item.thumbnail ? (
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {item.type === 'photo' ? (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                ) : (
                  <Video className="w-8 h-8 text-gray-400" />
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{item.title}</h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 flex-wrap">
              <Badge variant={item.type === 'photo' ? 'default' : 'secondary'}>
                {item.type === 'photo' ? (
                  <>
                    <ImageIcon className="w-3 h-3 mr-1" />
                    포토
                    {item.images && item.images.length > 1 && (
                      <span className="ml-1">({item.images.length})</span>
                    )}
                  </>
                ) : (
                  <>
                    <Video className="w-3 h-3 mr-1" />
                    비디오
                  </>
                )}
              </Badge>
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {item.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.date}
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
                onEdit(item);
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
                onDelete(item.id);
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
  );
}