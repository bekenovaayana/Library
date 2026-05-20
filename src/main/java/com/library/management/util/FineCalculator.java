package com.library.management.util;

import com.library.management.config.LibraryProperties;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public final class FineCalculator {

    private FineCalculator() {
    }

    public static BigDecimal calculate(
            LocalDateTime dueDate,
            LocalDateTime returnDate,
            LibraryProperties properties
    ) {
        if (!returnDate.isAfter(dueDate)) {
            return BigDecimal.ZERO;
        }

        long daysOverdue = ChronoUnit.DAYS.between(dueDate.toLocalDate(), returnDate.toLocalDate());
        if (daysOverdue <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal calculated = properties.getFinePerDay()
                .multiply(BigDecimal.valueOf(daysOverdue))
                .setScale(2, RoundingMode.HALF_UP);

        return calculated.min(properties.getMaxFine());
    }
}
