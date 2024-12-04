import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'Client RSA Pin',
    example: 'rsa-1u2y3u',
  })
  @IsNotEmpty()
  @IsString()
  rsaPin: string;

  @ApiProperty({
    description: 'Client Surname',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({
    description: 'Client valid email address',
    example: 'johndoe@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Client valid password',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
  password: string;
}
