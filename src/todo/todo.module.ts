import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { DatabaseModule } from 'src/database/database.module';
import { todoProviders } from './providers/todo.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [TodoController],
  providers: [...todoProviders, TodoService],
})
export class TodoModule {}
