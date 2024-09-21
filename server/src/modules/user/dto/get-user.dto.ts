import { Exclude } from 'class-transformer';

export class GetUserDto {
  id: number;

  email: string;

  @Exclude()
  password: string;

  name: string;

  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<GetUserDto>) {
    Object.assign(this, partial);
  }
}
