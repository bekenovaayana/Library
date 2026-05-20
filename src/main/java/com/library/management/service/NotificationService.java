package com.library.management.service;

public interface NotificationService {

    void sendDueSoonReminder(String email, String username, String bookTitle, String dueDate);

    void sendOverdueNotice(String email, String username, String bookTitle, String dueDate);

    void sendReservationAvailable(String email, String username, String bookTitle);
}
