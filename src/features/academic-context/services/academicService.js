import { httpClient } from '../../../core/api/httpClient';

/**
 * Servicio HTTP para la gestión del Contexto Académico (Módulo 1)
 */
class AcademicService {
  /**
   * Obtiene la lista de programas académicos
   */
  async getProgramas() {
    const response = await httpClient.get('/academic/programas');
    return response.data || [];
  }

  /**
   * Obtiene el catálogo de asignaturas disponibles (opcionalmente filtrado por programa)
   */
  async getAsignaturas(programaId = null) {
    const query = programaId ? `?programa_id=${programaId}` : '';
    const response = await httpClient.get(`/academic/asignaturas${query}`);
    return response.data || [];
  }

  /**
   * Obtiene las asignaturas vinculadas al docente autenticado
   */
  async getMisAsignaturas(periodo = null) {
    const query = periodo ? `?periodo=${encodeURIComponent(periodo)}` : '';
    const response = await httpClient.get(`/academic/mis-asignaturas${query}`);
    return response.data || [];
  }

  /**
   * Vincula una asignatura al docente en un periodo y grupo específico
   * @param {object} payload - { asignatura_id, periodo_academico, grupo }
   */
  async vincularAsignatura(payload) {
    const response = await httpClient.post('/academic/vincular-asignatura', payload);
    return response.data;
  }

  /**
   * Crea una nueva asignatura en el catálogo institucional
   * @param {object} payload - { programa_id, codigo, nombre, semestre }
   */
  async createAsignatura(payload) {
    const response = await httpClient.post('/academic/asignaturas', payload);
    return response.data;
  }
}

export const academicService = new AcademicService();
