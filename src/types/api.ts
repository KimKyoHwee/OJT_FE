// types/api.ts
export interface ApiResponse<T> {
    statusCode: string;
    message: string;
    content: T;
  }
  