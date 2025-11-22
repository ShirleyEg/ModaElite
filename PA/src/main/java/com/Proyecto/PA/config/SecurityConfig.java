package com.Proyecto.PA.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.ALWAYS))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**", "/api/productos/**", "/api/usuarios/login", "/api/usuarios/test").permitAll()
                .requestMatchers("/css/**", "/js/**", "/img/**", "/static/**").permitAll()
                .requestMatchers("/", "/home", "/inicioSesion", "/registro").permitAll()
                .requestMatchers("/admin", "/api/admin/**").hasAuthority("administrador")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/inicioSesion")
                .defaultSuccessUrl("/home", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/inicioSesion?logout")
                .permitAll()
            );
            
        return http.build();
    }
}