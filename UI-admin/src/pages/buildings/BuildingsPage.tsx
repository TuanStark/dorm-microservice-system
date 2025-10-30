import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash2, Home } from 'lucide-react';
import { Building } from '@/types';
import { buildingSchema, BuildingFormData } from '@/lib/validations';
import { useFormValidation } from '@/hooks/useFormValidation';

const BuildingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [formData, setFormData] = useState<BuildingFormData>({
    name: '',
    address: '',
    totalRooms: 0,
    description: '',
  });
  
  const { errors, validate, clearErrors, clearFieldError } = useFormValidation(buildingSchema);
  // Trang Buildings chỉ quản lý tòa nhà

  const [buildings, setBuildings] = useState<Building[]>([
    {
      id: '1',
      name: 'Block A',
      address: '123 University St',
      totalRooms: 50,
      availableRooms: 10,
      images: [],
      description: 'Modern dormitory with excellent facilities'
    },
    {
      id: '2',
      name: 'Block B',
      address: '456 Campus Ave',
      totalRooms: 75,
      availableRooms: 25,
      images: [],
      description: 'Comfortable living spaces'
    },
  ]);

  // Danh sách phòng chuyển sang trang Rooms

  const handleDeleteBuilding = (buildingId: string) => {
    if (window.confirm('Are you sure you want to delete this building?')) {
      setBuildings(buildings.filter(b => b.id !== buildingId));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      clearFieldError(name);
    }
  };

  const handleEditBuilding = (building: Building) => {
    setEditingBuilding(building);
    setFormData({
      name: building.name,
      address: building.address,
      totalRooms: building.totalRooms,
      description: building.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate(formData)) return;
    
    if (editingBuilding) {
      // Update existing building
      setBuildings(buildings.map(b => 
        b.id === editingBuilding.id 
          ? { ...b, ...formData, availableRooms: b.availableRooms }
          : b
      ));
    } else {
      // Add new building
      const newBuilding: Building = {
        id: Date.now().toString(),
        ...formData,
        availableRooms: formData.totalRooms,
        images: [],
      };
      setBuildings([...buildings, newBuilding]);
    }
    
    // Reset form and close dialog
    setFormData({ name: '', address: '', totalRooms: 0, description: '' });
    setEditingBuilding(null);
    setIsDialogOpen(false);
    clearErrors();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingBuilding(null);
    setFormData({ name: '', address: '', totalRooms: 0, description: '' });
    clearErrors();
  };

  // Quản lý phòng ở trang Rooms

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý tòa nhà & phòng</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý tòa nhà và phòng ký túc xá
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Thêm tòa nhà
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingBuilding ? 'Chỉnh sửa tòa nhà' : 'Thêm tòa nhà mới'}</DialogTitle>
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
              <div className="grid gap-2">
                <Label htmlFor="totalRooms">Tổng số phòng</Label>
                <Input 
                  id="totalRooms" 
                  name="totalRooms"
                  type="number" 
                  value={formData.totalRooms}
                  onChange={handleInputChange}
                  className={errors.totalRooms ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.totalRooms && (
                  <p className="text-sm text-red-600">{errors.totalRooms}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <textarea
                  id="description"
                  name="description"
                  className={`min-h-[80px] px-3 py-2 rounded-md border border-input bg-background ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={formData.description}
                  onChange={handleInputChange}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>Hủy</Button>
                <Button type="submit">Lưu</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng tòa nhà</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{buildings.length}</p>
              </div>
              <Home className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        {/* Thống kê phòng được hiển thị ở trang Rooms */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm tòa nhà</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tên hoặc địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredBuildings.map((building) => (
          <Card key={building.id}>
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
                    onClick={() => handleEditBuilding(building)}
                    title="Chỉnh sửa tòa nhà"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBuilding(building.id)}
                    title="Xóa tòa nhà"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Rooms</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{building.totalRooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                  <p className="text-lg font-bold text-green-600">{building.availableRooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Occupied</p>
                  <p className="text-lg font-bold text-blue-600">
                    {building.totalRooms - building.availableRooms}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate</p>
                  <p className="text-lg font-bold text-purple-600">
                    {((building.totalRooms - building.availableRooms) / building.totalRooms * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              {building.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{building.description}</p>
              )}
              {/* Thư viện ảnh tòa nhà */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(building.images && building.images.length > 0 ? building.images : [
                  'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=800',
                  'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800',
                ]).map((img, idx) => (
                  <div key={idx} className="aspect-video overflow-hidden rounded-lg border">
                    <img src={img} alt="building" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BuildingsPage;
