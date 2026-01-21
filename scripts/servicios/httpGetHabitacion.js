import { httpGet } from "./httpGet.js";

export async function getHabitacion() {
    try {
        return await httpGet('/habitaciones', false);
    } catch (error) {
        console.error('No pudimos encontrar las habitaciones:', error);
        throw error;
    }
}
