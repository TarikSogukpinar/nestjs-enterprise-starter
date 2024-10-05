import { Injectable } from "@nestjs/common";
import { databaseSchema } from "src/database/databaseSchema";
import { DrizzleService } from "src/database/drizzle.service";

@Injectable()
export class AuthService {
    constructor(private readonly drizzleService: DrizzleService) { }

    async getALlUsers() {
        return await this.drizzleService.db.select().from(databaseSchema.users).execute();
    }
}