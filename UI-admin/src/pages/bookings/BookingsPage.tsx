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
import { Search, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { Booking } from '@/types';

const BookingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<'all' | 'pending' | 'paid' | 'failed' | 'refunded'>('all');

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john.doe@student.edu',
      roomId: '101',
      roomNumber: '101',
      buildingName: 'Block A',
      checkInDate: '2024-07-01',
      checkOutDate: '2024-08-31',
      totalAmount: 500,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      createdAt: '2024-06-15',
    },
    {
      id: '2',
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@student.edu',
      roomId: '205',
      roomNumber: '205',
      buildingName: 'Block B',
      checkInDate: '2024-09-01',
      checkOutDate: '2024-12-31',
      totalAmount: 800,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      createdAt: '2024-06-20',
    },
  ]);

  const handleApproveBooking = (bookingId: string) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, bookingStatus: 'confirmed', paymentStatus: 'paid' } : b
    ));
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b
    ));
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.roomNumber.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || booking.bookingStatus === selectedStatus;
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || booking.paymentStatus === selectedPaymentStatus;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Booking Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage and track all room bookings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{bookings.filter(b => b.bookingStatus === 'pending').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.bookingStatus === 'confirmed').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
            <p className="text-2xl font-bold text-blue-600">
              ${bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Check-out</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{booking.userName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.userEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">{booking.roomNumber}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{booking.buildingName}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{booking.checkInDate}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{booking.checkOutDate}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">${booking.totalAmount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        booking.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.bookingStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                        booking.bookingStatus === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {booking.bookingStatus === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveBooking(booking.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectBooking(booking.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {booking.bookingStatus === 'confirmed' && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsPage;
