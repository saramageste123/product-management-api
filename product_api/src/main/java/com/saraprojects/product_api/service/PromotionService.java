package com.saraprojects.product_api.service;

import com.saraprojects.product_api.dto.PromotionCreateDTO;
import com.saraprojects.product_api.dto.PromotionDTO;
import com.saraprojects.product_api.enums.PromotionStatus;
import com.saraprojects.product_api.enums.PromotionTargetType;
import com.saraprojects.product_api.model.Product;
import com.saraprojects.product_api.model.Promotion;
import com.saraprojects.product_api.repository.ProductRepository;
import com.saraprojects.product_api.repository.PromotionRepository;
import com.saraprojects.product_api.specification.PromotionSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository repository;
    private final ProductRepository productRepository;

    private Pageable buildPageable(int page, int size, String sortBy) {
        try {
            String[] sortParams = sortBy.split(",");
            String sortField = sortParams[0];
            Sort.Direction sortDirection = Sort.Direction.ASC;

            if (sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc")) {
                sortDirection = Sort.Direction.DESC;
            }

            return PageRequest.of(page, size, Sort.by(sortDirection, sortField));

        } catch (Exception e) {
            return PageRequest.of(page, size, Sort.by("startDate").descending());
        }
    }

    private Map<String, Object> buildResponse(Page<Promotion> pagePromotions, String sortBy) {
        List<PromotionDTO> promotions = pagePromotions.getContent()
                .stream()
                .map(PromotionDTO::new)
                .toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("promotions", promotions);
        response.put("currentPage", pagePromotions.getNumber());
        response.put("totalItems", pagePromotions.getTotalElements());
        response.put("totalPages", pagePromotions.getTotalPages());
        response.put("pageSize", pagePromotions.getSize());
        response.put("sortBy", sortBy);

        return response;
    }

    // Paginated + filtered list
    public Map<String, Object> getPromotions(
            PromotionTargetType targetType,
            LocalDate startDate,
            LocalDate endDate,
            PromotionStatus status,
            int page,
            int size,
            String sortBy) {
        Pageable pageable = buildPageable(page, size, sortBy);
        Specification<Promotion> spec = PromotionSpecification.filter(targetType, startDate, endDate, status);
        Page<Promotion> pagePromotions = repository.findAll(spec, pageable);
        return buildResponse(pagePromotions, sortBy);
    }

    // Return all promotions
    public List<PromotionDTO> getAllPromotions() {
        return repository.findAll()
                .stream()
                .map(PromotionDTO::new)
                .toList();
    }

    // Find promotion by ID
    public PromotionDTO getPromotionById(Long id) {

        Promotion promotion = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Promotion not found with ID: " + id));

        return new PromotionDTO(promotion);
    }

    // Create new promotion
    public PromotionDTO createPromotion(PromotionCreateDTO dto) {

        if (dto.startDate().isAfter(dto.endDate())) {
            throw new RuntimeException("Start date cannot be after end date");
        }

        if (dto.discountPercentage().compareTo(BigDecimal.ZERO) <= 0
                || dto.discountPercentage().compareTo(BigDecimal.valueOf(100)) > 0) {

            throw new RuntimeException(
                    "Discount percentage must be between 0 and 100");
        }

        validateNoOverlap(dto);

        Promotion promotion = new Promotion();

        promotion.setTargetType(dto.targetType());
        promotion.setDiscountPercentage(dto.discountPercentage());
        promotion.setStartDate(dto.startDate());
        promotion.setEndDate(dto.endDate());

        if (dto.targetType() == PromotionTargetType.PRODUCT) {

            if (dto.productId() == null) {
                throw new RuntimeException("Product is required");
            }

            Product product = productRepository.findById(dto.productId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            promotion.setProduct(product);
        }

        if (dto.targetType() == PromotionTargetType.CATEGORY) {

            if (dto.category() == null) {
                throw new RuntimeException("Category is required");
            }

            promotion.setCategory(dto.category());
        }

        Promotion saved = repository.save(promotion);

        return new PromotionDTO(saved);
    }

    //Validation Promotion
    private void validateNoOverlap(PromotionCreateDTO dto) {

        if (dto.targetType() == PromotionTargetType.PRODUCT) {

            if (dto.productId() == null) {
                throw new RuntimeException("Product is required");
            }

            List<Promotion> overlapping = repository.findOverlappingByProduct(
                    dto.productId(), dto.startDate(), dto.endDate());

            if (!overlapping.isEmpty()) {
                throw new RuntimeException(
                        "This product already has a promotion overlapping this date range");
            }
        }

        if (dto.targetType() == PromotionTargetType.CATEGORY) {

            if (dto.category() == null) {
                throw new RuntimeException("Category is required");
            }

            List<Promotion> overlapping = repository.findOverlappingByCategory(
                    dto.category(), dto.startDate(), dto.endDate());

            if (!overlapping.isEmpty()) {
                throw new RuntimeException(
                        "This category already has a promotion overlapping this date range");
            }
        }
    }

    // Delete promotion
    public void deletePromotion(Long id) {

        Promotion promotion = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Promotion not found with ID: " + id));

        if (promotion.getStatus() != PromotionStatus.FINISHED) {
            throw new RuntimeException(
                    "Only finished promotions can be deleted");
        }

        repository.deleteById(id);
    }

    // Delete selected promotions
    public void deletePromotions(List<Long> ids) {

        List<Promotion> promotions = repository.findAllById(ids);

        boolean hasInvalidPromotion = promotions.stream()
                .anyMatch(p ->
                        p.getStatus() != PromotionStatus.FINISHED);

        if (hasInvalidPromotion) {
            throw new RuntimeException(
                    "Only finished promotions can be deleted");
        }

        repository.deleteAllById(ids);
    }

    // Get active promotion for product (product promotion has priority over category promotion)
    public Promotion getActivePromotionForProduct(Product product) {

        List<Promotion> productPromotions =
                repository.findByProductId(product.getId());

        Promotion activeProductPromotion = productPromotions.stream()
                .filter(p -> p.getStatus() == PromotionStatus.ACTIVE)
                .findFirst()
                .orElse(null);

        if (activeProductPromotion != null) {
            return activeProductPromotion;
        }

        List<Promotion> categoryPromotions =
                repository.findByCategory(product.getCategory());

        return categoryPromotions.stream()
                .filter(p -> p.getStatus() == PromotionStatus.ACTIVE)
                .findFirst()
                .orElse(null);
    }
}
