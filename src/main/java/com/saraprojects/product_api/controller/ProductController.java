package com.saraprojects.product_api.controller;

import com.saraprojects.product_api.dto.ProductDTO;
import com.saraprojects.product_api.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    // 🔹 Listar todos com paginação
    @GetMapping("/paged")
    public ResponseEntity<Map<String, Object>> getAllProductsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "price,asc") String sortBy
    ) {
        return ResponseEntity.ok(service.getPagedResponse(page, size, sortBy));
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchProducts(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,asc") String sortBy
    ) {
        return ResponseEntity.ok(service.searchProducts(name, page, size, sortBy));
    }

    // 🔹 Listar todos sem paginação
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(service.getAllProducts());
    }

    // 🔹 Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getProductById(id));
    }

    // 🔹 Criar novo produto
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(service.createProduct(dto));
    }

    // 🔹 Atualizar produto
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO dto
    ) {
        return ResponseEntity.ok(service.updateProduct(id, dto));
    }

    // 🔹 Excluir produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
