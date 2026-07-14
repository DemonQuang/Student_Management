package com.studentmanagement.studentapi.security.config;

import com.studentmanagement.studentapi.security.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins:http://localhost:*,http://127.0.0.1:*}")
    private String[] corsAllowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(corsAllowedOrigins));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control", "Accept", "X-Requested-With", "Origin"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/", "/index.html", "/static/**", "/css/**", "/js/**", "/assets/**", "/favicon.ico", "/favicon.svg", "/icons.svg").permitAll()
                        .requestMatchers("/login", "/register", "/forgot-password",
                                "/admin/**", "/student/**").permitAll()

                        // User management (Admin only)
                        .requestMatchers("/api/v1/users/**").hasRole("ADMIN")

                        // Dashboard
                        .requestMatchers(HttpMethod.GET, "/api/v1/dashboard/**").hasAnyRole("USER", "ADMIN")

                        // Students management
                        .requestMatchers(HttpMethod.GET, "/api/v1/students/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/students/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/students/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/students/**").hasRole("ADMIN")

                        // Departments management
                        .requestMatchers(HttpMethod.GET, "/api/v1/departments/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/departments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/departments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/departments/**").hasRole("ADMIN")

                        // Classrooms management
                        .requestMatchers(HttpMethod.GET, "/api/v1/classrooms/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/classrooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/classrooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/classrooms/**").hasRole("ADMIN")

                        // Any other request must be authenticated
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
