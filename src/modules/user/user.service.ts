import { Injectable, Inject } from '@nestjs/common';
import * as schema from 'src/drizzle/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
    constructor(@Inject('DRIZZLE_ORM') private db: PostgresJsDatabase<typeof schema>) { }

    async findAll() {
        return this.db.query.users.findMany();
    }

    async findById(id: number) {
        return this.db.query.users.findFirst({
            where: eq(schema.users.id, id)
        });
    }
}