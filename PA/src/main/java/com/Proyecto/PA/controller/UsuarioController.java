package com.Proyecto.PA.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Proyecto.PA.model.Usuario;
import com.Proyecto.PA.repository.UsuarioRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            // Verificar si ya existe un usuario con ese correo
            Usuario existente = usuarioRepository.findByCorreo(usuario.getCorreo());
            if (existente != null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Ya existe un usuario con ese correo");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            // Guardar el nuevo usuario
            Usuario nuevoUsuario = usuarioRepository.save(usuario);
            System.out.println("Usuario registrado: " + nuevoUsuario.getId() + " - " + nuevoUsuario.getCorreo());
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al registrar usuario: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        try {
            System.out.println("DEBUG: Intento de login recibido");
            System.out.println("DEBUG: Correo recibido: " + usuario.getCorreo());
            System.out.println("DEBUG: Contraseña recibida: " + (usuario.getPassword() != null ? "[PRESENTE]" : "[NULA]"));
            
            // Imprimir todos los usuarios en la base de datos
            System.out.println("DEBUG: Usuarios en la base de datos:");
            usuarioRepository.findAll().forEach(u -> 
                System.out.println("  - Correo: " + u.getCorreo())
            );
            
            // Validar campos obligatorios
            if (usuario.getCorreo() == null || usuario.getPassword() == null) {
                System.out.println("DEBUG: Login fallido - Campos incompletos");
                Map<String, String> response = new HashMap<>();
                response.put("error", "Correo y contraseña son obligatorios");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            // Buscar usuario por correo
            Usuario existente = usuarioRepository.findByCorreo(usuario.getCorreo());
            
            // Verificar credenciales
            if (existente == null) {
                System.out.println("DEBUG: Login fallido - Usuario no encontrado: " + usuario.getCorreo());
                Map<String, String> response = new HashMap<>();
                response.put("error", "Usuario no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            
            // Comparar contraseñas
            System.out.println("DEBUG: Contraseña esperada: " + existente.getPassword());
            System.out.println("DEBUG: Contraseña recibida: " + usuario.getPassword());
            
            if (!existente.getPassword().equals(usuario.getPassword())) {
                System.out.println("DEBUG: Login fallido - Contraseña incorrecta para: " + usuario.getCorreo());
                Map<String, String> response = new HashMap<>();
                response.put("error", "Contraseña incorrecta");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
            
            // Login exitoso
            System.out.println("DEBUG: Login exitoso para: " + existente.getCorreo());
            Map<String, Object> response = new HashMap<>();
            response.put("id", existente.getId());
            response.put("nombre", existente.getNombre());
            response.put("correo", existente.getCorreo());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("ERROR durante el inicio de sesión: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error interno del servidor");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        return new ResponseEntity<>("API de usuarios funcionando correctamente", HttpStatus.OK);
    }
}
