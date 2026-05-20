package com.library.management.config;

import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Ensures a library manager (ADMIN) account exists for catalog management.
 * Promotes an existing account with the configured email or username to ADMIN.
 */
@Component
@Profile("!test")
public class AdminUserInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LibraryProperties libraryProperties;

    public AdminUserInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            LibraryProperties libraryProperties
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.libraryProperties = libraryProperties;
    }

    @Override
    public void run(String... args) {
        LibraryProperties.AdminSeed seed = libraryProperties.getAdminSeed();
        if (!seed.isEnabled()) {
            return;
        }

        Optional<User> existing = userRepository.findByEmail(seed.getEmail());
        if (existing.isEmpty()) {
            existing = userRepository.findByUsername(seed.getUsername());
        }

        if (existing.isPresent()) {
            User user = existing.get();
            boolean updated = false;

            if (user.getRole() != Role.ADMIN) {
                user.setRole(Role.ADMIN);
                updated = true;
            }

            if (updated) {
                userRepository.save(user);
                log.info(
                        "Promoted user '{}' to ADMIN — sign out and sign in again to open /admin",
                        user.getUsername()
                );
            } else {
                log.info(
                        "Library admin account ready: {} ({}) — use /admin/books to manage catalog",
                        user.getUsername(),
                        user.getEmail()
                );
            }
            return;
        }

        User admin = User.builder()
                .username(seed.getUsername())
                .email(seed.getEmail())
                .password(passwordEncoder.encode(seed.getPassword()))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        log.info(
                "Created library admin: email={}, password=[configured via LIBRARY_ADMIN_PASSWORD] — login at /login then open /admin",
                seed.getEmail()
        );
    }
}
