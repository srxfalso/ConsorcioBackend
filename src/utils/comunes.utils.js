async function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear().toString(); // Año
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mes (de 0 a 11, por eso +1)
    const day = now.getDate().toString().padStart(2, '0');          // Día
    return `${year}${month}${day}`;
}
function getcapitalizarTexto(texto) {
  if (!texto || typeof texto !== 'string') return '';

  return texto
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}

function getFechaLarga() {
  const fecha = new Date();
  
  // Opciones para el formato del día de la semana
 // const opcionesDiaSemana = { weekday: 'long' };
  
  // Opciones para el formato del mes
  const opcionesMes = { month: 'long' };
  
  // Obtener partes de la fecha
  //const diaSemana = fecha.toLocaleDateString('es-ES', opcionesDiaSemana);
  const dia = fecha.getDate();
  const mes = fecha.toLocaleDateString('es-ES', opcionesMes);
  const año = fecha.getFullYear();
  
  // Formatear la cadena final
  //return `${diaSemana} ${dia} de ${mes} de ${año}`;
  return `${dia} de ${mes} de ${año}`;
}

module.exports = {
    getFormattedDate,
    getcapitalizarTexto,
    getFechaLarga
};