package com.Proyecto.PA.repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.Proyecto.PA.model.Compra;

public interface CompraRepository extends MongoRepository<Compra, String> {
}

