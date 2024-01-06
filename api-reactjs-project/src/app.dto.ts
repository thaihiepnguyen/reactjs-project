export class TBaseDto<T> {
  data?: T;
  message?: string;
  statusCode?: number;
  error?: string;
}
