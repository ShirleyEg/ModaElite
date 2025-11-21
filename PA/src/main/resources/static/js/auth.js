document.addEventListener("DOMContentLoaded", function () {
    // Verificar la sesión de usuario con un tiempo de expiración
    const usuarioGuardado = localStorage.getItem("usuarioActual");
    const sesionInfo = JSON.parse(usuarioGuardado);
    const nombreUsuario = document.getElementById("nombreUsuario");
    const loginLink = document.querySelector(".boton-login");
    const logoutItem = document.getElementById("logoutItem");
    const logoutBtn = document.getElementById("logoutBtn");

    // Verificar si hay una sesión activa y no ha expirado
    const esSesionValida = sesionInfo && 
        (!sesionInfo.expiracion || sesionInfo.expiracion > Date.now());

    if (esSesionValida) {
      // Mostrar nombre de usuario
      if (nombreUsuario) {
        nombreUsuario.textContent = `Hola, ${sesionInfo.nombre || sesionInfo.correo}`;
      }
      
      // Ocultar botón de login y mostrar botón de logout
      if (loginLink) loginLink.style.display = "none";
      if (logoutItem) logoutItem.style.display = "block";
    } else {
      // Limpiar sesión expirada
      localStorage.removeItem("usuarioActual");
      
      // Mostrar botón de login
      if (loginLink) loginLink.style.display = "block";
      if (logoutItem) logoutItem.style.display = "none";
    }
  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        // Eliminar datos de usuario al cerrar sesión
        localStorage.removeItem("usuarioActual");
        
        // Redirigir a la página de inicio de sesión
        window.location.href = "/inicioSesion";
      });
    }
  });

  // Función para extender la sesión
  function extenderSesion(usuario) {
    const DURACION_SESION = 24 * 60 * 60 * 1000; // 24 horas
    const sesionExtendida = {
      ...usuario,
      expiracion: Date.now() + DURACION_SESION
    };
    localStorage.setItem("usuarioActual", JSON.stringify(sesionExtendida));
  }

  // Llamar a extenderSesion cuando se inicia sesión
  window.extenderSesion = extenderSesion;
  