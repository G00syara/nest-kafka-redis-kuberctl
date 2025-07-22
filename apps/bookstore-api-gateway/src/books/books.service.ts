import { Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from '@app/contracts/books/create-book.dto';
import { UpdateBookDto } from '@app/contracts/books/update-book.dto';
import { ClientProxy } from '@nestjs/microservices';
import { BOOKS_PATTERNS } from '@app/contracts/books/books.patterns';
import { BookDto as InsideBookDto } from './dto/book.dto';
import { BookDto } from '@app/contracts/books/book.dto';
import { map } from 'rxjs';
import { BOOKS_CLIENT } from './constants';

@Injectable()
export class BooksService {
  constructor(@Inject(BOOKS_CLIENT) private booksClient: ClientProxy) {}

  private mapBookDto(bookDto: InsideBookDto): BookDto {
    return {
      id: bookDto.id,
      title: bookDto.title,
    };
  }

  create(createBookDto: CreateBookDto) {
    return this.booksClient
      .send<BookDto, CreateBookDto>(BOOKS_PATTERNS.CREATE, createBookDto)
      .pipe(map(this.mapBookDto));
  }

  findAll() {
    return this.booksClient.send<BookDto>(BOOKS_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number) {
    return this.booksClient.send<BookDto>(BOOKS_PATTERNS.FIND_ONE, { id });
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return this.booksClient.send<BookDto, UpdateBookDto>(
      BOOKS_PATTERNS.UPDATE,
      {
        ...updateBookDto,
        id,
      },
    );
  }

  remove(id: number) {
    return this.booksClient.send<BookDto>(BOOKS_PATTERNS.REMOVE, { id });
  }
}
