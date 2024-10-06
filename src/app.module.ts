import { Module } from '@nestjs/common';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { ThrottlerModule, ThrottlerModuleOptions, ThrottlerOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/index';
import { SwaggerModule } from './shared/swagger/swagger.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GracefulShutdownModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        gracefulShutdownTimeout: configService.get<number>('GRACEFUL_SHUTDOWN_TIMEOUT'),
        keepNodeProcessAlive: configService.get<boolean>('KEEP_NODE_PROCESS_ALIVE'),
        cleanup(app, signal) {
          app.close();
          signal ? console.log(`Received signal: ${signal}`) : null;
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: parseInt(configService.get<string>('THROTTLE_TTL', '60'), 10),
          limit: parseInt(configService.get<string>('THROTTLE_LIMIT', '10'), 10),
        },
      ],
      inject: [ConfigService],
    }),
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10),
        user: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    SwaggerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
