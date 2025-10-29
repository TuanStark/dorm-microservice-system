import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, User, Settings as SettingsIcon, CreditCard, Bell } from 'lucide-react';
import { AdminProfile, SystemSettings } from '@/types';

const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfile>({
    id: '1',
    name: 'Admin User',
    email: 'admin@dormitory.com',
    role: 'admin',
  });

  const [settings, setSettings] = useState<SystemSettings>({
    dormCapacityLimit: 500,
    paymentGatewayKeys: {
      momo: 'your-momo-key-here',
      vnpay: 'your-vnpay-key-here',
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
    },
    maintenanceMode: false,
  });

  const [profileFormData, setProfileFormData] = useState({
    name: profile.name,
    email: profile.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    console.log('Updating profile...', profileFormData);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password update
    if (profileFormData.newPassword !== profileFormData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Updating password...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cài đặt</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý hồ sơ và cấu hình hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <CardTitle>Thông tin hồ sơ</CardTitle>
              </div>
              <CardDescription>
                Cập nhật thông tin tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    value={profileFormData.name}
                    onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Địa chỉ Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileFormData.email}
                    onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>
                Cập nhật mật khẩu để tăng bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={profileFormData.currentPassword}
                    onChange={(e) => setProfileFormData({ ...profileFormData, currentPassword: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={profileFormData.newPassword}
                    onChange={(e) => setProfileFormData({ ...profileFormData, newPassword: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileFormData.confirmPassword}
                    onChange={(e) => setProfileFormData({ ...profileFormData, confirmPassword: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Cập nhật mật khẩu
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* System Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <CardTitle>Cấu hình hệ thống</CardTitle>
              </div>
              <CardDescription>
                Cấu hình các thiết lập chung của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="capacity">Giới hạn sức chứa ký túc xá</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={settings.dormCapacityLimit}
                  onChange={(e) => setSettings({ ...settings, dormCapacityLimit: parseInt(e.target.value) })}
                />
              </div>
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Lưu cấu hình
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <CardTitle>Thông báo</CardTitle>
              </div>
              <CardDescription>
                Cấu hình tùy chọn thông báo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo qua Email</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Nhận cập nhật qua email
                  </p>
                </div>
                <Switch
                  checked={settings.notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notificationSettings: {
                        ...settings.notificationSettings,
                        emailNotifications: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo SMS</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Nhận cập nhật qua SMS
                  </p>
                </div>
                <Switch
                  checked={settings.notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notificationSettings: {
                        ...settings.notificationSettings,
                        smsNotifications: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Chế độ bảo trì</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bật chế độ bảo trì
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <CardTitle>Cổng thanh toán</CardTitle>
              </div>
              <CardDescription>
                Quản lý khóa tích hợp cổng thanh toán
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="momoKey">Khóa API MOMO</Label>
                <Input
                  id="momoKey"
                  type="password"
                  value={settings.paymentGatewayKeys.momo}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paymentGatewayKeys: {
                        ...settings.paymentGatewayKeys,
                        momo: e.target.value,
                      },
                    })
                  }
                  placeholder="Nhập khóa MOMO"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vnpayKey">Khóa API VNPay</Label>
                <Input
                  id="vnpayKey"
                  type="password"
                  value={settings.paymentGatewayKeys.vnpay}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paymentGatewayKeys: {
                        ...settings.paymentGatewayKeys,
                        vnpay: e.target.value,
                      },
                    })
                  }
                  placeholder="Nhập khóa VNPay"
                />
              </div>
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Lưu khóa
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
