package com.Proyecto.PA.config;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class DatabaseInitializer {

    @Autowired
    private MongoTemplate mongoTemplate;

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
    }
}
