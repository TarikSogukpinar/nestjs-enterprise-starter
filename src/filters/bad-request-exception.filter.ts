import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { BadRequestException } from '../exceptions/bad-request.exception';


@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BadRequestException.name);


  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }


  catch(exception: BadRequestException, host: ArgumentsHost): void {

    this.logger.verbose(exception);


    const { httpAdapter } = this.httpAdapterHost;


    const ctx = host.switchToHttp();


    const httpStatus = exception.getStatus();


    const request = ctx.getRequest();


    exception.setTraceId(request.id);


    const responseBody = exception.generateHttpResponseBody();


    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
