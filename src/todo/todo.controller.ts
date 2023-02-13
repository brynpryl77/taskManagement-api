import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    this.todoService.currentUserId = +req.user.userId;
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll(@Request() req) {
    this.todoService.currentUserId = 1; //+req.user.userId;
    return this.todoService.findAll();
  }

  @Get('/all')
  findAllAdmin(@Request() req) {
    if (!req.user.isAdmin) {
      throw new ForbiddenException('Forbidden');
    }
    return this.todoService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    this.todoService.currentUserId = +req.user.userId;
    return this.todoService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ) {
    this.todoService.currentUserId = +req.user.userId;

    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    this.todoService.currentUserId = +req.user.userId;
    return this.todoService.remove(+id);
  }
}
