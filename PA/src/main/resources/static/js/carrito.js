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
document.addEventListener("DOMContentLoaded", function () {
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
    
    // Evento para el selector de fecha (dentro de DOMContentLoaded para asegurar que el elemento exista)
    document.getElementById("selector-fecha").addEventListener("click", function() {
        // Crear un calendario personalizado simple
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        
        // Crear un mensaje de selección simple
        let options = '<option value="">Selecciona una fecha</option>';
        
        // Generar opciones para los próximos 10 años
        for (let year = currentYear; year <= currentYear + 10; year++) {
            for (let month = 1; month <= 12; month++) {
                // Solo mostrar meses futuros para el año actual
                if (year === currentYear && month < currentMonth) continue;
                
                const monthStr = String(month).padStart(2, '0');
                const yearStr = String(year).slice(-2);
                options += `<option value="${monthStr}/${yearStr}">${monthStr}/${yearStr}</option>`;
            }
        }
        
        // Mostrar selector con SweetAlert
        Swal.fire({
            title: 'Selecciona la fecha de expiración',
            html: `
                <select id="swal-select-date" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
                    ${options}
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: 'Seleccionar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const selectedDate = document.getElementById('swal-select-date').value;
                if (!selectedDate) {
                    Swal.showValidationMessage('Por favor selecciona una fecha');
                    return false;
                }
                return selectedDate;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById("fecha-exp").value = result.value;
                // Remover el borde rojo si había un error previo
                document.getElementById("fecha-exp").style.borderColor = "#ced4da";
            }
        });
    });
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
    const nombreTarjeta = document.getElementById("nombre-tarjeta").value.trim();
    const numeroTarjeta = document.getElementById("numero-tarjeta").value.trim();
    const fechaExp = document.getElementById("fecha-exp").value.trim();
    const cvv = document.getElementById("cvv").value.trim();
    
    // Validaciones específicas para cada campo
    let errores = [];
    
    // Validar nombre en la tarjeta
    if (!nombreTarjeta) {
        errores.push("El nombre en la tarjeta es obligatorio");
        document.getElementById("nombre-tarjeta").style.borderColor = "#ff0000";
    } else {
        document.getElementById("nombre-tarjeta").style.borderColor = "#ced4da";
    }
    
    // Validar número de tarjeta (16 dígitos)
    const numeroTarjetaLimpio = numeroTarjeta.replace(/\s/g, '');
    if (!numeroTarjeta) {
        errores.push("El número de tarjeta es obligatorio");
        document.getElementById("numero-tarjeta").style.borderColor = "#ff0000";
    } else if (!/^\d{16}$/.test(numeroTarjetaLimpio)) {
        errores.push("El número de tarjeta debe tener 16 dígitos");
        document.getElementById("numero-tarjeta").style.borderColor = "#ff0000";
    } else {
        document.getElementById("numero-tarjeta").style.borderColor = "#ced4da";
    }
    
    // Validar fecha de expiración (MM/AA)
    if (!fechaExp) {
        errores.push("La fecha de expiración es obligatoria");
        document.getElementById("fecha-exp").style.borderColor = "#ff0000";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaExp)) {
        errores.push("La fecha de expiración debe tener el formato MM/AA");
        document.getElementById("fecha-exp").style.borderColor = "#ff0000";
    } else {
        // Verificar que la fecha no haya expirado
        const partes = fechaExp.split('/');
        const mes = parseInt(partes[0], 10);
        const anio = parseInt(partes[1], 10) + 2000; // Convertir AA a AAAA
        const fechaActual = new Date();
        const anioActual = fechaActual.getFullYear();
        const mesActual = fechaActual.getMonth() + 1;
        
        if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
            errores.push("La tarjeta ha expirado");
            document.getElementById("fecha-exp").style.borderColor = "#ff0000";
        } else {
            document.getElementById("fecha-exp").style.borderColor = "#ced4da";
        }
    }
    
    // Validar CVV (3 dígitos)
    if (!cvv) {
        errores.push("El CVV es obligatorio");
        document.getElementById("cvv").style.borderColor = "#ff0000";
    } else if (!/^\d{3}$/.test(cvv)) {
        errores.push("El CVV debe tener 3 dígitos");
        document.getElementById("cvv").style.borderColor = "#ff0000";
    } else {
        document.getElementById("cvv").style.borderColor = "#ced4da";
    }
    
    // Mostrar errores si los hay
    if (errores.length > 0) {
        Toastify({
            text: errores.join(". ") + ".",
            duration: 5000,
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