import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as schema from 'src/drizzle/schema';

import { UnauthorizedException } from '../../../exceptions/unauthorized.exception';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { UserService } from 'src/modules/user/user.service';


@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY'),
        });
    }

    // async validate(payload: JwtPayload) {
    //     try {
    //         const user = await this.userService.findById(payload.id);
    //         if (!user) {
    //             throw UnauthorizedException.UNAUTHORIZED_ACCESS();
    //         }

    //         delete user.password;
    //         return user;
    //     } catch (error) {
    //         throw UnauthorizedException.UNAUTHORIZED_ACCESS();
    //     }

    // }
}
