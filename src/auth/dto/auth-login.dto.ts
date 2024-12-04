import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({
    description: 'Client valid email address',
    example: 'johndoe@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Client valid password',
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;
}
