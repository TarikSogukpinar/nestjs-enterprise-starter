import { Module } from '@nestjs/common';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/index';
import { SwaggerModule } from './shared/swagger/swagger.module';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SwaggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
