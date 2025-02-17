export interface ApiResponse<T> {
  array?: T[];
  data?: T;
  error?: string;
  has_error: boolean;
  total?: number;
}
