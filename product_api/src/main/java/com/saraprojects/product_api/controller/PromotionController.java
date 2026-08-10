package com.saraprojects.product_api.controller;

import com.saraprojects.product_api.dto.PromotionCreateDTO;
import com.saraprojects.product_api.dto.PromotionDTO;
import com.saraprojects.product_api.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService service;

    // Paginated list
    @GetMapping
    public ResponseEntity<Map<String, Object>> getPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "startDate,desc") String sortBy
    ) {
        return ResponseEntity.ok(service.getPromotions(page, size, sortBy));
    }

    // Return all promotions
    @GetMapping("/all")
    public ResponseEntity<List<PromotionDTO>> getAllPromotions() {
        return ResponseEntity.ok(
                service.getAllPromotions()
        );
    }

    // Return promotion by ID
    @GetMapping("/id/{id}")
    public ResponseEntity<PromotionDTO> getPromotionById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPromotionById(id)
        );
    }

    // Create promotion
    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody PromotionCreateDTO dto) {
        return ResponseEntity.ok(service.createPromotion(dto)
        );
    }

    // Delete promotion
    @DeleteMapping("/id/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        service.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }

    // Delete selected promotions
    @DeleteMapping("/bulk-delete")
    public ResponseEntity<Void> deletePromotions(@RequestBody List<Long> ids) {
        service.deletePromotions(ids);
        return ResponseEntity.noContent().build();
    }
}
