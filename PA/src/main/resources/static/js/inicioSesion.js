// document.addEventListener('DOMContentLoaded', function() {
//   console.log('Página de inicio de sesión cargada');
//   
//   // Verificar si ya hay una sesión activa
//   const usuarioActual = localStorage.getItem('usuarioActual');
//   if (usuarioActual) {
//     const usuario = JSON.parse(usuarioActual);
//     console.log('Usuario ya tiene sesión activa, redirigiendo...');
//     // Redirigir según el rol del usuario
//     if (usuario.rol === 'administrador') {
//         window.location.href = '/admin';
//     } else {
//         window.location.href = '/home';
//     }
//     return;
//   }
// });

// Manejar el envío del formulario
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Mostrar indicador de carga
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'block';
  }
  
  // Obtener valores del formulario
  const correo = document.getElementById('correo').value;
  const password = document.getElementById('password').value;
  
  // Validar campos
  if (!correo || !password) {
      Swal.fire({
          title: 'Error',
          text: 'Por favor, ingresa tu correo y contraseña',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
      });
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
      return;
  }
  
  // Preparar datos para enviar
  const data = {
      correo: correo,
      password: password
  };
  
  // Enviar solicitud de inicio de sesión
  console.log('Datos de login:', data); // Log de depuración
  fetch('/api/usuarios/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  }).then(async response => {
      console.log('Datos enviados:', data);
      console.log('Respuesta del servidor:', response);
      console.log('Estado de la respuesta:', response.status);
      console.log('Cabeceras de la respuesta:', response.headers);
      
      // Leer el contenido solo UNA VEZ
      const responseText = await response.text();
      console.log('Contenido de la respuesta:', responseText);

      // Intentar parsear como JSON (si es posible)
      let responseData;
      try {
          responseData = JSON.parse(responseText);
      } catch (e) {
          responseData = {};
      }

      // Ocultar indicador de carga
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }

      if (response.status === 200) {
          return responseData;
      } else {
          throw new Error(responseData.error || 'Error en el inicio de sesión');
      }

  }).then(data => {
      console.log('Login exitoso:', data);
      
      // Validar datos del usuario antes de guardar
      if (!data || typeof data !== 'object') {
          console.error('Datos de usuario inválidos:', data);
          throw new Error('Datos de usuario inválidos');
      }
      
      // Verificar que todos los campos necesarios estén presentes
      if (!data.id && !data.nombre && !data.correo && !data.rol) {
          console.error('Datos incompletos del usuario:', data);
          throw new Error('Datos incompletos del usuario');
      }
      
      // Usar valores por defecto si faltan datos específicos
      data.id = data.id || '';
      data.nombre = data.nombre || data.correo || 'Usuario';
      data.correo = data.correo || '';
      data.rol = data.rol || 'usuario';
      
      // Guardar datos del usuario en localStorage y extender sesión
      const usuarioParaGuardar = {
          id: data.id,
          nombre: data.nombre,
          correo: data.correo,
          rol: data.rol  // Asegurarse de guardar el rol
      };

      // Guardar siempre en localStorage
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioParaGuardar));
      console.log('Usuario guardado en localStorage:', usuarioParaGuardar);
      
      // Extender sesión si la función está disponible
      if (window.extenderSesion) {
          window.extenderSesion(usuarioParaGuardar);
      }
      
      // Mover el contenido hacia abajo cuando aparece la notificación
      const formContainer = document.querySelector('.form-container');
      if (formContainer) {
        formContainer.style.transform = 'translateY(60px)';
        formContainer.style.transition = 'transform 0.3s ease';
      }
      
      Swal.fire({
          title: '¡Bienvenido!',
          text: `Hola, ${data.nombre || data.correo || 'Usuario'}`,
          icon: 'success',
          confirmButtonText: 'Continuar'
      }).then(() => {
          // Volver a la posición original
          if (formContainer) {
            formContainer.style.transform = 'translateY(0)';
          }
          // Redirigir según el rol del usuario
          if (data.rol === 'administrador') {
              window.location.href = '/admin';
          } else {
              window.location.href = '/home';
          }
      });

  }).catch(error => {
      console.error('Error de inicio de sesión:', error);

      Swal.fire({
          title: 'Error de Inicio de Sesión',
          text: error.message || 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
      });

      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
  });
});

// Agregar indicador de carga
const loadingIndicator = document.createElement('div');
loadingIndicator.id = 'loadingIndicator';
loadingIndicator.innerHTML = 'Iniciando sesión...';
loadingIndicator.style.display = 'none';
loadingIndicator.style.position = 'fixed';
loadingIndicator.style.top = '10px';
loadingIndicator.style.right = '10px';
loadingIndicator.style.backgroundColor = 'blue';
loadingIndicator.style.color = 'white';
loadingIndicator.style.padding = '10px';
loadingIndicator.style.zIndex = '1000';
document.body.appendChild(loadingIndicator);