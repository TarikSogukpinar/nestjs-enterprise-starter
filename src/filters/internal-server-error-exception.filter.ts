// Importing required modules and classes from NestJS
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { InternalServerErrorException } from '../exceptions/internal-server-error.exception';


@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(InternalServerErrorException.name);


  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}


  catch(exception: InternalServerErrorException, host: ArgumentsHost): void {

    this.logger.error(exception);


    const { httpAdapter } = this.httpAdapterHost;


    const ctx = host.switchToHttp();

   
    const httpStatus = exception.getStatus();


    const request = ctx.getRequest();

   
    exception.setTraceId(request.id);


    const responseBody = exception.generateHttpResponseBody();


    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
