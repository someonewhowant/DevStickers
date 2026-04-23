import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { StickersService } from './stickers.service';
import { CreateStickerDto } from './dto/create-sticker.dto';
import { UpdateStickerDto } from './dto/update-sticker.dto';
import { QueryStickerDto } from './dto/query-sticker.dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('stickers')
export class StickersController {
  constructor(private readonly stickersService: StickersService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: QueryStickerDto) {
    return this.stickersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stickersService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createStickerDto: CreateStickerDto) {
    return this.stickersService.create(createStickerDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateStickerDto: UpdateStickerDto) {
    return this.stickersService.update(id, updateStickerDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.stickersService.remove(id);
  }
}
