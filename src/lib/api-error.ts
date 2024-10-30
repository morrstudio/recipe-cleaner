// src/lib/api-error.ts

export class APIError extends Error {
    constructor(
      public statusCode: number,
      message: string,
      public validationErrors?: Record<string, string[]>
    ) {
      super(message);
      this.name = 'APIError';
    }
  }
  
  export function handleAPIError(error: unknown) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
        statusCode: error.statusCode,
        validationErrors: error.validationErrors
      };
    }
  
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
      statusCode: 500
    };
  }