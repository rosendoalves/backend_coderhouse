const form = document.getElementById('formReset');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => obj[key] = value);

  const url = '/password-update';
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
  .then(response => response.json())
  .then(response => {
      console.log("🚀 ~ file: reset.js:43 ~ response:", response)
      if (response.status === 'success') {
        Swal.fire({
          text: `${response.message}`,
          toast: true,
          position: 'center'
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 5000);
      } else {
        Swal.fire({
          text: `${response.message}`,
          toast: true,
          position: 'center'
        });
      }
    })
    .catch(error =>  Swal.fire({
      text: `${error}`,
      toast: true,
      position: 'center'
    }));
});
