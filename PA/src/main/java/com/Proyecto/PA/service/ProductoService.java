package com.Proyecto.PA.service;

import com.Proyecto.PA.model.Producto;
import com.Proyecto.PA.repository.ProductoRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
public class ProductoService implements CommandLineRunner {

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public void run(String... args) throws Exception {
        // Solo cargar productos si la base de datos está vacía
        if (productoRepository.count() == 0) {
            cargarProductosDesdeJSON();
        }
    }

    public void cargarProductosDesdeJSON() {
        try {
            // Cargar el archivo JSON desde resources
            ObjectMapper mapper = new ObjectMapper();
            InputStream inputStream = new ClassPathResource("static/js/productos.json").getInputStream();
            
            // Convertir el JSON a una lista de Productos
            List<Producto> productos = mapper.readValue(inputStream, new TypeReference<List<Producto>>() {});
            
            // Guardar todos los productos en la base de datos
            productoRepository.saveAll(productos);
            
            System.out.println("Se cargaron " + productos.size() + " productos desde el JSON.");
        } catch (Exception e) {
            System.err.println("Error al cargar productos desde JSON: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
