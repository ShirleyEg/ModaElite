document.addEventListener('DOMContentLoaded', function() {
  console.log('Página de inicio de sesión cargada');
  
  // Verificar si ya hay una sesión activa
  const usuarioActual = localStorage.getItem('usuarioActual');
  if (usuarioActual) {
    console.log('Usuario ya tiene sesión activa, redirigiendo...');
    window.location.href = '/home';
    return;
  }
});

// Manejar el envío del formulario
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Mostrar indicador de carga
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.style.display = 'block';
  
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
      loadingIndicator.style.display = 'none';
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
      loadingIndicator.style.display = 'none';

      if (response.status === 200) {
          return responseData;
      } else {
          throw new Error(responseData.error || 'Error en el inicio de sesión');
      }

  }).then(data => {
      console.log('Login exitoso:', data);
      
      // Guardar datos del usuario en localStorage y extender sesión
      const usuarioParaGuardar = {
          id: data.id,
          nombre: data.nombre,
          correo: data.correo
      };

      if (window.extenderSesion) {
          window.extenderSesion(usuarioParaGuardar);
      } else {
          localStorage.setItem('usuarioActual', JSON.stringify(usuarioParaGuardar));
          localStorage.setItem('usuarioId', usuarioParaGuardar.id);
          localStorage.setItem('usuarioNombre', usuarioParaGuardar.nombre);
          localStorage.setItem('usuarioCorreo', usuarioParaGuardar.correo);
      }
      
      Swal.fire({
          title: '¡Bienvenido!',
          text: `Hola, ${data.nombre || data.correo}`,
          icon: 'success',
          confirmButtonText: 'Continuar'
      }).then(() => {
          window.location.href = '/home';
      });

  }).catch(error => {
      console.error('Error de inicio de sesión:', error);

      Swal.fire({
          title: 'Error de Inicio de Sesión',
          text: error.message || 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
      });

      loadingIndicator.style.display = 'none';
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
