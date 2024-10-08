import { Inject, Injectable } from '@nestjs/common';
import * as schema from '../../drizzle/schema'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

@Injectable()
export class AuthService {
    constructor(@Inject('DRIZZLE_ORM') private conn: PostgresJsDatabase<typeof schema>) { }

    async getALlUsers() {
        return this.conn.query.users.findMany();
    }
}