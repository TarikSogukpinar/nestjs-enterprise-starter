import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationError } from 'class-validator';

import { BadRequestException } from '../exceptions/bad-request.exception';


@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ValidationExceptionFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }


    catch(exception: ValidationError, host: ArgumentsHost): void {
        this.logger.verbose(exception);


        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;

        const request = ctx.getRequest();
        // Example of fetching path to attach path inside response object
        // const path = httpAdapter.getRequestUrl(request);

        const errorMsg = exception.constraints || exception.children[0].constraints;


        const err = BadRequestException.VALIDATION_ERROR(Object.values(errorMsg)[0]);

        const responseBody = {
            error: err.code,
            message: err.message,
            timestamp: new Date().toISOString(),
            traceId: request.id,
        };


        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
