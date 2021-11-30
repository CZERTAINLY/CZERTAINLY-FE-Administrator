export interface PagedData<T> {
  page: number;
  size: number;
  totalPages: number;
  items: T[];
}
