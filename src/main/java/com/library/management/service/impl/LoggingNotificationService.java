package com.library.management.service.impl;

import com.library.management.config.LibraryProperties;
import com.library.management.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(prefix = "application.mail", name = "enabled", havingValue = "false", matchIfMissing = true)
public class LoggingNotificationService implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(LoggingNotificationService.class);

    private final LibraryProperties libraryProperties;

    public LoggingNotificationService(LibraryProperties libraryProperties) {
        this.libraryProperties = libraryProperties;
    }

    @Override
    public void sendDueSoonReminder(String email, String username, String bookTitle, String dueDate) {
        if (!libraryProperties.isNotificationsEnabled()) {
            return;
        }
        log.info("[REMINDER] Due soon for {} <{}>: '{}' due {}", username, email, bookTitle, dueDate);
    }

    @Override
    public void sendOverdueNotice(String email, String username, String bookTitle, String dueDate) {
        if (!libraryProperties.isNotificationsEnabled()) {
            return;
        }
        log.warn("[OVERDUE] {} <{}>: '{}' was due {}", username, email, bookTitle, dueDate);
    }

    @Override
    public void sendReservationAvailable(String email, String username, String bookTitle) {
        if (!libraryProperties.isNotificationsEnabled()) {
            return;
        }
        log.info("[RESERVATION] Book available for {} <{}>: '{}'", username, email, bookTitle);
    }
}
