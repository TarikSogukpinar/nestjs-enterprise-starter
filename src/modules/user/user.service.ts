import { Injectable, Inject } from '@nestjs/common';
import * as schema from 'src/drizzle/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { users } from '../../drizzle/schema'; // Veritabanı şeması

@Injectable()
export class UserService {
    constructor(@Inject('DRIZZLE_ORM') private conn: PostgresJsDatabase<typeof schema>) { }

    // E-posta ile kullanıcı bulma
    async findByEmail(email: string): Promise<any | null> {
        const result = await this.conn
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .execute();

        return result[0] || null;
    }

    // Yeni kullanıcı oluşturma
    async createUser(newUser: any): Promise<any> {
        const [user] = await this.conn
            .insert(users)
            .values(newUser)
            .returning()
            .execute();

        return user;
    }
}