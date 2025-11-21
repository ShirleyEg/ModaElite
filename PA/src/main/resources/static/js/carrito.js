// Variables globales
let productosEnCarrito = [];
const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

// Elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Nuevos elementos para la pasarela de pago
const contenedorPasarelaPago = document.querySelector("#pasarela-pago");
const btnProcesarPago = document.querySelector("#btn-procesar-pago");

// Función para mostrar carrito vacío
function mostrarCarritoVacio() {
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
    contenedorPasarelaPago.classList.add("disabled");
}

// Cargar productos del carrito desde localStorage
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cargando carrito...');
    
    // Intentar obtener productos del localStorage
    const productosGuardados = localStorage.getItem("productos-en-carrito");
    
    if (productosGuardados && JSON.parse(productosGuardados).length > 0) {
        console.log('Productos encontrados en localStorage');
        productosEnCarrito = JSON.parse(productosGuardados);
        cargarProductosCarrito();
    } else {
        console.log('No hay productos en el carrito');
        mostrarCarritoVacio();
        
        // Mostrar mensaje al usuario
        Toastify({
            text: "Tu carrito está vacío. ¡Agrega productos desde la página principal!",
            duration: 5000,
            close: true,
            gravity: "top",
            position: "center",
            style: {
                background: "#4b33a8",
            }
        }).showToast();
    }
});

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
        contenedorPasarelaPago.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            contenedorCarritoProductos.append(div);
        })
    
    actualizarBotonesEliminar();
    actualizarTotal();
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
        contenedorPasarelaPago.classList.add("disabled");
    }

}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem' 
          },
        onClick: function(){} 
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    // Verificar si hay productos en el carrito
    if (productosEnCarrito.length === 0) {
        Toastify({
            text: "No hay productos en el carrito",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            style: {
                background: "#ff0000",
            }
        }).showToast();
        return;
    }

    // Verificar si el usuario está autenticado
    if (!usuarioActual) {
        Swal.fire({
            title: 'Inicia sesión',
            text: 'Debes iniciar sesión para realizar una compra',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ir a iniciar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Guardar el carrito actual en localStorage para recuperarlo después del login
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                window.location.href = '/inicioSesion';
            }
        });
        return;
    }

    // Mostrar confirmación
    Swal.fire({
        title: '¿Confirmar compra?',
        icon: 'question',
        html: `Total a pagar: $${productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0)}`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí, comprar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Mostrar la pasarela de pago
            mostrarPasarelaPago();
        }
    });
}

// Función para mostrar la pasarela de pago
function mostrarPasarelaPago() {
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorPasarelaPago.classList.remove("disabled");
    
    // Scroll hacia la pasarela de pago
    contenedorPasarelaPago.scrollIntoView({ behavior: 'smooth' });
}

// Evento para procesar el pago
btnProcesarPago.addEventListener("click", procesarPago);

function procesarPago() {
    // Obtener valores del formulario
    const nombreTarjeta = document.getElementById("nombre-tarjeta").value;
    const numeroTarjeta = document.getElementById("numero-tarjeta").value;
    const fechaExp = document.getElementById("fecha-exp").value;
    const cvv = document.getElementById("cvv").value;
    
    // Validaciones básicas
    if (!nombreTarjeta || !numeroTarjeta || !fechaExp || !cvv) {
        Toastify({
            text: "Por favor completa todos los campos",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            style: {
                background: "#ff0000",
            }
        }).showToast();
        return;
    }
    
    // Simular proceso de pago
    Swal.fire({
        title: 'Procesando pago...',
        html: 'Por favor espera mientras procesamos tu pago',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        didOpen: () => {
            Swal.showLoading();
            
            // Simular demora de procesamiento
            setTimeout(() => {
                // Preparar datos para la API
                const compra = {
                    usuarioId: usuarioActual.id,
                    productos: productosEnCarrito.map(producto => ({
                        productoId: producto.id,
                        cantidad: producto.cantidad
                    })),
                    total: productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0)
                };

                // Enviar a la API
                fetch('/api/compras', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(compra)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al procesar la compra');
                    }
                    return response.json();
                })
                .then(data => {
                    // Compra exitosa
                    Swal.fire({
                        title: '¡Pago procesado con éxito!',
                        icon: 'success',
                        html: `Tu compra ha sido registrada. Puedes ver los detalles en tu historial de compras.`,
                        confirmButtonText: 'Ver historial',
                        showCancelButton: true,
                        cancelButtonText: 'Seguir comprando'
                    }).then((result) => {
                        // Limpiar carrito
                        productosEnCarrito.length = 0;
                        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                        
                        if (result.isConfirmed) {
                            // Ir al historial
                            window.location.href = '/historial';
                        } else {
                            // Actualizar vista del carrito
                            contenedorCarritoVacio.classList.remove("disabled");
                            contenedorCarritoProductos.classList.add("disabled");
                            contenedorCarritoAcciones.classList.add("disabled");
                            contenedorCarritoComprado.classList.add("disabled");
                            contenedorPasarelaPago.classList.add("disabled");
                            
                            // Redirigir a la página principal
                            window.location.href = '/home';
                        }
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al procesar tu pago. Inténtalo de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                });
            }, 2000); // Simular 2 segundos de procesamiento
        }
    });
}