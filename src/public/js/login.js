const form = document.getElementById('formLogin')

form.addEventListener('submit', e => {
  e.preventDefault()

  const data = new FormData(form)
  const obj = {}

  data.forEach((value, key) => obj[key] = value)

  const url = '/auth'
  const headers = {
    'Content-Type': 'application/json'
  }
  const method = 'POST'
  const body = JSON.stringify(obj)

  fetch(url, {
    headers,
    method,
    body
  })
    // .then(response => response.json())
    .then(response => {
      if (response.redirected) { // Si se ha redirigido, se navega a la nueva página
        window.location.href = response.url
      } else {
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.log(error))
})