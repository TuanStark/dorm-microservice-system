import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Building } from '@/types';
import { BuildingFormData } from '@/lib/validations';
import { useFormValidation } from '@/hooks/useFormValidation';
import { buildingSchema } from '@/lib/validations';
import ImageUpload from '@/components/ImageUpload';

interface BuildingFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  building?: Building | null;
  onSubmit: (data: BuildingFormData) => Promise<void>;
  triggerButton?: React.ReactNode;
}

const BuildingFormDialog: React.FC<BuildingFormDialogProps> = ({
  isOpen,
  onOpenChange,
  building,
  onSubmit,
  triggerButton,
}) => {
  const [formData, setFormData] = useState<BuildingFormData>({
    name: '',
    address: '',
    images: [],
  });
  
  const { errors, validate, clearErrors, clearFieldError } = useFormValidation(buildingSchema);

  // Load building data when editing
  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name,
        address: building.address,
        images: building.images || [],
      });
    } else {
      setFormData({
        name: '',
        address: '',
        images: [],
      });
    }
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [building]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      clearFieldError(name);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate(formData)) return;
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit(formData);
      
      // Reset form and close dialog on success
      if (!building) {
        setFormData({ name: '', address: '', images: [] });
      }
      onOpenChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu';
      setSubmitError(errorMessage);
      console.error('Form submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setFormData({ name: '', address: '', images: [] });
      clearErrors();
    }
  };

  // Handle image upload for multiple images
  const handleImageSelect = (index: number) => (imageData: string | File) => {
    const currentImages = formData.images || [];
    if (imageData === '') {
      // Remove image
      const newImages = currentImages.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    } else if (typeof imageData === 'string') {
      // String URL (preview or existing image)
      const newImages = [...currentImages];
      newImages[index] = imageData;
      setFormData(prev => ({ ...prev, images: newImages }));
    } else {
      // File object - convert to data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const newImages = [...currentImages];
        newImages[index] = imageUrl;
        setFormData(prev => ({ ...prev, images: newImages }));
      };
      reader.readAsDataURL(imageData);
    }
  };

  const handleAddImageSlot = () => {
    const currentImages = formData.images || [];
    setFormData(prev => ({
      ...prev,
      images: [...currentImages, '']
    }));
  };

  const handleRemoveImageSlot = (index: number) => {
    const currentImages = formData.images || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{building ? 'Chỉnh sửa tòa nhà' : 'Thêm tòa nhà mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tên tòa nhà</Label>
            <Input 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input 
              id="address" 
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={errors.address ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address}</p>
            )}
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label>Ảnh tòa nhà</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAddImageSlot}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm ảnh
              </Button>
            </div>
            <div className="space-y-4">
              {(formData.images || []).map((image, index) => (
                <div key={index} className="relative">
                  <ImageUpload
                    initialImage={image || undefined}
                    onImageSelect={handleImageSelect(index)}
                    label={`Ảnh ${index + 1}`}
                    className="w-full"
                  />
                  {(formData.images || []).length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-8 right-0 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveImageSlot(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {(!formData.images || formData.images.length === 0) && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <p className="text-sm text-gray-500 mb-2">Chưa có ảnh nào</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddImageSlot}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm ảnh đầu tiên
                  </Button>
                </div>
              )}
            </div>
          </div>
          {submitError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleDialogOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingFormDialog;

