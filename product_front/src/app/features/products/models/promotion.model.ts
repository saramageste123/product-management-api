export interface Promotion {
  id?: number;
  targetType: 'PRODUCT' | 'CATEGORY';
  targetName: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'FINISHED';
}