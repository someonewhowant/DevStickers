import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { UpdateStickerDto } from './dto/update-sticker.dto';
import { QueryStickerDto } from './dto/query-sticker.dto';

@Injectable()
export class StickersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryStickerDto) {
    const { page, limit, category, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (search) {
      where.name = { contains: search };
    }

    const [data, total] = await Promise.all([
      this.prisma.sticker.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sticker.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const sticker = await this.prisma.sticker.findUnique({
      where: { id },
    });
    if (!sticker) {
      throw new NotFoundException('Sticker not found');
    }
    return sticker;
  }

  async create(createStickerDto: CreateStickerDto) {
    return this.prisma.sticker.create({
      data: createStickerDto,
    });
  }

  async update(id: string, updateStickerDto: UpdateStickerDto) {
    try {
      return await this.prisma.sticker.update({
        where: { id },
        data: updateStickerDto,
      });
    } catch (error) {
      throw new NotFoundException('Sticker not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.sticker.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      throw new NotFoundException('Sticker not found');
    }
  }
}
