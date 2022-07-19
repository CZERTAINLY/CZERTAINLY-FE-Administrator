
export interface PagedDataDTO<T> {
   page: number;
   size: number;
   totalPages: number;
   items: T[];
}
