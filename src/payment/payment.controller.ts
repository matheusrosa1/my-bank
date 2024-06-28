import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from 'multer-config';

@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(
    @Param('id') paymentId: number,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    const result = await this.paymentService.uploadImagem(file, paymentId);
    if (result.imageUrl) {
      return { success: true, message: result.message, url: result.imageUrl };
    } else {
      return { success: false, message: result.message };
    }
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
