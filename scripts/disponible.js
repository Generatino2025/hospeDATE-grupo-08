import { reservas } from "../assets/data/data.js";

export function estaDisponible(habitacion, checkIn, checkOut) {
  return !reservas.some(res => {
    const resHab = res.habitacion?.idHabitacion || res.idHabitacion;

    return (
      resHab === habitacion.id &&
      checkIn < res.fechas.checkOut &&
      checkOut > res.fechas.checkIn
    );
  });
}


