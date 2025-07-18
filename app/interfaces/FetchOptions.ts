export interface FetchOptions {
  method: string;
  headers: { [key: string]: string };
  body?: string;
}