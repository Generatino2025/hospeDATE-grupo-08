export function mostrarError(idInput, mensaje) {
  const input = document.getElementById(idInput)
  const error = document.getElementById(`error-${idInput}`)

  if (!input || !error) return

  input.classList.add('is-invalid')
  error.textContent = mensaje
}

export function limpiarError(idInput) {
  const input = document.getElementById(idInput)
  const error = document.getElementById(`error-${idInput}`)

  if (!input || !error) return

  input.classList.remove('is-invalid')
  error.textContent = ''
}

export function limpiarTodosErrores() {
  document
    .querySelectorAll('.is-invalid')
    .forEach(el => el.classList.remove('is-invalid'))

  document
    .querySelectorAll('[id^="error-"]')
    .forEach(el => (el.textContent = ''))
}
