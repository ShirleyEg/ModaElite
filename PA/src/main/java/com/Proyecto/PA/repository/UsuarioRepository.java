package com.Proyecto.PA.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.Proyecto.PA.model.Usuario;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Usuario findByCorreo(String correo);
}


