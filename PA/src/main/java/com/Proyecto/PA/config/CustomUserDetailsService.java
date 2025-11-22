package com.Proyecto.PA.config;

import com.Proyecto.PA.model.Usuario;
import com.Proyecto.PA.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + correo);
        }

        // Crear autoridad basada en el rol del usuario
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("administrador".equals(usuario.getRol()) ? "administrador" : "usuario");

        return User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getPassword())
                .authorities(Collections.singletonList(authority))
                .build();
    }
}