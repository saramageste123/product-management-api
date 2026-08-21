package com.saraprojects.product_api.scheduler;

import com.saraprojects.product_api.model.Promotion;
import com.saraprojects.product_api.repository.PromotionRepository;
import com.saraprojects.product_api.service.NotificationService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PromotionStatusScheduler {

    private final PromotionRepository repository;
    private final NotificationService notificationService;

    @PostConstruct
    public void onStartup() {
        refreshPromotionStatuses();
        checkUpcomingPromotionEvents();
    }

    @Scheduled(fixedRate = 60_000)
    public void runScheduledTasks() {
        refreshPromotionStatuses();
        checkUpcomingPromotionEvents();
    }

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

    public void checkUpcomingPromotionEvents() {

        List<Promotion> promotions = repository.findAll();

        for (Promotion promotion : promotions) {
            notificationService.checkPromotionNotifications(promotion);
        }
    }

}