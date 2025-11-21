package com.Proyecto.PA.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VistaController {

    @GetMapping("/")
    public String inicio() {
        return "home"; // Retorna home.html
    }
    
    @GetMapping("/home")
    public String home() {
        return "index"; // Spring busca "index.html" en /templates
    }

    @GetMapping("/registro")
    public String registro() {
        return "registro"; // busca registro.html en /templates
    }

    @GetMapping("/inicioSesion")
    public String inicioSesion() {
        return "inicioSesion"; // busca inicioSesion.html en /templates
    }

    @GetMapping("/carrito")
    public String carrito() {
        return "carrito"; // busca carrito.html en /templates
    }

    @GetMapping("/historial")
    public String historial() {
        return "historial"; // busca historial.html en /templates
    }
}
