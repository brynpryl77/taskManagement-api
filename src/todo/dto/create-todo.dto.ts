import { IsNotEmpty, Length } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @Length(3)
  title: string;
}
