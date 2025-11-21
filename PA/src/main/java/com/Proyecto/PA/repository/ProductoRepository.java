package com.Proyecto.PA.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.Proyecto.PA.model.Producto;

public interface ProductoRepository extends MongoRepository<Producto, String> {
}

