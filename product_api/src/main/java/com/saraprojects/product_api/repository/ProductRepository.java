package com.saraprojects.product_api.repository;

import com.saraprojects.product_api.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Busca produtos cujo nome **começa** com o texto informado, ignorando maiúsculas/minúsculas
    Page<Product> findByNameStartingWithIgnoreCase(String name, Pageable pageable);
}

