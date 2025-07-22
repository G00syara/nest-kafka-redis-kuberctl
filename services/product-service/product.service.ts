import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { RedisService } from '@nestjs-modules/ioredis';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private redisService: RedisService,
  ) {}

  async createProduct(productData: { name: string; price: number }): Promise<Product> {
    const product = this.productRepository.create(productData);
    await this.productRepository.save(product);
    await this.redisService.getClient().set(`product:${product.id}`, JSON.stringify(product));
    return product;
  }

  async getProduct(id: string): Promise<Product> {
    const cachedProduct = await this.redisService.getClient().get(`product:${id}`);
    if (cachedProduct) {
      return JSON.parse(cachedProduct);
    }
    const product = await this.productRepository.findOne({ where: { id } });
    if (product) {
      await this.redisService.getClient().set(`product:${id}`, JSON.stringify(product));
    }
    return product;
  }
}