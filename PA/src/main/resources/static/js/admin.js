document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario es administrador
    verificarAccesoAdmin();
    
    // Configurar botón de cierre de sesión
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            // Eliminar datos de usuario al cerrar sesión
            localStorage.removeItem("usuarioActual");
            
            // Redirigir a la página de inicio de sesión
            window.location.href = "/inicioSesion";
        });
    }
    
    // Configurar navegación entre secciones
    configurarNavegacion();
    
    // Configurar búsqueda de productos
    configurarBusquedaProductos();
    
    // Configurar botones del menú
    configurarBotonesMenu();
    
    // Configurar modal de productos
    configurarModal();
    
    // Cargar datos iniciales
    cargarEstadisticas();
    mostrarSeccionDashboard();
});

function verificarAccesoAdmin() {
    const usuarioGuardado = localStorage.getItem("usuarioActual");
    
    if (!usuarioGuardado) {
        // No hay usuario en sesión, redirigir a inicio de sesión
        window.location.href = "/inicioSesion";
        return;
    }
    
    const usuario = JSON.parse(usuarioGuardado);
    
    // Verificar si el usuario tiene rol de administrador
    if (usuario.rol !== "administrador") {
        // No es administrador, mostrar mensaje y redirigir
        Toastify({
            text: "Acceso denegado. Necesitas permisos de administrador.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            style: {
                background: "#dc3545",
            }
        }).showToast();
        
        // Redirigir a la página principal después de 3 segundos
        setTimeout(() => {
            window.location.href = "/home";
        }, 3000);
        
        return;
    }
    
    // Es administrador, mostrar el panel
    console.log("Acceso de administrador verificado");
    document.getElementById('admin-welcome').textContent = `Bienvenido, ${usuario.nombre || usuario.correo}`;
}

// ============ CONFIGURACIÓN DE MENÚ ============

function configurarBotonesMenu() {
    const btnDashboard = document.getElementById('dashboard');
    const btnUsuarios = document.getElementById('usuarios');
    const btnProductos = document.getElementById('productos');
    const btnVentas = document.getElementById('ventas');
    const btnNuevoProducto = document.getElementById('btn-nuevo-producto');
    const btnVerVentas = document.getElementById('btn-ver-ventas');
    const btnGestionarUsuarios = document.getElementById('btn-gestionar-usuarios');
    
    if (btnDashboard) btnDashboard.addEventListener('click', mostrarSeccionDashboard);
    if (btnUsuarios) btnUsuarios.addEventListener('click', mostrarSeccionUsuarios);
    if (btnProductos) btnProductos.addEventListener('click', mostrarSeccionProductos);
    if (btnVentas) btnVentas.addEventListener('click', mostrarSeccionVentas);
    if (btnNuevoProducto) btnNuevoProducto.addEventListener('click', abrirModalProducto);
    if (btnVerVentas) btnVerVentas.addEventListener('click', mostrarSeccionVentas);
    if (btnGestionarUsuarios) btnGestionarUsuarios.addEventListener('click', mostrarSeccionUsuarios);
}

function configurarNavegacion() {
    // Esta función configura la navegación entre secciones
    // Se llama después de que se hayan cargado los elementos del DOM
}

function ocultarTodasLasSecciones() {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.style.display = 'none');
    
    // Desactivar todos los botones del menú
    const botones = document.querySelectorAll('.boton-categoria');
    botones.forEach(boton => boton.classList.remove('active'));
}

function mostrarSeccionDashboard() {
    ocultarTodasLasSecciones();
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('section-usuarios').style.display = 'block';
    cargarEstadisticas();
    cargarUsuarios();
}

function mostrarSeccionUsuarios() {
    ocultarTodasLasSecciones();
    document.getElementById('usuarios').classList.add('active');
    document.getElementById('section-usuarios').style.display = 'block';
    cargarUsuarios();
}

function mostrarSeccionProductos() {
    ocultarTodasLasSecciones();
    document.getElementById('productos').classList.add('active');
    document.getElementById('section-productos').style.display = 'block';
    cargarProductos();
}

function mostrarSeccionVentas() {
    ocultarTodasLasSecciones();
    document.getElementById('ventas').classList.add('active');
    document.getElementById('section-ventas').style.display = 'block';
    cargarVentas();
}

// ============ FUNCIONES DE ESTADÍSTICAS ============

function cargarEstadisticas() {
    // Hacer una llamada AJAX al backend para obtener estadísticas reales
    fetch('/api/admin/estadisticas')
        .then(response => response.json())
        .then(data => {
            if (data.estadisticas) {
                document.getElementById('total-usuarios').textContent = data.estadisticas.totalUsuarios || '0';
                document.getElementById('total-productos').textContent = data.estadisticas.totalProductos || '0';
                document.getElementById('total-ventas').textContent = data.estadisticas.totalVentas || '0';
            } else {
                // Valores por defecto si hay un error
                document.getElementById('total-usuarios').textContent = '25';
                document.getElementById('total-productos').textContent = '42';
                document.getElementById('total-ventas').textContent = '18';
            }
        })
        .catch(error => {
            console.error('Error al cargar estadísticas:', error);
            // Valores por defecto si hay un error
            document.getElementById('total-usuarios').textContent = '25';
            document.getElementById('total-productos').textContent = '42';
            document.getElementById('total-ventas').textContent = '18';
        });
}

// Funciones para los botones restaurados
function verUsuarios() {
    // Mostrar sección de usuarios
    mostrarSeccionUsuarios();
    // Activar el botón del menú
    document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
    document.getElementById('usuarios').classList.add('active');
}

function verProductos() {
    // Mostrar sección de productos
    mostrarSeccionProductos();
    // Activar el botón del menú
    document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
    document.getElementById('productos').classList.add('active');
}

function agregarProducto() {
    abrirModalProducto();
}

function verVentas() {
    // Mostrar sección de ventas
    mostrarSeccionVentas();
    // Activar el botón del menú
    document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
    document.getElementById('ventas').classList.add('active');
}

function generarReporte() {
    Toastify({
        text: "Generando reporte de ventas...",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        style: {
            background: "#28a745",
        }
    }).showToast();
    
    // Simular generación de reporte
    setTimeout(() => {
        Toastify({
            text: "Reporte generado exitosamente",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            style: {
                background: "#28a745",
            }
        }).showToast();
    }, 2000);
}

// ============ FUNCIONES DE USUARIOS ============

function cargarUsuarios() {
    // Hacer una llamada AJAX al backend para obtener usuarios reales
    fetch('/api/admin/usuarios')
        .then(response => response.json())
        .then(data => {
            if (data.usuarios) {
                const userListBody = document.getElementById('user-list-body');
                userListBody.innerHTML = '';
                
                data.usuarios.forEach(usuario => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${usuario.nombre || 'Sin nombre'}</td>
                        <td>${usuario.correo || 'Sin correo'}</td>
                        <td><span class="role-badge ${usuario.rol === 'administrador' ? 'role-admin' : 'role-user'}">${usuario.rol || 'usuario'}</span></td>
                        <td>
                            <button class="boton-menu" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-right: 0.5rem;" onclick="editarUsuario('${usuario.id}')">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="boton-menu" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background: #dc3545;" onclick="eliminarUsuario('${usuario.id}', '${usuario.nombre}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
                    userListBody.appendChild(row);
                });
            } else {
                // Mostrar mensaje si no hay usuarios
                const userListBody = document.getElementById('user-list-body');
                userListBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No se encontraron usuarios</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al cargar usuarios:', error);
            // Mostrar mensaje de error
            const userListBody = document.getElementById('user-list-body');
            userListBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Error al cargar usuarios</td></tr>';
        });
}

function editarUsuario(usuarioId) {
    Toastify({
        text: "Función de editar usuario en desarrollo",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        style: {
            background: "#ffc107",
        }
    }).showToast();
}

function eliminarUsuario(usuarioId, nombreUsuario) {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${nombreUsuario}?`)) {
        // Hacer una llamada AJAX al backend para eliminar el usuario
        fetch(`/api/admin/usuarios/${usuarioId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje) {
                Toastify({
                    text: data.mensaje,
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "center",
                    style: {
                        background: "#28a745",
                    }
                }).showToast();
                
                // Recargar la lista de usuarios
                cargarUsuarios();
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        })
        .catch(error => {
            console.error('Error al eliminar usuario:', error);
            Toastify({
                text: "Error al eliminar el usuario",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                style: {
                    background: "#dc3545",
                }
            }).showToast();
        });
    }
}

// ============ FUNCIONES DE PRODUCTOS ============

function cargarProductos() {
    // Hacer una llamada AJAX al backend para obtener productos reales
    fetch('/api/admin/productos')
        .then(response => response.json())
        .then(data => {
            if (data.productos) {
                const productListBody = document.getElementById('product-list-body');
                productListBody.innerHTML = '';
                
                data.productos.forEach(producto => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${producto.titulo || 'Sin título'}</td>
                        <td>${producto.categoria && producto.categoria.nombre ? producto.categoria.nombre : 'Sin categoría'}</td>
                        <td>$${producto.precio ? producto.precio.toFixed(2) : '0.00'}</td>
                        <td>
                            <button class="boton-menu" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-right: 0.5rem;" onclick="editarProducto('${producto.id}')">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="boton-menu" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background: #dc3545;" onclick="eliminarProducto('${producto.id}', '${producto.titulo}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
                    productListBody.appendChild(row);
                });
            } else {
                // Mostrar mensaje si no hay productos
                const productListBody = document.getElementById('product-list-body');
                productListBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No se encontraron productos</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            // Mostrar mensaje de error
            const productListBody = document.getElementById('product-list-body');
            productListBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Error al cargar productos</td></tr>';
        });
}

function configurarBusquedaProductos() {
    const searchInput = document.getElementById('search-productos');
    const searchBtn = document.getElementById('btn-buscar-productos');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase();
            buscarProductos(searchTerm);
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.toLowerCase();
                buscarProductos(searchTerm);
            }
        });
    }
}

function buscarProductos(termino) {
    // Hacer una llamada AJAX al backend con el término de búsqueda
    fetch(`/api/admin/productos`)
        .then(response => response.json())
        .then(data => {
            if (data.productos) {
                const productListBody = document.getElementById('product-list-body');
                productListBody.innerHTML = '';
                
                // Filtrar productos basados en el término de búsqueda
                const resultados = data.productos.filter(producto => 
                    producto.titulo && producto.titulo.toLowerCase().includes(termino)
                );
                
                if (resultados.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td colspan="4" style="text-align: center;">No se encontraron productos</td>`;
                    productListBody.appendChild(row);
                    return;
                }
                
                resultados.forEach(producto => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${producto.titulo || 'Sin título'}</td>
                        <td>${producto.categoria && producto.categoria.nombre ? producto.categoria.nombre : 'Sin categoría'}</td>
                        <td>$${producto.precio ? producto.precio.toFixed(2) : '0.00'}</td>
                        <td>
                            <button class="boton-menu" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-right: 0.5rem;" onclick="editarProducto('${producto.id}')">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="boton-menu" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background: #dc3545;" onclick="eliminarProducto('${producto.id}', '${producto.titulo}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
                    productListBody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error al buscar productos:', error);
            const productListBody = document.getElementById('product-list-body');
            productListBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Error al buscar productos</td></tr>';
        });
}

function configurarModal() {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const btnNuevoProductoModal = document.getElementById('btn-nuevo-producto-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (btnNuevoProductoModal) {
        btnNuevoProductoModal.addEventListener('click', abrirModalProducto);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (form) {
        form.addEventListener('submit', guardarProducto);
    }
    
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

function abrirModalProducto() {
    const modal = document.getElementById('product-modal');
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.querySelector('.modal-content h2').textContent = 'Crear Nuevo Producto';
    modal.style.display = 'block';
}

function editarProducto(productoId) {
    // Hacer una llamada AJAX al backend para obtener los datos del producto
    fetch(`/api/admin/productos/${productoId}`)
        .then(response => response.json())
        .then(producto => {
            // Llenar el formulario con los datos del producto
            document.getElementById('product-id').value = producto.id || '';
            document.getElementById('product-titulo').value = producto.titulo || '';
            document.getElementById('product-precio').value = producto.precio || '';
            document.getElementById('product-categoria').value = producto.categoria && producto.categoria.nombre ? producto.categoria.nombre : '';
            document.getElementById('product-imagen').value = producto.imagen || '';
            
            // Cambiar el título del modal
            document.querySelector('.modal-content h2').textContent = 'Editar Producto';
            
            // Mostrar el modal
            document.getElementById('product-modal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar producto:', error);
            Toastify({
                text: "Error al cargar los datos del producto",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                style: {
                    background: "#dc3545",
                }
            }).showToast();
        });
}

function guardarProducto(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const form = document.getElementById('product-form');
    const formData = new FormData(form);
    
    const producto = {
        titulo: formData.get('titulo'),
        precio: parseFloat(formData.get('precio')),
        categoria: { nombre: formData.get('categoria') },
        imagen: formData.get('imagen')
    };
    
    // Obtener ID si es una edición
    const productoId = document.getElementById('product-id').value;
    
    // Determinar si es una creación o actualización
    const isUpdate = productoId && productoId.trim() !== '';
    
    // Configurar la URL y el método HTTP
    const url = isUpdate ? `/api/admin/productos/${productoId}` : '/api/admin/productos';
    const method = isUpdate ? 'PUT' : 'POST';
    
    // Hacer la llamada al backend
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
        if (data.id || data.titulo) {
            Toastify({
                text: `Producto ${isUpdate ? 'actualizado' : 'creado'} exitosamente`,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                style: {
                    background: "#28a745",
                }
            }).showToast();
            
            // Cerrar el modal
            document.getElementById('product-modal').style.display = 'none';
            
            // Recargar la lista de productos
            cargarProductos();
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    })
    .catch(error => {
        console.error('Error al guardar producto:', error);
        Toastify({
            text: `Error al ${isUpdate ? 'actualizar' : 'crear'} el producto`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            style: {
                background: "#dc3545",
            }
        }).showToast();
    });
}

function eliminarProducto(productoId, nombreProducto) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${nombreProducto}"?`)) {
        // Hacer una llamada AJAX al backend para eliminar el producto
        fetch(`/api/admin/productos/${productoId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje) {
                Toastify({
                    text: data.mensaje,
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "center",
                    style: {
                        background: "#28a745",
                    }
                }).showToast();
                
                // Recargar la lista de productos
                cargarProductos();
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        })
        .catch(error => {
            console.error('Error al eliminar producto:', error);
            Toastify({
                text: "Error al eliminar el producto",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                style: {
                    background: "#dc3545",
                }
            }).showToast();
        });
    }
}

// ============ FUNCIONES DE VENTAS ============

function cargarVentas() {
    // Hacer una llamada AJAX al backend para obtener ventas reales
    fetch('/api/admin/ventas')
        .then(response => response.json())
        .then(data => {
            if (data.ventas) {
                const salesListBody = document.getElementById('sales-list-body');
                salesListBody.innerHTML = '';
                
                data.ventas.forEach(venta => {
                    // Formatear fecha
                    const fecha = venta.fecha ? new Date(venta.fecha).toLocaleDateString('es-ES') : 'Sin fecha';
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${venta.id || 'Sin ID'}</td>
                        <td>${venta.usuarioId || 'Sin usuario'}</td>
                        <td>$${venta.total ? venta.total.toFixed(2) : '0.00'}</td>
                        <td>${fecha}</td>
                        <td>
                            <button class="boton-menu" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="verDetallesVenta('${venta.id}')">
                                <i class="bi bi-eye"></i>
                            </button>
                        </td>
                    `;
                    salesListBody.appendChild(row);
                });
            } else {
                // Mostrar mensaje si no hay ventas
                const salesListBody = document.getElementById('sales-list-body');
                salesListBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No se encontraron ventas</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al cargar ventas:', error);
            // Mostrar mensaje de error
            const salesListBody = document.getElementById('sales-list-body');
            salesListBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error al cargar ventas</td></tr>';
        });
}

function verDetallesVenta(ventaId) {
    Toastify({
        text: `Función para ver detalles de venta ${ventaId} en desarrollo`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        style: {
            background: "#ffc107",
        }
    }).showToast();
}
