import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ForbiddenException } from 'src/exceptions/forbidden.exception';



@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ForbiddenExceptionFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  
    catch(exception: ForbiddenException, host: ArgumentsHost): void {
        this.logger.warn(exception);


        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const httpStatus = exception.getStatus();

 
        const request = ctx.getRequest();
 


        exception.setTraceId(request.id);


        const responseBody = exception.generateHttpResponseBody();

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
