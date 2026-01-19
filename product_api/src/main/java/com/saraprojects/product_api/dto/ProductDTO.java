package com.saraprojects.product_api.dto;

import com.saraprojects.product_api.model.Product;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull
    @Positive
    private Double price;

    @NotNull
    @PositiveOrZero
    private Integer quantity;

    @jakarta.validation.constraints.Pattern(
            regexp = "^(http|https)://.*$",
            message = "Image URL must be a valid URL"
    )
    private String imageUrl;

    // 🔁 Construtor que converte Entity → DTO
    public ProductDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.quantity = product.getQuantity();
        this.imageUrl = product.getImageUrl();
    }

    // 🔁 Metodo que converte DTO → Entity
    public Product toEntity() {
        return Product.builder()
                .id(this.id)
                .name(this.name)
                .description(this.description)
                .price(this.price)
                .quantity(this.quantity)
                .imageUrl(this.imageUrl)
                .build();
    }
}
