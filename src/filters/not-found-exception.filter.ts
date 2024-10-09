import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';


@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NotFoundExceptionFilter.name);


  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }


  catch(exception: any, host: ArgumentsHost): void {

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest();


    const responseBody = {
      error: exception.code,
      message: exception.message,
      description: exception.description,
      traceId: request.id,
    };


    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
