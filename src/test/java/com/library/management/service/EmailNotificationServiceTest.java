package com.library.management.service;

import com.library.management.config.LibraryProperties;
import com.library.management.config.MailNotificationProperties;
import com.library.management.service.impl.EmailNotificationService;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmailNotificationServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    private MailNotificationProperties mailProperties;
    private LibraryProperties libraryProperties;
    private EmailNotificationService emailNotificationService;

    @BeforeEach
    void setUp() {
        mailProperties = new MailNotificationProperties();
        mailProperties.setEnabled(true);
        mailProperties.setFrom("library@example.com");
        mailProperties.setFromName("Library");
        mailProperties.setAppUrl("http://localhost:3000");

        libraryProperties = new LibraryProperties();
        libraryProperties.setNotificationsEnabled(true);

        emailNotificationService = new EmailNotificationService(mailSender, mailProperties, libraryProperties);
    }

    @Test
    void sendDueSoonReminder_shouldSendEmail() throws Exception {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        emailNotificationService.sendDueSoonReminder(
                "user@example.com",
                "alice",
                "Clean Code",
                "2026-06-01"
        );

        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendDueSoonReminder_whenNotificationsDisabled_shouldNotSend() {
        libraryProperties.setNotificationsEnabled(false);

        emailNotificationService.sendDueSoonReminder(
                "user@example.com",
                "alice",
                "Clean Code",
                "2026-06-01"
        );

        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    void sendReservationAvailable_shouldSendToRecipient() throws Exception {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        emailNotificationService.sendReservationAvailable(
                "reader@example.com",
                "bob",
                "1984"
        );

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender).send(captor.capture());
        assertThat(captor.getValue()).isSameAs(mimeMessage);
    }
}
