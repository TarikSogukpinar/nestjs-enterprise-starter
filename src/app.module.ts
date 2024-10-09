import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/index';
import { SwaggerModule } from './shared/swagger/swagger.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { NestDrizzleModule } from './drizzle/drizzle.module';
import * as schema from './drizzle/schema';
import { ValidationError } from 'class-validator';
import { AllExceptionsFilter, BadRequestExceptionFilter, ForbiddenExceptionFilter, NotFoundExceptionFilter, UnauthorizedExceptionFilter, ValidationExceptionFilter } from './filters';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GracefulShutdownModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        gracefulShutdownTimeout: configService.get<number>('GRACEFUL_SHUTDOWN_TIMEOUT') || 5000,
        keepNodeProcessAlive: configService.get<boolean>('KEEP_NODE_PROCESS_ALIVE') || false,
      }),
      inject: [ConfigService],
    }),
    PrometheusModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        defaultMetrics: {
          enabled: configService.get<boolean>('PROMETHEUS_DEFAULT_METRICS_ENABLED') || true,
        },
        path: configService.get<string>('PROMETHEUS_PATH') || '/metrics',
        defaultLabels: {
          app: configService.get<string>('PROMETHEUS_DEFAULT_LABELS_APP') || 'default-app-name',
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL') || 60,
          limit: configService.get<number>('THROTTLE_LIMIT') || 10,
        },
      ],
      inject: [ConfigService],
    }),
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgres-js',
          url: process.env.POSTGRESQL_URI,
          options: { schema },
          migrationOptions: { migrationsFolder: './migration' },

        };
      },
    }),
    SwaggerModule,
    AuthModule,

  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          exceptionFactory: (errors: ValidationError[]) => {
            return errors[0];
          },
        }),
    },],
})
export class AppModule { }
