package com.library.management.notification;

public final class LibraryEmailTemplates {

    private LibraryEmailTemplates() {
    }

    public static String dueSoonSubject(String bookTitle) {
        return "Reminder: \"" + bookTitle + "\" is due soon";
    }

    public static String dueSoonBody(String username, String bookTitle, String dueDate, String appUrl) {
        return """
                <p>Hello <strong>%s</strong>,</p>
                <p>Your borrowed book <strong>%s</strong> is due on <strong>%s</strong>.</p>
                <p>Please return it on time to avoid late fees.</p>
                <p><a href="%s/my-books">View my books</a></p>
                <p>— Library Management System</p>
                """.formatted(escape(username), escape(bookTitle), escape(dueDate), escape(appUrl));
    }

    public static String overdueSubject(String bookTitle) {
        return "Overdue: please return \"" + bookTitle + "\"";
    }

    public static String overdueBody(String username, String bookTitle, String dueDate, String appUrl) {
        return """
                <p>Hello <strong>%s</strong>,</p>
                <p>Your book <strong>%s</strong> was due on <strong>%s</strong> and is now overdue.</p>
                <p>Late fees may apply according to library policy. Please return the book as soon as possible.</p>
                <p><a href="%s/my-books">View my books</a></p>
                <p>— Library Management System</p>
                """.formatted(escape(username), escape(bookTitle), escape(dueDate), escape(appUrl));
    }

    public static String reservationAvailableSubject(String bookTitle) {
        return "Book available: \"" + bookTitle + "\"";
    }

    public static String reservationAvailableBody(String username, String bookTitle, String appUrl) {
        return """
                <p>Hello <strong>%s</strong>,</p>
                <p>Good news! The book <strong>%s</strong> you reserved is now available.</p>
                <p>Borrow it before someone else does.</p>
                <p><a href="%s/books">Browse catalog</a></p>
                <p>— Library Management System</p>
                """.formatted(escape(username), escape(bookTitle), escape(appUrl));
    }

    private static String escape(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
