import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HashingService } from 'src/shared/hashing/hashing.service';
import { RegisterResDto, RegisterReqDto, LoginReqDto, LoginResDto } from './dto';
import { BadRequestException } from 'src/exceptions/bad-request.exception';
import { TokenService } from 'src/shared/token/token.service';
import { UnauthorizedException } from 'src/exceptions';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
        private readonly hashingService: HashingService,
        private readonly tokenService: TokenService) { }

    async registerService(registerReqDto: RegisterReqDto): Promise<RegisterResDto> {

        const { name, email, password } = registerReqDto;

        const existingUser = await this.userService.findByEmail(email);


        if (existingUser) {
            throw BadRequestException.RESOURCE_ALREADY_EXISTS(`User with email ${email} already exists`);
        }

        const hashedPassword = await this.hashingService.hashPassword(password);


        const newUser = await this.userService.createUser({
            name,
            email,
            password: hashedPassword,
        });

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            message: 'User registered successfully',
        };

    }

    async loginService(loginReqDto: LoginReqDto): Promise<LoginResDto> {

        const { email, password } = loginReqDto;

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw BadRequestException.RESOURCE_NOT_FOUND();
        }

        const isPasswordValid = await this.hashingService.comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw UnauthorizedException.UNAUTHORIZED_ACCESS('Invalid credentials');
        }

        const payload: JwtPayload = {
            id: user.id,
            user: user.name,
            email: user.email,
        };


        const accessToken = await this.tokenService.createAccessToken(payload);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: accessToken,
            message: 'User logged in successfully',
        }


    }
}