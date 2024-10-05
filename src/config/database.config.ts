export interface IDatabaseConfig {
    uri: string;
}

export const databaseConfig = (): IDatabaseConfig => ({
    uri: process.env.POSTGRESQL_URI,
});
