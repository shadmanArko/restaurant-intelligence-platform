export interface PaginationRequest {
  readonly page: number;
  readonly pageSize: number;
}

export interface PaginatedResponse<Item> {
  readonly items: readonly Item[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
}
