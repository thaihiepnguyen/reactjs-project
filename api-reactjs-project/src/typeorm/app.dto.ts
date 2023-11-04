export class TBaseDto<T> {
  data: T;
  message?: string;
  error?: string;
}