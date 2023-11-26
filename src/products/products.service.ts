import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly entityManager: EntityManager,
  ) {
  }

  async create(createProductDto: CreateProductDto) {
    const product = new Product(createProductDto);
    await this.entityManager.save(product);
  }

  async findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    return this.productRepository.findOneBy({ id });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });
    if (updateProductDto.title) {
      product.title = updateProductDto.title;
    }
    if (updateProductDto.description) {
      product.description = updateProductDto.description;
    }
    if (updateProductDto.price) {
      product.price = updateProductDto.price;
    }
    await this.entityManager.save(product);
  }

  async remove(id: string) {
    return this.productRepository.delete(id);
  }
}
