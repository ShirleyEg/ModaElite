package com.Proyecto.PA.util;

import com.Proyecto.PA.model.Usuario;
import com.Proyecto.PA.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class VerificarAdmin implements CommandLineRunner {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Verificar si existe el usuario administrador
        Usuario admin = usuarioRepository.findByCorreo("admin@modaelite.com");
        if (admin != null) {
            System.out.println("Usuario administrador encontrado:");
            System.out.println("ID: " + admin.getId());
            System.out.println("Nombre: " + admin.getNombre());
            System.out.println("Correo: " + admin.getCorreo());
            System.out.println("Rol: " + admin.getRol());
            System.out.println("Contraseña: " + admin.getPassword());
            System.out.println("Dirección: " + admin.getDireccion());
            System.out.println("Teléfono: " + admin.getTelefono());
        } else {
            System.out.println("Usuario administrador NO encontrado");
            
            // Listar todos los usuarios para depuración
            System.out.println("Lista de todos los usuarios:");
            usuarioRepository.findAll().forEach(usuario -> {
                System.out.println("  - ID: " + usuario.getId() + ", Correo: " + usuario.getCorreo() + ", Nombre: " + usuario.getNombre() + ", Rol: " + usuario.getRol());
            });
        }
    }
}