import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, DollarSign, Eye, Clock, CheckCircle } from 'lucide-react';
import { Payment } from '@/types';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const PaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'MOMO' | 'VNPay' | 'Bank Transfer' | 'Cash'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed' | 'failed' | 'refunded'>('all');

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      bookingId: '1',
      userId: '1',
      userName: 'John Doe',
      amount: 500,
      method: 'VNPay',
      status: 'completed',
      createdAt: '2024-06-15',
      processedAt: '2024-06-15',
    },
    {
      id: '2',
      bookingId: '2',
      userId: '2',
      userName: 'Jane Smith',
      amount: 800,
      method: 'MOMO',
      status: 'pending',
      createdAt: '2024-06-20',
    },
  ]);

  const monthlyRevenueData = [
    { month: 'Jan', amount: 12000 },
    { month: 'Feb', amount: 15000 },
    { month: 'Mar', amount: 14000 },
    { month: 'Apr', amount: 18000 },
    { month: 'May', amount: 16000 },
    { month: 'Jun', amount: 20000 },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.bookingId.includes(searchTerm);
    const matchesMethod = selectedMethod === 'all' || payment.method === selectedMethod;
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý thanh toán</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Theo dõi và quản lý tất cả giao dịch thanh toán
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{payments.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đang chờ</p>
                <p className="text-2xl font-bold text-orange-600">{pendingPayments}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tỉ lệ thành công</p>
                <p className="text-2xl font-bold text-green-600">
                  {((payments.filter(p => p.status === 'completed').length / payments.length) * 100).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Tất cả phương thức</option>
              <option value="MOMO">MOMO</option>
              <option value="VNPay">VNPay</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Đang chờ</option>
              <option value="completed">Hoàn tất</option>
              <option value="failed">Thất bại</option>
              <option value="refunded">Hoàn tiền</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Giao dịch ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold">Mã giao dịch</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Người dùng</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Số tiền</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Phương thức</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Tạo lúc</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{payment.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">{payment.userName}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">${payment.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.method === 'VNPay' ? 'bg-blue-100 text-blue-700' :
                        payment.method === 'MOMO' ? 'bg-pink-100 text-pink-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {payment.method}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        payment.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{payment.createdAt}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
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

export default PaymentsPage;
