import { defineConfig } from 'drizzle-kit';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export default defineConfig({
    schema: './src/drizzle/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: configService.get('POSTGRESQL_URI'),
    },
})