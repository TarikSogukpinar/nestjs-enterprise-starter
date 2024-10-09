import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionConstants } from './exceptions.constants';
import { IException, IHttpBadRequestExceptionResponse } from './exceptions.interface';


export class BadRequestException extends HttpException {
    @ApiProperty({
        enum: ExceptionConstants.BadRequestCodes,
        description: 'A unique code identifying the error.',
        example: ExceptionConstants.BadRequestCodes.VALIDATION_ERROR,
    })
    code: number;
    @ApiHideProperty()
    cause: Error;

    @ApiProperty({
        description: 'Message for the exception',
        example: 'Bad Request',
    })
    message: string;

    @ApiProperty({
        description: 'A description of the error message.',
        example: 'The input provided was invalid',
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
        super(exception.message, HttpStatus.BAD_REQUEST, {
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

    generateHttpResponseBody = (message?: string): IHttpBadRequestExceptionResponse => {
        return {
            code: this.code,
            message: message || this.message,
            description: this.description,
            timestamp: this.timestamp,
            traceId: this.traceId,
        };
    };

    static HTTP_REQUEST_TIMEOUT = () => {
        return new BadRequestException({
            message: 'HTTP Request Timeout',
            code: ExceptionConstants.BadRequestCodes.HTTP_REQUEST_TIMEOUT,
        });
    };

   
    static RESOURCE_ALREADY_EXISTS = (msg?: string) => {
        return new BadRequestException({
            message: msg || 'Resource Already Exists',
            code: ExceptionConstants.BadRequestCodes.RESOURCE_ALREADY_EXISTS,
        });
    };

   
    static RESOURCE_NOT_FOUND = (msg?: string) => {
        return new BadRequestException({
            message: msg || 'Resource Not Found',
            code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
        });
    };

  
    static VALIDATION_ERROR = (msg?: string) => {
        return new BadRequestException({
            message: msg || 'Validation Error',
            code: ExceptionConstants.BadRequestCodes.VALIDATION_ERROR,
        });
    };

  
    static UNEXPECTED = (msg?: string) => {
        return new BadRequestException({
            message: msg || 'Unexpected Error',
            code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
        });
    };

   
    static INVALID_INPUT = (msg?: string) => {
        return new BadRequestException({
            message: msg || 'Invalid Input',
            code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
        });
    };
}
