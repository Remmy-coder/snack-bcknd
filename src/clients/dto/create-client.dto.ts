import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  rsaPin: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20, {
    message: "Password must be between 8 and 20 characters long",
  })
  password: string;
}
