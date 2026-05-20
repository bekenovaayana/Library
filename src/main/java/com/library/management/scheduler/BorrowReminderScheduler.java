package com.library.management.scheduler;

import com.library.management.config.LibraryProperties;
import com.library.management.entity.BorrowRecord;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class BorrowReminderScheduler {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    private final BorrowRecordRepository borrowRecordRepository;
    private final NotificationService notificationService;
    private final LibraryProperties libraryProperties;

    public BorrowReminderScheduler(
            BorrowRecordRepository borrowRecordRepository,
            NotificationService notificationService,
            LibraryProperties libraryProperties
    ) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.notificationService = notificationService;
        this.libraryProperties = libraryProperties;
    }

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void sendReminders() {
        if (!libraryProperties.isNotificationsEnabled()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowEnd = now.plusDays(libraryProperties.getReminderDaysBeforeDue());

        List<BorrowRecord> dueSoon = borrowRecordRepository.findDueSoonForReminder(now, windowEnd);
        for (BorrowRecord record : dueSoon) {
            notificationService.sendDueSoonReminder(
                    record.getUser().getEmail(),
                    record.getUser().getUsername(),
                    record.getBook().getTitle(),
                    record.getDueDate().format(FORMATTER)
            );
            record.setReminderSent(true);
        }

        List<BorrowRecord> overdue = borrowRecordRepository.findOverdueActive(now);
        for (BorrowRecord record : overdue) {
            notificationService.sendOverdueNotice(
                    record.getUser().getEmail(),
                    record.getUser().getUsername(),
                    record.getBook().getTitle(),
                    record.getDueDate().format(FORMATTER)
            );
        }
    }
}
