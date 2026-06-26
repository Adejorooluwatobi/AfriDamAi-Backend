import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      }
    } else if (exception instanceof SyntaxError) {
      // Handle JSON parsing errors specifically
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid JSON in request body';
      error = 'Bad Request';
      this.logger.error(
        `[JSON_SYNTAX_ERROR] ${request.method} ${request.url} - ${(exception as Error).message}`
      );
    }

    // Log error details (but not sensitive information)
    this.logger.error(
      `[EXCEPTION] ${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception)
    );

    // 🛡️ DIAGNOSTIC MODE: Temporarily reveal error details to debug 500 error
    /*
    if (status === HttpStatus.INTERNAL_SERVER_ERROR && process.env.NODE_ENV === 'production') {
      message = 'Something went wrong';
      error = 'Internal Server Error';
    }
    */
    
    // Instead, log the actual error message to the response for diagnostic purposes
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
       message = exception instanceof Error ? exception.message : 'Unknown Error';
    }

    response.status(status).json({
      succeeded: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    });
  }
}