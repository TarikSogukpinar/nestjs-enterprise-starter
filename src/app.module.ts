import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/index';
import { SwaggerModule } from './modules/core/swagger/swagger.module';

@Module({
  imports: [
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
