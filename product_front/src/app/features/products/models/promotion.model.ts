export interface Promotion {
  id?: number;
  targetType: 'PRODUCT' | 'CATEGORY';
  targetName: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'FINISHED';
}

export interface PagedPromotionResponse {
  promotions: Promotion[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  sortBy: string;
}