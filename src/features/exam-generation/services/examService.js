import { httpClient } from '../../../core/api/httpClient';

/**
 * Servicio HTTP para la gestión y generación de Evaluaciones Académicas (Módulo 3)
 */
class ExamService {
  /**
   * Obtiene las evaluaciones creadas por el docente (filtradas por asignatura)
   * @param {number|string} asignaturaId - ID de la asignatura
   * @param {string} estado - Filtro opcional por estado
   */
  async getEvaluaciones(asignaturaId = null, estado = null) {
    const params = new URLSearchParams();
    if (asignaturaId) params.append('asignatura_id', asignaturaId);
    if (estado) params.append('estado', estado);
    const query = params.toString() ? `?${params.toString()}` : '';

    const response = await httpClient.get(`/exams${query}`);
    return response.data || [];
  }

  /**
   * Obtiene el detalle de una evaluación con sus preguntas y opciones
   * @param {string} id - UUID de la evaluación
   */
  async getEvaluacionById(id) {
    const response = await httpClient.get(`/exams/${id}`);
    return response.data;
  }

  /**
   * Genera un examen estructurado usando el motor de Inteligencia Artificial (OpenAI / DeepSeek)
   * @param {object} payload - Configuración pedagógica Bloom y fuente
   */
  async generateExam(payload) {
    const response = await httpClient.post('/exams/generate', payload);
    return response.data;
  }

  /**
   * Actualiza el estado de una evaluación (ej. 'APROBADO', 'EN_REVISION')
   * @param {string} id - UUID de la evaluación
   * @param {string} estado - Nuevo estado
   */
  async updateStatus(id, estado) {
    const response = await httpClient.patch(`/exams/${id}/status`, { estado });
    return response.data;
  }

  /**
   * Aprueba formalmente una evaluación (Human-in-the-Loop)
   * @param {string} id - UUID de la evaluación
   * @param {object} payload - Metadatos de aprobación
   */
  async approveExam(id, payload = {}) {
    const response = await httpClient.post(`/exams/${id}/approve`, payload);
    return response.data;
  }

  /**
   * Elimina una evaluación
   * @param {string} id - UUID de la evaluación
   */
  async deleteEvaluacion(id) {
    const response = await httpClient.delete(`/exams/${id}`);
    return response.data;
  }
}

export const examService = new ExamService();
