// API Error Types
export interface ApiError {
  error: string;
  details?: string;
  statusCode?: number;
  field?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
  validationErrors?: ValidationError[];
  statusCode: number;
  timestamp?: string;
}

// API Success Response
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

// Generic API Response
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;