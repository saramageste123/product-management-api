package com.saraprojects.product_api.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique=true)
    private String email;

    @Column(nullable = false, unique = true)
    private String employeeCode;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Integer avatarId;

}
