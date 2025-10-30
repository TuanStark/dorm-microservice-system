export interface ResponseData<T> {
  data: T | T[];
  statusCode: number;
  message: string;
}
