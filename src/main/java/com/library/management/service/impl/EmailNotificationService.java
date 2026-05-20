package com.library.management.service.impl;

import com.library.management.config.LibraryProperties;
import com.library.management.config.MailNotificationProperties;
import com.library.management.notification.LibraryEmailTemplates;
import com.library.management.service.NotificationService;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(prefix = "application.mail", name = "enabled", havingValue = "true")
@ConditionalOnBean(JavaMailSender.class)
public class EmailNotificationService implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    private final JavaMailSender mailSender;
    private final MailNotificationProperties mailProperties;
    private final LibraryProperties libraryProperties;

    public EmailNotificationService(
            JavaMailSender mailSender,
            MailNotificationProperties mailProperties,
            LibraryProperties libraryProperties
    ) {
        this.mailSender = mailSender;
        this.mailProperties = mailProperties;
        this.libraryProperties = libraryProperties;
    }

    @Override
    public void sendDueSoonReminder(String email, String username, String bookTitle, String dueDate) {
        send(
                email,
                LibraryEmailTemplates.dueSoonSubject(bookTitle),
                LibraryEmailTemplates.dueSoonBody(username, bookTitle, dueDate, mailProperties.getAppUrl())
        );
    }

    @Override
    public void sendOverdueNotice(String email, String username, String bookTitle, String dueDate) {
        send(
                email,
                LibraryEmailTemplates.overdueSubject(bookTitle),
                LibraryEmailTemplates.overdueBody(username, bookTitle, dueDate, mailProperties.getAppUrl())
        );
    }

    @Override
    public void sendReservationAvailable(String email, String username, String bookTitle) {
        send(
                email,
                LibraryEmailTemplates.reservationAvailableSubject(bookTitle),
                LibraryEmailTemplates.reservationAvailableBody(username, bookTitle, mailProperties.getAppUrl())
        );
    }

    private void send(String to, String subject, String htmlBody) {
        if (!libraryProperties.isNotificationsEnabled()) {
            return;
        }
        if (to == null || to.isBlank()) {
            log.warn("Skipping email with empty recipient, subject={}", subject);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mailProperties.getFrom(), mailProperties.getFromName());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Sent email to {} subject={}", to, subject);
        } catch (Exception ex) {
            log.error("Failed to send email to {} subject={}: {}", to, subject, ex.getMessage(), ex);
        }
    }
}
