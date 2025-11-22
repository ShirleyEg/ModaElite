package com.example.wekapredictor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

/**
 * Aplicación principal de Spring Boot para el servicio de predicción con Weka.
 */
@SpringBootApplication
public class WekaPredictorApplication {

    /**
     * Punto de entrada de la aplicación.
     *
     * @param args argumentos de línea de comandos
     */
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(WekaPredictorApplication.class);
        Environment env = app.run(args).getEnvironment();
        
        String port = env.getProperty("server.port", "8080");
        System.out.println("\n========================================");
        System.out.println("✓ Aplicación iniciada correctamente");
        System.out.println("========================================");
        System.out.println("URL: http://localhost:" + port);
        System.out.println("========================================\n");
    }
}
