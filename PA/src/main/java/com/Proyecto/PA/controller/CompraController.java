package com.Proyecto.PA.controller;


import java.util.Date;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Proyecto.PA.model.Compra;
import com.Proyecto.PA.repository.CompraRepository;

@RestController
@RequestMapping("/api/compras")
@CrossOrigin("*")
public class CompraController {

    private final CompraRepository compraRepository;

    public CompraController(CompraRepository compraRepository) {
        this.compraRepository = compraRepository;
    }

    @PostMapping
    public Compra registrarCompra(@RequestBody Compra compra) {
        // Establecer la fecha actual si no se proporciona
        if (compra.getFecha() == null) {
            compra.setFecha(new Date());
        }
        return compraRepository.save(compra);
    }

    @GetMapping
    public List<Compra> listarCompras() {
        return compraRepository.findAll();
    }
}

