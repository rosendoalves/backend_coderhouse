const form = document.getElementById('formRecovery');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => obj[key] = value);

  const url = '/reset-password';
  const headers = {
    'Content-Type': 'application/json'
  };
  const method = 'POST';
  const body = JSON.stringify(obj);

  fetch(url, {
    headers,
    method,
    body
  })
    .then(response => {
      console.log("🚀 ~ file: recovery.js:38 ~ response:", response);
      if (response.redirected) {
        Swal.fire({
          text: "Enviamos un correo para recuperar contraseña",
          toast: true,
          position: 'center'
        });
        setTimeout(() => {
          window.location.href = response.url;
        }, 5000);
      } else {
        return response.json();
      }
    })
    .then(data => console.log(data))
    .catch(error => console.log(error));
});
