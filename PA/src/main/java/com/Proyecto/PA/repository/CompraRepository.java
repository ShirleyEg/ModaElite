package com.Proyecto.PA.repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.Proyecto.PA.model.Compra;
import java.util.List;

public interface CompraRepository extends MongoRepository<Compra, String> {
    List<Compra> findByUsuarioId(String usuarioId);
}

