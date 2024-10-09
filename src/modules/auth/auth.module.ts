import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { HashingModule } from 'src/shared/hashing/hashing.module';
import { TokenModule } from 'src/shared/token/token.module';

@Module({
    imports: [UserModule, HashingModule, TokenModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
