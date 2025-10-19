// src/scripts/test-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test creating a notification preference
    const preference = await prisma.notificationPreferences.create({
      data: {
        userId: 'test-user-123',
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        bookingNotifications: true,
        paymentNotifications: true,
        roomNotifications: true,
        systemNotifications: true,
      },
    });
    console.log('✅ Created notification preference:', preference.id);
    
    // Test creating a notification
    const notification = await prisma.notification.create({
      data: {
        userId: 'test-user-123',
        type: 'WELCOME',
        title: 'Test Notification',
        content: 'This is a test notification',
        data: { test: true },
        status: 'PENDING',
        channels: {
          create: [
            {
              channel: 'EMAIL',
              recipient: 'test@example.com',
              subject: 'Test Subject',
              status: 'PENDING',
            },
            {
              channel: 'IN_APP',
              recipient: 'test-user-123',
              status: 'PENDING',
            },
          ],
        },
      },
      include: {
        channels: true,
      },
    });
    console.log('✅ Created notification:', notification.id);
    console.log('📧 Channels created:', notification.channels.length);
    
    // Test querying
    const notifications = await prisma.notification.findMany({
      where: { userId: 'test-user-123' },
      include: { channels: true },
    });
    console.log('✅ Found notifications:', notifications.length);
    
    // Cleanup
    await prisma.notification.deleteMany({
      where: { userId: 'test-user-123' },
    });
    await prisma.notificationPreferences.deleteMany({
      where: { userId: 'test-user-123' },
    });
    console.log('🧹 Cleaned up test data');
    
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
