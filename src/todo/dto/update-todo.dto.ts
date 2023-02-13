import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @Length(3)
  title: string;
  completed: boolean;
}
