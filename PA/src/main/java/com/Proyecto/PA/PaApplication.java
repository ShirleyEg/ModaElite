package com.Proyecto.PA;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class PaApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(PaApplication.class, args);
		
		// Obtener el puerto y mostrar la URL en la consola
		ServletWebServerApplicationContext webServerAppCtxt = (ServletWebServerApplicationContext) context;
		int port = webServerAppCtxt.getWebServer().getPort();
		Environment env = context.getEnvironment();
		String contextPath = env.getProperty("server.servlet.context-path", "");
		
		System.out.println("\n===========================================================");
		System.out.println("  Aplicación iniciada correctamente!");
		System.out.println("  URL: http://localhost:" + port + contextPath);
		System.out.println("==========================================================\n");
	}

}