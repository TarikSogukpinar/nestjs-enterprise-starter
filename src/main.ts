//Custom Modules, Packages, Configs, etc.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import { SwaggerService } from './shared/swagger/swagger.service';

//pnpm packages
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import helmet from "helmet"
import * as hpp from 'hpp';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';


const logger = new Logger();

async function bootstrap() {

  const nodeEnv = process.env.NODE_ENV;

  const app = await NestFactory.create(AppModule, {
    bufferLogs: nodeEnv === 'production' ? false : true,
    logger: console,
  });

  setupGracefulShutdown({ app });

  const configService = app.get(ConfigService);

  const swaggerService = app.get(SwaggerService);
  swaggerService.setupSwagger(app);

  app.setGlobalPrefix(
    configService.get<string>('API_GLOBAL_PREFIX', { infer: true }),
  );
  app.enableShutdownHooks();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(helmet());
  app.use(hpp());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const PORT = configService.get<number>('PORT', { infer: true });

  await app.listen(PORT);

  logger.log(`Application listening on port ${PORT}`);
}
void bootstrap();
