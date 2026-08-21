package com.saraprojects.product_api.service;

import com.saraprojects.product_api.enums.NotificationType;
import com.saraprojects.product_api.enums.PromotionTargetType;
import com.saraprojects.product_api.model.Notification;
import com.saraprojects.product_api.model.Product;
import com.saraprojects.product_api.model.Promotion;
import com.saraprojects.product_api.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createLowStockNotification(Product product) {

        Notification existingNotification =
                notificationRepository
                        .findFirstByProductIdAndResolvedFalse(product.getId())
                        .orElse(null);

        if (existingNotification != null) {

            existingNotification.setMessage(
                    product.getName() +
                            " has only " +
                            product.getQuantity() +
                            " units left in stock."
            );

            existingNotification.setRead(false);

            notificationRepository.save(existingNotification);

            return;
        }

        Notification notification = new Notification();

        notification.setTitle("Low stock");

        notification.setMessage(
                product.getName() +
                        " has only " +
                        product.getQuantity() +
                        " units left in stock."
        );

        notification.setType(NotificationType.LOW_STOCK);
        notification.setProductId(product.getId());
        notification.setResolved(false);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    public void resolveLowStockNotifications(Long productId) {

        List<Notification> notifications = notificationRepository.findByProductIdAndResolvedFalse(productId);

        notifications.forEach(notification -> {
            notification.setResolved(true);
        });

        notificationRepository.saveAll(notifications);
    }

    public void checkPromotionNotifications(Promotion promotion) {

        LocalDate tomorrow = LocalDate.now().plusDays(1);

        boolean startsTomorrow = promotion.getStartDate().toLocalDate().isEqual(tomorrow);
        boolean endsTomorrow = promotion.getEndDate().toLocalDate().isEqual(tomorrow);

        if (startsTomorrow && endsTomorrow) {
            createPromotionSingleDayNotification(promotion);
            return;
        }

        if (startsTomorrow) {
            createPromotionStartingNotification(promotion);
        }

        if (endsTomorrow) {
            createPromotionEndingNotification(promotion);
        }
    }

    // Promotion starting tomorrow
    private void createPromotionStartingNotification(Promotion promotion) {

        Optional<Notification> existing = notificationRepository
                .findFirstByPromotionIdAndType(promotion.getId(), NotificationType.PROMOTION_STARTING);

        if (existing.isPresent()) {
            return;
        }

        Notification notification = new Notification();

        notification.setTitle("Promotion starting");
        notification.setMessage(buildPromotionMessage(promotion, "starts"));
        notification.setType(NotificationType.PROMOTION_STARTING);
        notification.setPromotionId(promotion.getId());

        if (promotion.getTargetType() == PromotionTargetType.PRODUCT && promotion.getProduct() != null) {
            notification.setProductId(promotion.getProduct().getId());
        }

        notification.setResolved(false);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    // Promotion ending tomorrow
    private void createPromotionEndingNotification(Promotion promotion) {

        Optional<Notification> existing = notificationRepository
                .findFirstByPromotionIdAndType(promotion.getId(), NotificationType.PROMOTION_ENDING);

        if (existing.isPresent()) {
            return;
        }

        Notification notification = new Notification();

        notification.setTitle("Promotion ending");
        notification.setMessage(buildPromotionMessage(promotion, "ends"));
        notification.setType(NotificationType.PROMOTION_ENDING);
        notification.setPromotionId(promotion.getId());

        if (promotion.getTargetType() == PromotionTargetType.PRODUCT && promotion.getProduct() != null) {
            notification.setProductId(promotion.getProduct().getId());
        }

        notification.setResolved(false);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    // Promotion starts and ends tomorrow (single-day promotion)
    private void createPromotionSingleDayNotification(Promotion promotion) {

        Optional<Notification> existing = notificationRepository
                .findFirstByPromotionIdAndType(promotion.getId(), NotificationType.PROMOTION_SINGLE_DAY);

        if (existing.isPresent()) {
            return;
        }

        String targetName = resolveTargetName(promotion);
        String discount = promotion.getDiscountPercentage().stripTrailingZeros().toPlainString();

        Notification notification = new Notification();

        notification.setTitle("Promotion happening tomorrow");
        notification.setMessage(targetName + " promotion (" + discount + "% off) happens tomorrow only!");
        notification.setType(NotificationType.PROMOTION_SINGLE_DAY);
        notification.setPromotionId(promotion.getId());

        if (promotion.getTargetType() == PromotionTargetType.PRODUCT && promotion.getProduct() != null) {
            notification.setProductId(promotion.getProduct().getId());
        }

        notification.setResolved(false);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    private String buildPromotionMessage(Promotion promotion, String verb) {
        String targetName = resolveTargetName(promotion);
        String discount = promotion.getDiscountPercentage().stripTrailingZeros().toPlainString();

        return targetName + " promotion (" + discount + "% off) " + verb + " tomorrow!";
    }

    private String resolveTargetName(Promotion promotion) {

        if (promotion.getTargetType() == PromotionTargetType.PRODUCT && promotion.getProduct() != null) {
            return promotion.getProduct().getName();
        }

        if (promotion.getCategory() != null) {
            return promotion.getCategory().name();
        }

        return "Promotion";
    }

    //All Notifications
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .filter(notification -> !notification.isResolved())
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    public Notification  markAsRead(Long id) {

        Notification notification = notificationRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Notification not found")
        );

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public long countUnreadNotifications() {
        return notificationRepository.countByReadFalse();
    }

    public void markAllAsRead() {
        List<Notification> notifications = notificationRepository.findAllByReadFalse();
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public List<Notification> getNotificationHistory() {
        return notificationRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    public void clearHistory() {
        notificationRepository.deleteAll();
    }
}