export type PromotionTargetType = 'PRODUCT' | 'CATEGORY';

export interface PromotionCreateRequest {
  targetType: PromotionTargetType;
  productId?: number;
  category?: string;
  discountPercentage: number;
  startDate: string; // ISO LocalDateTime, ex: 2026-08-08T00:00:00
  endDate: string;   // ISO LocalDateTime, ex: 2026-08-15T23:59:59
}