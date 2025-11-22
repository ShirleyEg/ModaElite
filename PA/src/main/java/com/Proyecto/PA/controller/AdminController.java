package com.Proyecto.PA.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Proyecto.PA.model.Usuario;
import com.Proyecto.PA.model.Producto;
import com.Proyecto.PA.model.Compra;
import com.Proyecto.PA.repository.UsuarioRepository;
import com.Proyecto.PA.repository.ProductoRepository;
import com.Proyecto.PA.repository.CompraRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {
    
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final CompraRepository compraRepository;
    
    public AdminController(UsuarioRepository usuarioRepository, ProductoRepository productoRepository, CompraRepository compraRepository) {
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.compraRepository = compraRepository;
    }
    
    // Endpoint para verificar si un usuario es administrador
    @GetMapping("/verificar-admin")
    public ResponseEntity<?> verificarAdmin(@RequestHeader("Authorization") String token) {
        try {
            // En un entorno real, aquí se verificaría el token JWT
            // Por ahora, vamos a simular la verificación con un usuario de prueba
            // En este ejemplo simple, vamos a verificar si el correo del usuario es "admin@modaelite.com"
            
            // Para propósitos de demostración, vamos a permitir el acceso si se proporciona
            // un encabezado especial o si el usuario tiene rol "administrador"
            
            Map<String, Object> response = new HashMap<>();
            response.put("esAdmin", false);
            response.put("mensaje", "Acceso denegado. Se requiere rol de administrador.");
            
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al verificar permisos de administrador");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Endpoint para obtener estadísticas del sistema (solo para administradores)
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticas() {
        try {
            // Simular algunas estadísticas
            Map<String, Object> estadisticas = new HashMap<>();
            estadisticas.put("totalUsuarios", usuarioRepository.count());
            estadisticas.put("totalProductos", productoRepository.count());
            estadisticas.put("totalVentas", compraRepository.count());
            
            Map<String, Object> response = new HashMap<>();
            response.put("estadisticas", estadisticas);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener estadísticas");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // ============ GESTIÓN DE USUARIOS ============
    
    // Obtener todos los usuarios
    @GetMapping("/usuarios")
    public ResponseEntity<?> obtenerUsuarios() {
        try {
            List<Usuario> usuarios = usuarioRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("usuarios", usuarios);
            response.put("total", usuarios.size());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener usuarios");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Obtener un usuario por ID
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> obtenerUsuario(@PathVariable String id) {
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(id);
            if (usuario.isPresent()) {
                return new ResponseEntity<>(usuario.get(), HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Usuario no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener usuario");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Actualizar un usuario
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable String id, @RequestBody Usuario usuarioActualizado) {
        try {
            Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
            if (usuarioOptional.isPresent()) {
                Usuario usuario = usuarioOptional.get();
                if (usuarioActualizado.getNombre() != null) {
                    usuario.setNombre(usuarioActualizado.getNombre());
                }
                if (usuarioActualizado.getCorreo() != null) {
                    usuario.setCorreo(usuarioActualizado.getCorreo());
                }
                if (usuarioActualizado.getDireccion() != null) {
                    usuario.setDireccion(usuarioActualizado.getDireccion());
                }
                if (usuarioActualizado.getTelefono() != null) {
                    usuario.setTelefono(usuarioActualizado.getTelefono());
                }
                if (usuarioActualizado.getRol() != null) {
                    usuario.setRol(usuarioActualizado.getRol());
                }
                Usuario usuarioGuardado = usuarioRepository.save(usuario);
                return new ResponseEntity<>(usuarioGuardado, HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Usuario no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al actualizar usuario");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Eliminar un usuario
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable String id) {
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(id);
            if (usuario.isPresent()) {
                usuarioRepository.deleteById(id);
                Map<String, String> response = new HashMap<>();
                response.put("mensaje", "Usuario eliminado correctamente");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Usuario no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al eliminar usuario");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // ============ GESTIÓN DE PRODUCTOS ============
    
    // Obtener todos los productos
    @GetMapping("/productos")
    public ResponseEntity<?> obtenerProductos() {
        try {
            List<Producto> productos = productoRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("productos", productos);
            response.put("total", productos.size());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener productos");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Obtener un producto por ID
    @GetMapping("/productos/{id}")
    public ResponseEntity<?> obtenerProducto(@PathVariable String id) {
        try {
            Optional<Producto> producto = productoRepository.findById(id);
            if (producto.isPresent()) {
                return new ResponseEntity<>(producto.get(), HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Producto no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener producto");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Crear un nuevo producto
    @PostMapping("/productos")
    public ResponseEntity<?> crearProducto(@RequestBody Producto producto) {
        try {
            Producto productoGuardado = productoRepository.save(producto);
            return new ResponseEntity<>(productoGuardado, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al crear producto");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Actualizar un producto
    @PutMapping("/productos/{id}")
    public ResponseEntity<?> actualizarProducto(@PathVariable String id, @RequestBody Producto productoActualizado) {
        try {
            Optional<Producto> productoOptional = productoRepository.findById(id);
            if (productoOptional.isPresent()) {
                Producto producto = productoOptional.get();
                if (productoActualizado.getTitulo() != null) {
                    producto.setTitulo(productoActualizado.getTitulo());
                }
                if (productoActualizado.getImagen() != null) {
                    producto.setImagen(productoActualizado.getImagen());
                }
                if (productoActualizado.getCategoria() != null) {
                    producto.setCategoria(productoActualizado.getCategoria());
                }
                if (productoActualizado.getPrecio() > 0) {
                    producto.setPrecio(productoActualizado.getPrecio());
                }
                Producto productoGuardado = productoRepository.save(producto);
                return new ResponseEntity<>(productoGuardado, HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Producto no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al actualizar producto");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Eliminar un producto
    @DeleteMapping("/productos/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable String id) {
        try {
            Optional<Producto> producto = productoRepository.findById(id);
            if (producto.isPresent()) {
                productoRepository.deleteById(id);
                Map<String, String> response = new HashMap<>();
                response.put("mensaje", "Producto eliminado correctamente");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Producto no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al eliminar producto");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // ============ GESTIÓN DE VENTAS/COMPRAS ============
    
    // Obtener todas las compras/ventas
    @GetMapping("/ventas")
    public ResponseEntity<?> obtenerVentas() {
        try {
            List<Compra> compras = compraRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("ventas", compras);
            response.put("total", compras.size());
            
            // Calcular ingresos totales
            double ingresosTotales = compras.stream().mapToDouble(Compra::getTotal).sum();
            response.put("ingresosTotales", ingresosTotales);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener ventas");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Obtener una compra por ID
    @GetMapping("/ventas/{id}")
    public ResponseEntity<?> obtenerVenta(@PathVariable String id) {
        try {
            Optional<Compra> compra = compraRepository.findById(id);
            if (compra.isPresent()) {
                return new ResponseEntity<>(compra.get(), HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Venta no encontrada");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener venta");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Obtener ventas por usuario
    @GetMapping("/ventas/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerVentasPorUsuario(@PathVariable String usuarioId) {
        try {
            List<Compra> compras = compraRepository.findByUsuarioId(usuarioId);
            Map<String, Object> response = new HashMap<>();
            response.put("ventas", compras);
            response.put("total", compras.size());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al obtener ventas del usuario");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}