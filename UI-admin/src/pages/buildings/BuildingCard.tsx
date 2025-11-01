import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Home } from 'lucide-react';
import { Building } from '@/types';

interface BuildingCardProps {
  building: Building;
  onEdit: (building: Building) => void;
  onDelete: (buildingId: string) => void;
}

const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tòa nhà này?')) {
      onDelete(building.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>{building.name}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">{building.address}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(building)}
              title="Chỉnh sửa tòa nhà"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              title="Xóa tòa nhà"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Thư viện ảnh tòa nhà */}
        {building.images && building.images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {building.images.map((img, idx) => (
              <div key={idx} className="aspect-video overflow-hidden rounded-lg border">
                <img 
                  src={img} 
                  alt={`${building.name} - Ảnh ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">Chưa có ảnh nào</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuildingCard;

