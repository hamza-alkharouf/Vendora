import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActiveUser } from '../auth/interfaces/active-user.interface';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Headers('x-store-id') storeId: string,
    @Body() data: { title: Record<string, string>; description?: Record<string, string>; price: number },
  ) {
    return this.productsService.create(storeId, data);
  }

  @Get()
  async findAll(@Headers('x-store-id') storeId?: string) {
    return this.productsService.findAll(storeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Headers('x-store-id') storeId: string,
    @Body()
    data: Partial<{ title: Record<string, string>; description: Record<string, string>; price: number }>,
  ) {
    return this.productsService.update(id, storeId, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @Headers('x-store-id') storeId: string,
  ) {
    return this.productsService.remove(id, storeId);
  }
}
