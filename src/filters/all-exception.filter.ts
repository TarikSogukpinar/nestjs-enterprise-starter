import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);


    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }


    catch(exception: any, host: ArgumentsHost): void {

        this.logger.error(exception);


        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const request = ctx.getRequest();

        const responseBody = {
            error: exception.code,
            message: exception.message,
            description: exception.description,
            timestamp: new Date().toISOString(),
            traceId: request.id,
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
