package com.saraprojects.product_api.specification;

import com.saraprojects.product_api.enums.PromotionStatus;
import com.saraprojects.product_api.enums.PromotionTargetType;
import com.saraprojects.product_api.model.Promotion;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PromotionSpecification {

    public static Specification<Promotion> filter(
            PromotionTargetType targetType,
            LocalDate startDate,
            LocalDate endDate,
            PromotionStatus status
    ) {
        return (root, query, cb) -> {

            var predicates = cb.conjunction();

            if (targetType != null) {
                predicates = cb.and(predicates,
                        cb.equal(root.get("targetType"), targetType));
            }

            if (startDate != null) {
                LocalDateTime dayStart = startDate.atStartOfDay();
                LocalDateTime dayEnd = startDate.atTime(23, 59, 59);
                predicates = cb.and(predicates,
                        cb.between(root.get("startDate"), dayStart, dayEnd));
            }

            if (endDate != null) {
                LocalDateTime dayStart = endDate.atStartOfDay();
                LocalDateTime dayEnd = endDate.atTime(23, 59, 59);
                predicates = cb.and(predicates,
                        cb.between(root.get("endDate"), dayStart, dayEnd));
            }

            if (status != null) {
                predicates = cb.and(predicates,
                        cb.equal(root.get("status"), status));
            }

            return predicates;
        };
    }
}
