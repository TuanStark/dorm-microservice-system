import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash2, Home, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Room } from '@/types';

const RoomsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      roomNumber: '101',
      type: 'shared',
      capacity: 4,
      price: 200,
      status: 'available',
      buildingId: '1',
      buildingName: 'Block A',
      images: [
        'https://images.unsplash.com/photo-1505692794403-34d4982a86e0?q=80&w=800',
      ],
      amenities: ['WiFi', 'AC', 'TV']
    },
    {
      id: '2',
      roomNumber: '205',
      type: 'single',
      capacity: 1,
      price: 400,
      status: 'booked',
      buildingId: '2',
      buildingName: 'Block B',
      images: [
        'https://images.unsplash.com/photo-1560448075-bb4caa6c8be7?q=80&w=800',
      ],
      amenities: ['WiFi', 'AC', 'Private Bathroom']
    },
  ]);

  const filteredRooms = rooms.filter(room =>
    room.roomNumber.includes(searchTerm) ||
    room.buildingName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa phòng này?')) {
      setRooms(rooms.filter(r => r.id !== roomId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý phòng</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý phòng ký túc xá và hình ảnh</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Thêm phòng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="roomNumber">Số phòng</Label>
                <Input id="roomNumber" defaultValue={editingRoom?.roomNumber || ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Giá (USD/tháng)</Label>
                <Input id="price" type="number" defaultValue={editingRoom?.price || 0} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Sức chứa</Label>
                <Input id="capacity" type="number" defaultValue={editingRoom?.capacity || 1} />
              </div>
              <div className="grid gap-2">
                <Label>Hình ảnh (URL)</Label>
                <div className="flex items-center gap-2">
                  <Input placeholder="https://..." />
                  <Button variant="outline">
                    <ImageIcon className="h-4 w-4 mr-2" />Thêm
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                <Button onClick={() => setIsDialogOpen(false)}>Lưu</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm phòng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm theo số phòng hoặc tên tòa nhà..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden cursor-pointer" onClick={() => navigate(`/rooms/${room.id}`)}>
            {room.images && room.images.length > 0 ? (
              <div className="aspect-video w-full overflow-hidden">
                <img src={room.images[0]} alt="room" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video w-full bg-gray-100 flex items-center justify-center text-gray-500">
                Không có ảnh
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Phòng {room.roomNumber}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{room.buildingName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  room.status === 'available' ? 'bg-green-100 text-green-700' :
                  room.status === 'booked' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {room.status === 'available' ? 'Còn trống' : room.status === 'booked' ? 'Đã đặt' : room.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                <p>Loại: {room.type}</p>
                <p>Giá: ${room.price}/tháng</p>
                <p>Sức chứa: {room.capacity}</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditingRoom(room); setIsDialogOpen(true); }}>
                  <Edit className="h-4 w-4 mr-1" /> Sửa
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;


