import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionConstants } from './exceptions.constants';
import { IException, IHttpInternalServerErrorExceptionResponse } from './exceptions.interface';

export class InternalServerErrorException extends HttpException {
  @ApiProperty({
    enum: ExceptionConstants.InternalServerErrorCodes,
    description: 'A unique code identifying the error.',
    example: ExceptionConstants.InternalServerErrorCodes.INTERNAL_SERVER_ERROR,
  })
  code: number;

  @ApiHideProperty()
  cause: Error;

  @ApiProperty({
    description: 'Message for the exception',
    example: 'An unexpected error occurred while processing your request.',
  })
  message: string;

  @ApiProperty({
    description: 'A description of the error message.',
    example:
      'The server encountered an unexpected condition that prevented it from fulfilling the request. This could be due to an error in the application code, a misconfiguration in the server, or an issue with the underlying infrastructure. Please try again later or contact the server administrator if the problem persists.',
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
    super(exception.message, HttpStatus.INTERNAL_SERVER_ERROR, {
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


  generateHttpResponseBody = (message?: string): IHttpInternalServerErrorExceptionResponse => {
    return {
      code: this.code,
      message: message || this.message,
      description: this.description,
      timestamp: this.timestamp,
      traceId: this.traceId,
    };
  };


  static INTERNAL_SERVER_ERROR = (error: any) => {
    return new InternalServerErrorException({
      message: 'We are sorry, something went wrong on our end. Please try again later or contact our support team for assistance.',
      code: ExceptionConstants.InternalServerErrorCodes.INTERNAL_SERVER_ERROR,
      cause: error,
    });
  };


  static UNEXPECTED_ERROR = (error: any) => {
    return new InternalServerErrorException({
      message: 'An unexpected error occurred while processing the request.',
      code: ExceptionConstants.InternalServerErrorCodes.UNEXPECTED_ERROR,
      cause: error,
    });
  };
}
