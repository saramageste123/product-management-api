package com.saraprojects.product_api.repository;

import com.saraprojects.product_api.enums.ProductCategory;
import com.saraprojects.product_api.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.time.LocalDateTime;

public interface PromotionRepository extends JpaRepository<Promotion, Long>, JpaSpecificationExecutor<Promotion> {
    List<Promotion> findByProductId(Long productId);
    List<Promotion> findByCategory(ProductCategory category);

    @Query("""
        SELECT p FROM Promotion p
        WHERE p.product.id = :productId
        AND p.startDate <= :endDate
        AND p.endDate >= :startDate
    """)
    List<Promotion> findOverlappingByProduct(
            @Param("productId") Long productId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("""
        SELECT p FROM Promotion p
        WHERE p.category = :category
        AND p.startDate <= :endDate
        AND p.endDate >= :startDate
    """)
    List<Promotion> findOverlappingByCategory(
            @Param("category") ProductCategory category,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
