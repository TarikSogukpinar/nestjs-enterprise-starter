import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionConstants } from './exceptions.constants';
import { IException, IHttpForbiddenExceptionResponse } from './exceptions.interface';

export class ForbiddenException extends HttpException {
    @ApiProperty({
        enum: ExceptionConstants.ForbiddenCodes,
        description: 'You do not have permission to perform this action.',
        example: ExceptionConstants.ForbiddenCodes.MISSING_PERMISSIONS,
    })
    code: number;

    @ApiHideProperty()
    cause: Error;

    @ApiProperty({
        description: 'Message for the exception',
        example: 'You do not have permission to perform this action.',
    })
    message: string;

    @ApiProperty({
        description: 'A description of the error message.',
    })
    description: string;


    @ApiProperty({
        description: 'Timestamp of the exception',
        format: 'date-time',
        example: '2022-12-31T23:59:59.999Z',
    })
    timestamp: string;

    @ApiProperty({
        description: 'Trace ID of the request',
        example: '65b5f773-df95-4ce5-a917-62ee832fcdd0',
    })
    traceId: string;

    constructor(exception: IException) {
        super(exception.message, HttpStatus.FORBIDDEN, {
            cause: exception.cause,
            description: exception.description,
        });

        this.message = exception.message;
        this.cause = exception.cause;
        this.description = exception.description;
        this.code = exception.code;
        this.timestamp = new Date().toISOString();
    }

    setTraceId = (traceId: string) => {
        this.traceId = traceId;
    };


    generateHttpResponseBody = (message?: string): IHttpForbiddenExceptionResponse => {
        return {
            code: this.code,
            message: message || this.message,
            description: this.description,
            timestamp: this.timestamp,
            traceId: this.traceId,
        };
    };

    static FORBIDDEN = (msg?: string) => {
        return new ForbiddenException({
            message: msg || 'Access to this resource is forbidden.',
            code: ExceptionConstants.ForbiddenCodes.FORBIDDEN,
        });
    };

    static MISSING_PERMISSIONS = (msg?: string) => {
        return new ForbiddenException({
            message: msg || 'You do not have permission to perform this action.',
            code: ExceptionConstants.ForbiddenCodes.MISSING_PERMISSIONS,
        });
    };
}
