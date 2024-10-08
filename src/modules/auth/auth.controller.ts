import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { RegisterUserDto } from "./dto";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 200, description: 'User registered successfully' })
    async register(@Body() registerUserDto: RegisterUserDto) {
        const result = await this.authService.registerUserService(registerUserDto);

        return {
            message: 'Kullanıcı başarıyla kaydedildi!',
            result, // Sonuç döndürülüyor (UUID, email, role)
        };
    }

    // @Post('login')
    // async login() {
    //     return await this.authService.getALlUsers();
    // }
}