export interface PageList<T> {
    data: T[];
    total: number;
    page: number;
    lastPage: number;
}