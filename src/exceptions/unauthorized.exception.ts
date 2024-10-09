import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionConstants } from './exceptions.constants';
import { IException, IHttpUnauthorizedExceptionResponse } from './exceptions.interface';


export class UnauthorizedException extends HttpException {

  @ApiProperty({
    enum: ExceptionConstants.UnauthorizedCodes,
    description: 'A unique code identifying the error.',
    example: ExceptionConstants.UnauthorizedCodes.TOKEN_EXPIRED_ERROR,
  })
  code: number;

  @ApiHideProperty()
  cause: Error;

  @ApiProperty({
    description: 'Message for the exception',
    example: 'The authentication token provided has expired.',
  })
  message: string;


  @ApiProperty({
    description: 'A description of the error message.',
    example:
      'This error message indicates that the authentication token provided with the request has expired, and therefore the server cannot verify the users identity.',
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
    super(exception.message, HttpStatus.UNAUTHORIZED, {
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


  generateHttpResponseBody = (message?: string): IHttpUnauthorizedExceptionResponse => {
    return {
      code: this.code,
      message: message || this.message,
      description: this.description,
      timestamp: this.timestamp,
      traceId: this.traceId,
    };
  };


  static TOKEN_EXPIRED_ERROR = (msg?: string) => {
    return new UnauthorizedException({
      message: msg || 'The authentication token provided has expired.',
      code: ExceptionConstants.UnauthorizedCodes.TOKEN_EXPIRED_ERROR,
    });
  };


  static JSON_WEB_TOKEN_ERROR = (msg?: string) => {
    return new UnauthorizedException({
      message: msg || 'Invalid token specified.',
      code: ExceptionConstants.UnauthorizedCodes.JSON_WEB_TOKEN_ERROR,
    });
  };

  static UNAUTHORIZED_ACCESS = (description?: string) => {
    return new UnauthorizedException({
      message: 'Access to the requested resource is unauthorized.',
      code: ExceptionConstants.UnauthorizedCodes.UNAUTHORIZED_ACCESS,
      description,
    });
  };

  static RESOURCE_NOT_FOUND = (msg?: string) => {
    return new UnauthorizedException({
      message: msg || 'Resource Not Found',
      code: ExceptionConstants.UnauthorizedCodes.RESOURCE_NOT_FOUND,
    });
  };

  static USER_NOT_VERIFIED = (msg?: string) => {
    return new UnauthorizedException({
      message: msg || 'User not verified. Please complete verification process before attempting this action.',
      code: ExceptionConstants.UnauthorizedCodes.USER_NOT_VERIFIED,
    });
  };

  static UNEXPECTED_ERROR = (error: any) => {
    return new UnauthorizedException({
      message: 'An unexpected error occurred while processing the request. Please try again later.',
      code: ExceptionConstants.UnauthorizedCodes.UNEXPECTED_ERROR,
      cause: error,
    });
  };

  static REQUIRED_RE_AUTHENTICATION = (msg?: string) => {
    return new UnauthorizedException({
      message:
        msg ||
        'Your previous login session has been terminated due to a password change or reset. Please log in again with your new password.',
      code: ExceptionConstants.UnauthorizedCodes.REQUIRED_RE_AUTHENTICATION,
    });
  };

  static INVALID_RESET_PASSWORD_TOKEN = (msg?: string) => {
    return new UnauthorizedException({
      message: msg || 'The reset password token provided is invalid. Please request a new reset password token.',
      code: ExceptionConstants.UnauthorizedCodes.INVALID_RESET_PASSWORD_TOKEN,
    });
  };
}
