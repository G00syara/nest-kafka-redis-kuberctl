import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('createProduct')
  async createProduct(productData: { name: string; price: number }): Promise<Product> {
    return this.productService.createProduct(productData);
  }

  @MessagePattern('getProduct')
  async getProduct(id: string): Promise<Product> {
    return this.productService.getProduct(id);
  }
}