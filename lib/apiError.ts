import { NextResponse } from 'next/server';
import { ApiErrorResponse, ValidationError } from '@/types/api';
import { HttpStatus } from '@/types/http';

export class ApiError extends Error {
  statusCode: number;
  details?: string;
  validationErrors?: ValidationError[];

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: string,
    validationErrors?: ValidationError[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.validationErrors = validationErrors;
    this.name = 'ApiError';
  }
}

export function createErrorResponse(
  error: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: string,
  validationErrors?: ValidationError[]
): NextResponse<ApiErrorResponse> {
  const errorResponse: ApiErrorResponse = {
    error,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    errorResponse.details = details;
  }

  if (validationErrors && validationErrors.length > 0) {
    errorResponse.validationErrors = validationErrors;
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error('API Error:', error);

  // Handle ApiError instances
  if (error instanceof ApiError) {
    return createErrorResponse(
      error.message,
      error.statusCode,
      error.details,
      error.validationErrors
    );
  }

  // Handle Mongoose validation errors
  if (error instanceof Error && error.name === 'ValidationError') {
    const validationErrors: ValidationError[] = [];
    const mongooseError = error as any;

    if (mongooseError.errors) {
      Object.keys(mongooseError.errors).forEach((field) => {
        validationErrors.push({
          field,
          message: mongooseError.errors[field].message,
        });
      });
    }

    return createErrorResponse(
      'Validation failed',
      HttpStatus.UNPROCESSABLE_ENTITY,
      error.message,
      validationErrors
    );
  }

  // Handle Mongoose cast errors
  if (error instanceof Error && error.name === 'CastError') {
    return createErrorResponse(
      'Invalid ID format',
      HttpStatus.BAD_REQUEST,
      error.message
    );
  }

  // Handle duplicate key errors (MongoDB)
  if (error instanceof Error && (error as any).code === 11000) {
    return createErrorResponse(
      'Duplicate entry',
      HttpStatus.CONFLICT,
      'A record with this data already exists'
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    return createErrorResponse(
      error.message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.stack
    );
  }

  // Handle unknown errors
  return createErrorResponse(
    'An unexpected error occurred',
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}

export function createSuccessResponse<T>(
  data: T,
  statusCode: number = HttpStatus.OK,
  message?: string
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: statusCode }
  );
}