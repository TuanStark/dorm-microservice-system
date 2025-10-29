import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const mockRooms = [
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
      'https://images.unsplash.com/photo-1505692794403-34d4982a86e0?q=80&w=1200',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1200',
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
      'https://images.unsplash.com/photo-1560448075-bb4caa6c8be7?q=80&w=1200',
    ],
    amenities: ['WiFi', 'AC', 'Private Bathroom']
  },
];

const RoomDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const room = mockRooms.find((r) => r.id === id);

  if (!room) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
        </Button>
        <Card>
          <CardContent className="py-10 text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy phòng
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Phòng {room.roomNumber}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center">
            <Home className="h-4 w-4 mr-2" /> {room.buildingName}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/rooms')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Danh sách phòng
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {/* Gallery ảnh */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <img src={room.images[0]} alt="room" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="grid grid-rows-2 gap-3">
              {(room.images.slice(1, 3).length ? room.images.slice(1, 3) : room.images).map((img, idx) => (
                <div key={idx} className="aspect-video overflow-hidden rounded-lg border">
                  <img src={img} alt="room-thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin phòng */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chi tiết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex justify-between"><span>Loại phòng:</span><span className="font-medium">{room.type}</span></div>
                <div className="flex justify-between"><span>Giá:</span><span className="font-medium">${room.price}/tháng</span></div>
                <div className="flex justify-between"><span>Sức chứa:</span><span className="font-medium">{room.capacity}</span></div>
                <div className="flex justify-between"><span>Trạng thái:</span><span className={`font-medium ${room.status==='available'?'text-green-600':'text-orange-600'}`}>{room.status === 'available' ? 'Còn trống' : 'Đã đặt'}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiện nghi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((a) => (
                    <span key={a} className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
                      {a}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomDetailPage;


