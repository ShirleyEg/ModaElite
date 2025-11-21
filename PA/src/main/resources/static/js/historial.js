document.addEventListener('DOMContentLoaded', () => {
    const tablaCompras = document.getElementById('tabla-compras');
    const sinCompras = document.getElementById('sin-compras');
    const modal = document.getElementById('detallesModal');
    const closeModal = document.querySelector('.close');
    const detallesContenido = document.getElementById('detalles-contenido');
    
    // Verificar si el usuario está autenticado
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    
    if (!usuarioActual) {
        // Mostrar mensaje si no hay usuario autenticado
        document.querySelector('.tabla-historial').style.display = 'none';
        sinCompras.style.display = 'block';
        sinCompras.innerHTML = '<p>Debes iniciar sesión para ver tu historial de compras. <a href="/inicioSesion" class="btn btn-primary">Iniciar sesión</a></p>';
        return;
    }
    
    // Función para formatear la fecha
    function formatearFecha(fecha) {
        if (!fecha) return 'Fecha no disponible';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Función para generar factura en formato PDF (simulación)
    function generarFactura(compra, productosMap) {
        // Crear contenido de la factura
        let contenidoFactura = `
            FACTURA DE COMPRA
            ==================
            
            Fecha: ${formatearFecha(compra.fecha || new Date())}
            Número de factura: ${compra.id}
            
            Detalles del cliente:
            ID de cliente: ${usuarioActual.id}
            Nombre: ${usuarioActual.nombre || 'No especificado'}
            
            Productos:
            ------------------
        `;
        
        let total = 0;
        compra.productos.forEach(item => {
            const producto = productosMap[item.productoId];
            if (producto) {
                const subtotal = producto.precio * item.cantidad;
                contenidoFactura += `
                - ${producto.nombre}
                  Cantidad: ${item.cantidad}
                  Precio unitario: $${producto.precio.toFixed(2)}
                  Subtotal: $${subtotal.toFixed(2)}
                `;
                total += subtotal;
            }
        });
        
        contenidoFactura += `
            ------------------
            Total: $${total.toFixed(2)}
            
            ¡Gracias por su compra!
        `;
        
        // Crear elemento de descarga
        const elementoDescarga = document.createElement('a');
        elementoDescarga.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenidoFactura));
        elementoDescarga.setAttribute('download', `factura_${compra.id}.txt`);
        
        elementoDescarga.style.display = 'none';
        document.body.appendChild(elementoDescarga);
        
        elementoDescarga.click();
        
        document.body.removeChild(elementoDescarga);
        
        // Mostrar mensaje de éxito
        Toastify({
            text: "Factura generada correctamente",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#28a745",
        }).showToast();
    }
    
    // Cargar las compras desde la API
    fetch('/api/compras')
        .then(response => response.json())
        .then(compras => {
            // Filtrar compras del usuario actual
            const comprasUsuario = compras.filter(compra => compra.usuarioId === usuarioActual.id);
            
            if (comprasUsuario.length === 0) {
                // Mostrar mensaje si no hay compras
                sinCompras.style.display = 'block';
                document.querySelector('.tabla-historial').style.display = 'none';
            } else {
                // Cargar los datos de productos para mostrar nombres
                fetch('/api/productos')
                    .then(response => response.json())
                    .then(productos => {
                        // Crear un mapa de productos para acceso rápido
                        const productosMap = {};
                        productos.forEach(producto => {
                            productosMap[producto.id] = producto;
                        });
                        
                        // Mostrar las compras en la tabla
                        comprasUsuario.forEach(compra => {
                            // Calcular cantidad total de productos
                            const cantidadTotal = compra.productos.reduce((total, item) => total + item.cantidad, 0);
                            
                            // Crear fila de la tabla
                            const fila = document.createElement('tr');
                            fila.innerHTML = `
                                <td>${formatearFecha(compra.fecha || new Date())}</td>
                                <td>${compra.productos.length} productos diferentes</td>
                                <td>${cantidadTotal} items</td>
                                <td>$${compra.total.toFixed(2)}</td>
                                <td>
                                    <button class="btn-detalles" data-compra-id="${compra.id}">Ver detalles</button>
                                    <button class="btn-factura" data-compra-id="${compra.id}">Generar factura</button>
                                </td>
                            `;
                            
                            tablaCompras.appendChild(fila);
                            
                            // Agregar evento al botón de detalles
                            const btnDetalles = fila.querySelector('.btn-detalles');
                            btnDetalles.addEventListener('click', () => {
                                // Mostrar detalles de la compra en el modal
                                detallesContenido.innerHTML = `
                                    <p><strong>Fecha:</strong> ${formatearFecha(compra.fecha || new Date())}</p>
                                    <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
                                    <h4>Productos:</h4>
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio unitario</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${compra.productos.map(item => {
                                                const producto = productosMap[item.productoId];
                                                if (!producto) return '';
                                                return `
                                                    <tr>
                                                        <td>${producto.nombre}</td>
                                                        <td>${item.cantidad}</td>
                                                        <td>$${producto.precio.toFixed(2)}</td>
                                                        <td>$${(producto.precio * item.cantidad).toFixed(2)}</td>
                                                    </tr>
                                                `;
                                            }).join('')}
                                        </tbody>
                                    </table>
                                `;
                                
                                // Mostrar el modal
                                modal.style.display = 'block';
                            });
                            
                            // Agregar evento al botón de factura
                            const btnFactura = fila.querySelector('.btn-factura');
                            btnFactura.addEventListener('click', () => {
                                generarFactura(compra, productosMap);
                            });
                        });
                    })
                    .catch(error => {
                        console.error('Error al cargar productos:', error);
                        Toastify({
                            text: "Error al cargar los detalles de los productos",
                            duration: 3000,
                            close: true,
                            gravity: "top",
                            position: "center",
                            backgroundColor: "#ff0000",
                        }).showToast();
                    });
            }
        })
        .catch(error => {
            console.error('Error al cargar compras:', error);
            Toastify({
                text: "Error al cargar el historial de compras",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "#ff0000",
            }).showToast();
        });
    
    // Cerrar el modal cuando se hace clic en la X
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Cerrar el modal cuando se hace clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});