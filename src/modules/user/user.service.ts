import { Injectable, Inject } from '@nestjs/common';
import * as schema from 'src/drizzle/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { users } from '../../drizzle/schema';

@Injectable()
export class UserService {
    constructor(@Inject('DRIZZLE_ORM') private conn: PostgresJsDatabase<typeof schema>) { }

    async findByEmail(email: string): Promise<any | null> {
        const result = await this.conn
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .execute();

        return result[0] || null;
    }

    async findByPassword(password: string): Promise<any | null> {
        const result = await this.conn
            .select()
            .from(users)
            .where(eq(users.password, password))
            .limit(1)
            .execute();

        return result[0] || null;
    }

    async createUser(newUser: any): Promise<any> {
        const [user] = await this.conn
            .insert(users)
            .values(newUser)
            .returning()
            .execute();

        return user;
    }
}