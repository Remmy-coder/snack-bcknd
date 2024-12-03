import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: AuthLoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
