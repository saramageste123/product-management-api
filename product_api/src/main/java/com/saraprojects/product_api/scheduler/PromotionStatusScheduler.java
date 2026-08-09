package com.saraprojects.product_api.scheduler;

import com.saraprojects.product_api.model.Promotion;
import com.saraprojects.product_api.repository.PromotionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PromotionStatusScheduler {

    private final PromotionRepository repository;

    // Corrige status assim que a aplicação sobe (cobre dados antigos/dessincronizados)
    @PostConstruct
    public void onStartup() {
        refreshPromotionStatuses();
    }

    // Mantém sincronizado continuamente enquanto a aplicação roda
    @Scheduled(fixedRate = 60_000)
    public void refreshPromotionStatuses() {

        List<Promotion> promotions = repository.findAll();

        List<Promotion> toUpdate = promotions.stream()
                .filter(p -> p.getStatus() != p.calculateStatus())
                .peek(p -> p.setStatus(p.calculateStatus()))
                .toList();

        if (!toUpdate.isEmpty()) {
            repository.saveAll(toUpdate);
        }
    }
}