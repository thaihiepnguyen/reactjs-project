export class TBaseDto<T> {
  data: T;
  message?: string;
  status?: number;
}