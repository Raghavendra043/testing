import { HttpHeaders } from '@angular/common/http';

export interface RequestOptions {
  withCredentials?: boolean; // Sets auth and cookies if true
  errorPassThrough?: boolean; // Used in interceptor
  silentRequest?: boolean; // Used in interceptor
  headers?: HttpHeaders; // Http headers
  responseType?: ResponseType;
  cache?: boolean; // Cache or not
  timeout?: number; // Request timeout
  observe?: ObserveType;
}

export type ResponseType = 'blob' | 'json' | 'text';
export type ObserveType = 'body' | 'response';
