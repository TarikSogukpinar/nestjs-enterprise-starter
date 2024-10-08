import { Inject, Injectable } from '@nestjs/common';
import * as schema from '../../drizzle/schema'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
// import { User } from 'src/drizzle/schema/users';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(@Inject('DRIZZLE_ORM') private conn: PostgresJsDatabase<typeof schema>, private readonly userService: UserService) { }

    async registerUserService(registerUserDto: any): Promise<any> {
        try {
            const { name, email, password } = registerUserDto;

            // E-posta ile kullanıcıyı bul
            const existingUser = await this.userService.findByEmail(email);

            if (existingUser) {
                return null
            }

            // Şifreyi hashle
            // const hashedPassword = await this.hashingService.hashPassword(password);

            // Yeni kullanıcı oluştur
            const newUser = await this.userService.createUser({
                name,
                email,
                password,
                role: 'USER', // Rol belirtin
            });

            return {
                uuid: newUser.id,
                email: newUser.email,
                role: newUser.role,
            };
        } catch (error) {
            console.error(error);
            // throw new InternalServerErrorException('Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
        }
    }

    async loginService() {
        try {
            return this.conn.query.users.findMany();
        } catch (error) {
            console.log(error)
        }
    }
}