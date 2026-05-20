package com.library.management.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({JwtProperties.class, AuthProperties.class, LibraryProperties.class})
public class ApplicationConfig {
}
