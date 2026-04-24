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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@UploadedFile() file: Express.Multer.File, @Body() createStickerDto: CreateStickerDto) {
    const imageUrl = file ? `/uploads/${file.filename}` : createStickerDto.imageUrl;
    return this.stickersService.create({ ...createStickerDto, imageUrl });
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  update(
    @Param('id') id: string, 
    @UploadedFile() file: Express.Multer.File, 
    @Body() updateStickerDto: UpdateStickerDto
  ) {
    const data = { ...updateStickerDto };
    if (file) {
      data.imageUrl = `/uploads/${file.filename}`;
    }
    return this.stickersService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.stickersService.remove(id);
  }
}
