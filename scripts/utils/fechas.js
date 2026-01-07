export function hoyISO() {
  return new Date().toISOString().split('T')[0]
}

export function rangoSeCruza(aInicio, aFin, bInicio, bFin) {
  return (
    new Date(aInicio) < new Date(bFin) &&
    new Date(aFin) > new Date(bInicio)
  )
}
