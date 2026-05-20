package com.library.management.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@Getter
@Setter
@ConfigurationProperties(prefix = "application.library")
public class LibraryProperties {

    private int borrowDays = 14;
    private int maxBooksPerUser = 5;
    private BigDecimal finePerDay = new BigDecimal("1.00");
    private BigDecimal maxFine = new BigDecimal("50.00");
    private int reminderDaysBeforeDue = 2;
    private boolean notificationsEnabled = true;
}
