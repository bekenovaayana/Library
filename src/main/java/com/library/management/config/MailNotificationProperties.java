package com.library.management.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "application.mail")
public class MailNotificationProperties {

    /**
     * When true, requires {@code spring.mail.host} (e.g. SendGrid SMTP).
     * When false, notifications are written to the application log only.
     */
    private boolean enabled = false;

    /** Verified sender address (SendGrid: must be authenticated in their dashboard). */
    private String from = "noreply@library.local";

    private String fromName = "Library Management System";

    /** Link target in emails (catalog / my books). */
    private String appUrl = "http://localhost:3000";
}
