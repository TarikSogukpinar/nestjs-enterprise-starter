import { Body, Controller, Get, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegisterResDto, RegisterReqDto, LoginReqDto } from "./dto";


@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 200, description: 'User registered successfully' })
    async register(@Body(ValidationPipe) registerReqDto: RegisterReqDto): Promise<RegisterResDto> {
        return await this.authService.registerService(registerReqDto);

    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    async login(@Body(ValidationPipe) loginReqDto: LoginReqDto): Promise<any> {
        return await this.authService.loginService(loginReqDto);
    }
}