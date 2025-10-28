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
import { Search, Plus, Edit, Trash2, Home, Upload, Image as ImageIcon } from 'lucide-react';
import { Building, Room } from '@/types';

const BuildingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [showRooms, setShowRooms] = useState<string | null>(null);

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
      images: [],
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
      images: [],
      amenities: ['WiFi', 'AC', 'Private Bathroom']
    },
  ]);

  const handleDeleteBuilding = (buildingId: string) => {
    if (window.confirm('Are you sure you want to delete this building?')) {
      setBuildings(buildings.filter(b => b.id !== buildingId));
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.id !== roomId));
    }
  };

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Building & Room Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage dormitory buildings and rooms
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Building
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingBuilding ? 'Edit Building' : 'Add New Building'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Building Name</Label>
                <Input id="name" defaultValue={editingBuilding?.name || ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue={editingBuilding?.address || ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="totalRooms">Total Rooms</Label>
                <Input id="totalRooms" type="number" defaultValue={editingBuilding?.totalRooms || 0} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="min-h-[80px] px-3 py-2 rounded-md border border-input bg-background"
                  defaultValue={editingBuilding?.description || ''}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsDialogOpen(false)}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Buildings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{buildings.length}</p>
              </div>
              <Home className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{rooms.length}</p>
              </div>
              <Home className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Rooms</p>
                <p className="text-2xl font-bold text-orange-600">
                  {rooms.filter(r => r.status === 'available').length}
                </p>
              </div>
              <Home className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Buildings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or address..."
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
                    onClick={() => setShowRooms(showRooms === building.id ? null : building.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBuilding(building.id)}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{building.description}</p>
              )}
              
              {showRooms === building.id && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Rooms</h3>
                    <Button size="sm" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Room
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {rooms.filter(r => r.buildingId === building.id).map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            Room {room.roomNumber}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {room.type} · ${room.price}/month · Capacity: {room.capacity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            room.status === 'available' ? 'bg-green-100 text-green-700' :
                            room.status === 'booked' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {room.status}
                          </span>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BuildingsPage;
