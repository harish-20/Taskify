export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
  errors?: string[];
};
