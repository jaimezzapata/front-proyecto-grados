/**
 * Utilidades para el manejo de periodos académicos y contexto docente
 */

/**
 * Calcula el periodo académico actual basado en la fecha del sistema
 * Semestre 1: Enero a Junio (1 a 6) -> YYYY-1
 * Semestre 2: Julio a Diciembre (7 a 12) -> YYYY-2
 */
export const getCurrentPeriod = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const semester = month <= 6 ? '1' : '2';
  return `${year}-${semester}`;
};

/**
 * Genera la lista de periodos académicos disponibles para filtrado
 * Incluye los periodos en los que el docente tiene materias, el periodo actual y el siguiente
 */
export const getAvailablePeriods = (misAsignaturas = []) => {
  const currentPeriod = getCurrentPeriod();
  
  // Calcular siguiente periodo
  const [yearStr, semStr] = currentPeriod.split('-');
  const year = parseInt(yearStr, 10);
  const nextPeriod = semStr === '1' ? `${year}-2` : `${year + 1}-1`;

  const periodsSet = new Set([currentPeriod, nextPeriod]);

  // Agregar periodos registrados en las materias del docente
  misAsignaturas.forEach((course) => {
    if (course.periodo_academico) {
      periodsSet.add(course.periodo_academico);
    }
  });

  // Ordenar de más reciente a más antiguo
  const sortedPeriods = Array.from(periodsSet).sort((a, b) => {
    const [yA, sA] = a.split('-').map(Number);
    const [yB, sB] = b.split('-').map(Number);
    if (yA !== yB) return yB - yA;
    return sB - sA;
  });

  return sortedPeriods;
};
