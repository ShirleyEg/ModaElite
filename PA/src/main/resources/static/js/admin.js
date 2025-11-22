document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario es administrador
    // Comentamos temporalmente la verificación para evitar recargas continuas
    // if (!verificarAccesoAdmin()) {
    //     // Si no es administrador, no continuar con la inicialización
    //     return;
    // }
    
    // Verificar acceso de forma más simple
    const usuarioGuardado = localStorage.getItem("usuarioActual");
    if (!usuarioGuardado) {
        // No hay usuario en sesión, redirigir a inicio de sesión
        // window.location.href = "/inicioSesion";
        // Mostrar mensaje en consola en lugar de redirigir
        console.log("No hay usuario en sesión");
        return;
    }
    
    const usuario = JSON.parse(usuarioGuardado);
    if (usuario.rol !== "administrador") {
        // No es administrador, mostrar mensaje en consola
        console.log("Usuario no es administrador");
        return;
    }
    
    // Si es administrador, configurar la interfaz
    document.getElementById('admin-welcome').textContent = `Bienvenido, ${usuario.nombre || usuario.correo}`;
    
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
    
    // Configurar botones del menú
    configurarBotonesMenu();
    
    // Configurar modal de productos
    configurarModal();
    
    // Configurar búsqueda de productos
    configurarBusquedaProductos();
    
    // Configurar formulario de predicción
    configurarFormularioPrediccion();
    
    // Mostrar sección de dashboard por defecto
    mostrarSeccionDashboard();
    
    // Cargar datos iniciales
    cargarEstadisticas();
    cargarUsuarios();
    cargarProductos();
    cargarVentas();
});

function verificarAccesoAdmin() {
    const usuarioGuardado = localStorage.getItem("usuarioActual");
    
    if (!usuarioGuardado) {
        // No hay usuario en sesión, redirigir a inicio de sesión
        window.location.href = "/inicioSesion";
        return false;
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
        
        return false;
    }
    
    // Es administrador, mostrar el panel
    console.log("Acceso de administrador verificado");
    document.getElementById('admin-welcome').textContent = `Bienvenido, ${usuario.nombre || usuario.correo}`;
    
    // Devolver true para indicar que el usuario es administrador
    return true;
}

// ============ CONFIGURACIÓN DE MENÚ ============

function configurarBotonesMenu() {
    const dashboardBtn = document.getElementById('dashboard');
    const usuariosBtn = document.getElementById('usuarios');
    const productosBtn = document.getElementById('productos');
    const ventasBtn = document.getElementById('ventas');
    const predictivoBtn = document.getElementById('predictivo');
    
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function() {
            mostrarSeccionDashboard();
            // Activar el botón actual y desactivar los demás
            document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    }
    
    if (usuariosBtn) {
        usuariosBtn.addEventListener('click', function() {
            mostrarSeccionUsuarios();
            // Activar el botón actual y desactivar los demás
            document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    }
    
    if (productosBtn) {
        productosBtn.addEventListener('click', function() {
            mostrarSeccionProductos();
            // Activar el botón actual y desactivar los demás
            document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    }
    
    if (ventasBtn) {
        ventasBtn.addEventListener('click', function() {
            mostrarSeccionVentas();
            // Activar el botón actual y desactivar los demás
            document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    }
    
    // Agregar el evento para el botón de modelo predictivo
    if (predictivoBtn) {
        predictivoBtn.addEventListener('click', function() {
            mostrarSeccionPredictivo();
            // Activar el botón actual y desactivar los demás
            document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    }
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
    const dashboardBtn = document.getElementById('dashboard');
    if (dashboardBtn) {
        dashboardBtn.classList.add('active');
    }
    const sectionDashboard = document.getElementById('section-dashboard');
    if (sectionDashboard) {
        sectionDashboard.style.display = 'block';
    }
    cargarEstadisticas();
    cargarUsuarios();
}

function mostrarSeccionUsuarios() {
    ocultarTodasLasSecciones();
    const usuariosBtn = document.getElementById('usuarios');
    if (usuariosBtn) {
        usuariosBtn.classList.add('active');
    }
    const sectionUsuarios = document.getElementById('section-usuarios');
    if (sectionUsuarios) {
        sectionUsuarios.style.display = 'block';
    }
    cargarUsuarios();
}

function mostrarSeccionProductos() {
    ocultarTodasLasSecciones();
    const productosBtn = document.getElementById('productos');
    if (productosBtn) {
        productosBtn.classList.add('active');
    }
    const sectionProductos = document.getElementById('section-productos');
    if (sectionProductos) {
        sectionProductos.style.display = 'block';
    }
    cargarProductos();
}

function mostrarSeccionVentas() {
    ocultarTodasLasSecciones();
    const ventasBtn = document.getElementById('ventas');
    if (ventasBtn) {
        ventasBtn.classList.add('active');
    }
    const sectionVentas = document.getElementById('section-ventas');
    if (sectionVentas) {
        sectionVentas.style.display = 'block';
    }
    cargarVentas();
}

// ============ FUNCIONES DE ESTADÍSTICAS ============

function cargarEstadisticas() {
    // Hacer una llamada AJAX al backend para obtener estadísticas reales
    fetch('/api/admin/estadisticas')
        .then(response => response.json())
        .then(data => {
            if (data.estadisticas) {
                const totalUsuarios = document.getElementById('total-usuarios');
                const totalProductos = document.getElementById('total-productos');
                const totalVentas = document.getElementById('total-ventas');
                
                if (totalUsuarios) {
                    totalUsuarios.textContent = data.estadisticas.totalUsuarios || '0';
                }
                if (totalProductos) {
                    totalProductos.textContent = data.estadisticas.totalProductos || '0';
                }
                if (totalVentas) {
                    totalVentas.textContent = data.estadisticas.totalVentas || '0';
                }
            } else {
                // Valores por defecto si hay un error
                const totalUsuarios = document.getElementById('total-usuarios');
                const totalProductos = document.getElementById('total-productos');
                const totalVentas = document.getElementById('total-ventas');
                
                if (totalUsuarios) {
                    totalUsuarios.textContent = '25';
                }
                if (totalProductos) {
                    totalProductos.textContent = '42';
                }
                if (totalVentas) {
                    totalVentas.textContent = '18';
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar estadísticas:', error);
            // Valores por defecto si hay un error
            const totalUsuarios = document.getElementById('total-usuarios');
            const totalProductos = document.getElementById('total-productos');
            const totalVentas = document.getElementById('total-ventas');
            
            if (totalUsuarios) {
                totalUsuarios.textContent = '25';
            }
            if (totalProductos) {
                totalProductos.textContent = '42';
            }
            if (totalVentas) {
                totalVentas.textContent = '18';
            }
        });
}

// Funciones para los botones restaurados
function verUsuarios() {
    // Mostrar sección de usuarios
    mostrarSeccionUsuarios();
    // Activar el botón del menú
    document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
    const usuariosBtn = document.getElementById('usuarios');
    if (usuariosBtn) {
        usuariosBtn.classList.add('active');
    }
}

function verProductos() {
    // Mostrar sección de productos
    mostrarSeccionProductos();
    // Activar el botón del menú
    document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
    const productosBtn = document.getElementById('productos');
    if (productosBtn) {
        productosBtn.classList.add('active');
    }
}

function agregarProducto() {
    abrirModalProducto();
}

function verVentas() {
    // Mostrar sección de ventas
    mostrarSeccionVentas();
    // Activar el botón del menú
    document.querySelectorAll('.boton-categoria').forEach(btn => btn.classList.remove('active'));
    const ventasBtn = document.getElementById('ventas');
    if (ventasBtn) {
        ventasBtn.classList.add('active');
    }
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
            const userListBody = document.getElementById('user-list-body');
            if (!userListBody) return;
            
            if (data.usuarios) {
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
                userListBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No se encontraron usuarios</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al cargar usuarios:', error);
            // Mostrar mensaje de error
            const userListBody = document.getElementById('user-list-body');
            if (userListBody) {
                userListBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Error al cargar usuarios</td></tr>';
            }
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
            const productListBody = document.getElementById('product-list-body');
            if (!productListBody) return;
            
            if (data.productos) {
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
                productListBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No se encontraron productos</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            // Mostrar mensaje de error
            const productListBody = document.getElementById('product-list-body');
            if (productListBody) {
                productListBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Error al cargar productos</td></tr>';
            }
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
            const productListBody = document.getElementById('product-list-body');
            if (!productListBody) return;
            
            if (data.productos) {
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
            if (productListBody) {
                productListBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Error al buscar productos</td></tr>';
            }
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
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', guardarProducto);
    }
    
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            if (modal) {
                modal.style.display = 'none';
            }
        }
    });
}

function abrirModalProducto() {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const modalTitle = document.querySelector('.modal-content h2');
    const productId = document.getElementById('product-id');
    
    if (form) {
        form.reset();
    }
    if (productId) {
        productId.value = '';
    }
    if (modalTitle) {
        modalTitle.textContent = 'Crear Nuevo Producto';
    }
    if (modal) {
        modal.style.display = 'block';
    }
}

function editarProducto(productoId) {
    // Hacer una llamada AJAX al backend para obtener los datos del producto
    fetch(`/api/admin/productos/${productoId}`)
        .then(response => response.json())
        .then(producto => {
            // Llenar el formulario con los datos del producto
            const productId = document.getElementById('product-id');
            const productTitulo = document.getElementById('product-titulo');
            const productPrecio = document.getElementById('product-precio');
            const productCategoria = document.getElementById('product-categoria');
            const productImagen = document.getElementById('product-imagen');
            const modalTitle = document.querySelector('.modal-content h2');
            const modal = document.getElementById('product-modal');
            
            if (productId) {
                productId.value = producto.id || '';
            }
            if (productTitulo) {
                productTitulo.value = producto.titulo || '';
            }
            if (productPrecio) {
                productPrecio.value = producto.precio || '';
            }
            if (productCategoria) {
                productCategoria.value = producto.categoria && producto.categoria.nombre ? producto.categoria.nombre : '';
            }
            if (productImagen) {
                productImagen.value = producto.imagen || '';
            }
            
            // Cambiar el título del modal
            if (modalTitle) {
                modalTitle.textContent = 'Editar Producto';
            }
            
            // Mostrar el modal
            if (modal) {
                modal.style.display = 'block';
            }
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
    if (!form) return;
    
    const formData = new FormData(form);
    
    const producto = {
        titulo: formData.get('titulo'),
        precio: parseFloat(formData.get('precio')),
        categoria: { nombre: formData.get('categoria') },
        imagen: formData.get('imagen')
    };
    
    // Obtener ID si es una edición
    const productoId = document.getElementById('product-id');
    const productIdValue = productoId ? productoId.value : null;
    
    // Determinar si es una creación o actualización
    const isUpdate = productIdValue && productIdValue.trim() !== '';
    
    // Configurar la URL y el método HTTP
    const url = isUpdate ? `/api/admin/productos/${productIdValue}` : '/api/admin/productos';
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
            const modal = document.getElementById('product-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            
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
            const salesListBody = document.getElementById('sales-list-body');
            if (!salesListBody) return;
            
            if (data.ventas) {
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
                salesListBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No se encontraron ventas</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al cargar ventas:', error);
            // Mostrar mensaje de error
            const salesListBody = document.getElementById('sales-list-body');
            if (salesListBody) {
                salesListBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error al cargar ventas</td></tr>';
            }
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

// ============ FUNCIONES DE MODELO PREDICTIVO ============

function mostrarSeccionPredictivo() {
    ocultarTodasLasSecciones();
    const sectionPredictivo = document.getElementById('section-predictivo');
    if (sectionPredictivo) {
        sectionPredictivo.style.display = 'block';
    }
    
    // Cargar métricas del modelo
    cargarMetricasModelo();
    
    // Establecer fecha actual por defecto
    const predictionDate = document.getElementById('prediction-date');
    if (predictionDate) {
        const today = new Date().toISOString().split('T')[0];
        predictionDate.value = today;
    }
}

function cargarMetricasModelo() {
    // Hacer una llamada AJAX al backend para obtener métricas del modelo
    fetch('/api/predict/metrics')
        .then(response => response.json())
        .then(data => {
            const rmseMetric = document.getElementById('rmse-metric');
            const correlationMetric = document.getElementById('correlation-metric');
            
            if (data.rmse !== undefined && data.correlation !== undefined) {
                if (rmseMetric) {
                    rmseMetric.textContent = data.rmse.toFixed(4);
                }
                if (correlationMetric) {
                    correlationMetric.textContent = data.correlation.toFixed(4);
                }
            } else {
                if (rmseMetric) {
                    rmseMetric.textContent = 'N/A';
                }
                if (correlationMetric) {
                    correlationMetric.textContent = 'N/A';
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar métricas del modelo:', error);
            const rmseMetric = document.getElementById('rmse-metric');
            const correlationMetric = document.getElementById('correlation-metric');
            
            if (rmseMetric) {
                rmseMetric.textContent = 'Error';
            }
            if (correlationMetric) {
                correlationMetric.textContent = 'Error';
            }
        });
}

function configurarFormularioPrediccion() {
    const form = document.getElementById('prediction-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            predecirVentas();
        });
    }
    
    const btnPredecir = document.getElementById('btn-predecir-ventas');
    if (btnPredecir) {
        btnPredecir.addEventListener('click', function() {
            // Limpiar el formulario y mostrar la sección de predicción
            const predictionForm = document.getElementById('prediction-form');
            if (predictionForm) {
                predictionForm.reset();
            }
            const predictionDate = document.getElementById('prediction-date');
            if (predictionDate) {
                const today = new Date().toISOString().split('T')[0];
                predictionDate.value = today;
            }
            const predictionResult = document.getElementById('prediction-result');
            if (predictionResult) {
                predictionResult.style.display = 'none';
            }
        });
    }
}

function predecirVentas() {
    // Obtener datos del formulario
    const predictionDate = document.getElementById('prediction-date');
    const predictionCategory = document.getElementById('prediction-category');
    const predictionSize = document.getElementById('prediction-size');
    const predictionColor = document.getElementById('prediction-color');
    const predictionPrice = document.getElementById('prediction-price');
    const predictionInventory = document.getElementById('prediction-inventory');
    
    const formData = {
        date: predictionDate ? predictionDate.value : '',
        category: predictionCategory ? predictionCategory.value : '',
        size: predictionSize ? predictionSize.value : '',
        color: predictionColor ? predictionColor.value : '',
        price: predictionPrice ? parseFloat(predictionPrice.value) : NaN,
        inventory: predictionInventory ? parseInt(predictionInventory.value) : NaN
    };
    
    // Validar que todos los campos estén completos
    if (!formData.date || !formData.category || !formData.size || !formData.color || 
        isNaN(formData.price) || isNaN(formData.inventory)) {
        Toastify({
            text: "Por favor complete todos los campos del formulario",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            style: {
                background: "#dc3545",
            }
        }).showToast();
        return;
    }
    
    // Mostrar indicador de carga
    const resultDiv = document.getElementById('prediction-result');
    const resultValue = document.getElementById('prediction-value');
    if (resultValue) {
        resultValue.textContent = "Calculando predicción...";
    }
    if (resultDiv) {
        resultDiv.style.display = 'block';
    }
    
    // Hacer la llamada al backend para obtener la predicción
    fetch('/api/predict/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (resultValue) {
            if (data.prediction !== undefined) {
                resultValue.textContent = `Se predicen ${Math.round(data.prediction)} unidades vendidas`;
                resultValue.style.color = "#28a745";
            } else if (data.error) {
                resultValue.textContent = `Error: ${data.error}`;
                resultValue.style.color = "#dc3545";
            } else {
                resultValue.textContent = "Error al obtener la predicción";
                resultValue.style.color = "#dc3545";
            }
        }
    })
    .catch(error => {
        console.error('Error al predecir ventas:', error);
        if (resultValue) {
            resultValue.textContent = "Error al obtener la predicción";
            resultValue.style.color = "#dc3545";
        }
    });
}