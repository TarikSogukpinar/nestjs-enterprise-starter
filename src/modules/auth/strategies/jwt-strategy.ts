import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as schema from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('DRIZZLE_ORM') private readonly drizzleService: PostgresJsDatabase,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
            expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        });
    }

    async validate(payload: { id: number }) {
        try {
            const user = await this.drizzleService
                .select()
                .from(schema.users)
                .where(eq(schema.users.id, payload.id))
                .limit(1);


            if (!user.length) {
                throw new UnauthorizedException();
            }

            const { password, ...result } = user[0];
            return result;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
