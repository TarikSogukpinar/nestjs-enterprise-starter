import { Inject, Injectable } from "@nestjs/common";
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { users } from '../../drizzle/schema';
import * as schema from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {

    constructor(@Inject('DRIZZLE_ORM') private drizzleService: PostgresJsDatabase<typeof schema>) { }

    async findByEmail(email: string): Promise<any | null> {
        const result = await this.drizzleService
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .execute();

        return result[0] || null;
    }

    async findByPassword(password: string): Promise<any | null> {
        const result = await this.drizzleService
            .select()
            .from(users)
            .where(eq(users.password, password))
            .limit(1)
            .execute();

        return result[0] || null;
    }

    async createUser(newUser: any): Promise<any> {
        const [user] = await this.drizzleService
            .insert(users)
            .values(newUser)
            .returning()
            .execute();

        return user;
    }
}