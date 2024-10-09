import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) { }

    async createAccessToken(user: any) {
        try {
            const payload = {
                id: user.id,
            };
            return this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_SECRET_KEY'),
                expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(
                'An error occurred, please try again later',
            );
        }
    }
}