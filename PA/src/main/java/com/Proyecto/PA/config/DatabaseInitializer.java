package com.Proyecto.PA.config;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.Proyecto.PA.model.Usuario;
import com.Proyecto.PA.repository.UsuarioRepository;

@Configuration
public class DatabaseInitializer {

    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostConstruct
    public void init() {
        if (!mongoTemplate.collectionExists("usuarios")) {
            mongoTemplate.createCollection("usuarios");
        }
        if (!mongoTemplate.collectionExists("productos")) {
            mongoTemplate.createCollection("productos");
        }
        if (!mongoTemplate.collectionExists("compras")) {
            mongoTemplate.createCollection("compras");
        }
        
        // Crear usuario administrador por defecto si no existe
        crearUsuarioAdminPorDefecto();
    }
    
    private void crearUsuarioAdminPorDefecto() {
        // Verificar si ya existe un administrador
        Usuario existente = usuarioRepository.findByCorreo("admin@modaelite.com");
        if (existente == null) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setCorreo("admin@modaelite.com");
            admin.setPassword("admin123");
            admin.setRol("administrador");
            
            usuarioRepository.save(admin);
            System.out.println("Usuario administrador creado por defecto: admin@modaelite.com / admin123");
        } else {
            System.out.println("Usuario administrador ya existe");
        }
    }
}
