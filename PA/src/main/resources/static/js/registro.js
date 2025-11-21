document.addEventListener('DOMContentLoaded', function() {
  console.log('Página de registro cargada');
  
  // Verificar si ya hay una sesión activa
  const usuarioActual = localStorage.getItem('usuarioActual');
  if (usuarioActual) {
    console.log('Usuario ya tiene sesión activa, redirigiendo...');
    window.location.href = '/home';
    return;
  }
  
  // Manejar el envío del formulario
  document.getElementById('formRegistro').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Formulario de registro enviado');
  
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('emailRegistro').value;
    const password = document.getElementById('passwordRegistro').value;
    const confirmar = document.getElementById('confirmarPassword').value;
  
    if (password !== confirmar) {
      Toastify({
        text: "Las contraseñas no coinciden",
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
  
    // Crear objeto usuario con los campos que espera el backend
    const usuario = { 
      nombre: nombre, 
      correo: email, 
      password: password 
    };

    // Mostrar indicador de carga
    Swal.fire({
      title: 'Registrando usuario',
      text: 'Por favor espere...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Enviar al backend con fetch
    fetch('/api/usuarios/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    })
    .then(response => {
      console.log('Respuesta recibida:', response.status);
      return response.json().then(data => {
        if (!response.ok) {
          return Promise.reject(data);
        }
        return data;
      });
    })
    .then(data => {
      console.log('Registro exitoso:', data);
      // Mostrar mensaje de éxito con SweetAlert
      Swal.fire({
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión con tus credenciales',
        icon: 'success',
        confirmButtonText: 'Iniciar sesión'
      }).then(() => {
        // Redirigir a la página de inicio de sesión
        window.location.href = '/inicioSesion';
      });
    })
    .catch(error => {
      console.error('Error en registro:', error);
      
      // Mostrar mensaje de error
      Swal.fire({
        title: 'Error',
        text: error.error || 'Error al registrar usuario',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    });
  });
});