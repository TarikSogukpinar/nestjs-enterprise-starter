import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { UnauthorizedException } from '../exceptions/unauthorized.exception';


@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(UnauthorizedExceptionFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

   
    catch(exception: UnauthorizedException, host: ArgumentsHost): void {
        this.logger.warn(exception);

 
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const httpStatus = exception.getStatus();

    
        const request = ctx.getRequest();
        // const path = httpAdapter.getRequestUrl(request);


        exception.setTraceId(request.id);

 
        const responseBody = exception.generateHttpResponseBody();

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
