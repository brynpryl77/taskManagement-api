import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private _currentUserId: number = 0;

  public set currentUserId(user: number) {
    this._currentUserId = user;
  }

  constructor(
    @Inject('TODO_REPOSITORY')
    private todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    const todo = new Todo();
    todo.title = createTodoDto.title;
    todo.completed = false;
    todo.userId = this._currentUserId;

    return this.todoRepository.save(todo);
  }

  async findAllAdmin(): Promise<Todo[]> {
    return this.todoRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { userId: this._currentUserId },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return this.todoRepository.findOne({ id, userId: this._currentUserId });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    let todo = await this.todoRepository.findOne({
      id,
      userId: this._currentUserId,
    });
    if (!todo) {
      throw new HttpException('Resource not found.', HttpStatus.NOT_FOUND);
    }

    if (updateTodoDto.title === '') {
      throw new HttpException(
        { message: ['title cannot be empty'] },
        HttpStatus.BAD_REQUEST,
      );
    }

    todo.completed = updateTodoDto.completed ?? todo.completed;
    todo.title = updateTodoDto.title ?? todo.title;

    await this.todoRepository.save(todo);

    return todo;
  }

  async remove(id: number) {
    const todo = await this.todoRepository.findOne({
      id,
      userId: this._currentUserId,
    });
    if (!todo) {
      throw new HttpException('Resource not found.', HttpStatus.NOT_FOUND);
    }

    await this.todoRepository.remove(todo);

    return { ...todo, id };
  }
}
