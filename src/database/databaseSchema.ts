import { serial, text, pgTable } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    title: text('title'),
    content: text('content'),
});

export const databaseSchema = {
    users,
};

export { users };
