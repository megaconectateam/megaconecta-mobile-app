import { ApiResponse } from './apiResponse';

declare module 'axios' {
  export interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>>;
    get<T = any>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>>;
    delete<T = any>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>>;
    head<T = any>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>>;
    post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>>;
    put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>>;
    patch<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>>;
  }
}
