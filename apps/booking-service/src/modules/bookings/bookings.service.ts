import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from '@prisma/client';
import { FindAllDto } from 'src/common/global/find-all.dto';
import { BookingKafkaService } from '../kafka/booking-kafka.service';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private kafkaService: BookingKafkaService,
  ) { }

  async create( userId: string, dto: CreateBookingDto,) {
    const booking = await this.prisma.booking.create({
      data: {
        userId: userId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        details: {
          create: dto.details.map((d) => ({
            roomId: d.roomId,
            price: d.price,
            note: d.note,
            time: d.time,
          })),
        },
      },
      include: { details: true },
    });

    await this.kafkaService.publishBookingCreatedEvent({
      bookingId: booking.id,
      userId: booking.userId,
      roomId: booking.details[0]?.roomId || '',
      amount: booking.details.reduce((sum, d) => sum + d.price, 0),
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status,
    });

    return booking;
  }

  async findAll(query: FindAllDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || limitNumber < 1) {
      throw new Error('Page and limit must be greater than 0');
    }

    const take = limitNumber;
    const skip = (pageNumber - 1) * take;

    const searchUpCase = search.charAt(0).toUpperCase() + search.slice(1);
    const where = search
      ? {
        OR: [
          { userId: { contains: searchUpCase } },
          { details: { some: { roomId: { contains: searchUpCase } } } },
        ]
      }
      : {};
    const orderBy = {
      [sortBy]: sortOrder
    };

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: { 
          details: true
        },
      }),
      this.prisma.booking.count({
        where: where,
      })
    ])

    return {
      data: bookings,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { details: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: string, dto: UpdateBookingDto) {
    console.log('Update booking request received:', dto);
    const booking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: dto.status,
        details: {
          update: dto.details?.map((d) => ({
            where: { id: d.roomId },
            data: {
              price: d.price,
              time: d.time,
            },
          })),
        },
      },
      include: { details: true },
    });

    await this.kafkaService.publishBookingCreatedEvent({
      bookingId: booking.id,
      userId: booking.userId,
      roomId: booking.details[0]?.roomId || '',
      amount: booking.details.reduce((sum, d) => sum + d.price, 0),
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status,
    });

    return booking;
  }

  async cancel(id: string) {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELED },
      include: { details: true },
    });

    await this.kafkaService.publishBookingCanceledEvent({
      bookingId: booking.id,
      userId: booking.userId,
      reason: 'Manual cancellation',
      canceledAt: new Date(),
    });

    return booking;
  }

  async getBookingByUserId(userId: string) {
    const booking = await this.prisma.booking.findMany({
      where: { userId },
      include: { details: true },
    });
    return booking;
  }

  async getBookingByRoomId(roomId: string) {
    const booking = await this.prisma.booking.findMany({
      where: { details: { some: { roomId } } },
      include: { details: true },
    });
    return booking;
  }

  async delete(id: string) {
    const booking = await this.prisma.booking.delete({
      where: { id },
    });
    return booking;
  }
}
