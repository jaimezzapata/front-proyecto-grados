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
   * Crea un nuevo programa académico
   * @param {object} payload - { codigo, nombre }
   */
  async createPrograma(payload) {
    const response = await httpClient.post('/academic/programas', payload);
    return response.data;
  }

  /**
   * Actualiza los datos de un programa académico existente
   * @param {number|string} id - ID del programa
   * @param {object} payload - { codigo, nombre }
   */
  async updatePrograma(id, payload) {
    const response = await httpClient.put(`/academic/programas/${id}`, payload);
    return response.data;
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
   * Obtiene el detalle completo de una asignación específica del docente
   * @param {number|string} id - ID de la asignación (DocenteAsignatura)
   */
  async getAsignacionById(id) {
    const response = await httpClient.get(`/academic/mis-asignaturas/${id}`);
    return response.data;
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

  /**
   * Actualiza la configuración de un grupo o los datos de la asignatura vinculada
   * @param {number|string} id - ID de la asignación (DocenteAsignatura)
   * @param {object} payload - Campos a actualizar
   */
  async updateMisAsignatura(id, payload) {
    const response = await httpClient.put(`/academic/mis-asignaturas/${id}`, payload);
    return response.data;
  }

  /**
   * Desvincula una asignatura o grupo del docente
   * @param {number|string} id - ID de la asignación (DocenteAsignatura)
   */
  async deleteMisAsignatura(id) {
    const response = await httpClient.delete(`/academic/mis-asignaturas/${id}`);
    return response.data;
  }

  /**
   * Modifica los datos de una asignatura en el catálogo
   * @param {number|string} id - ID de la asignatura
   * @param {object} payload - { nombre, codigo, semestre, programa_id }
   */
  async updateAsignatura(id, payload) {
    const response = await httpClient.put(`/academic/asignaturas/${id}`, payload);
    return response.data;
  }
}

export const academicService = new AcademicService();
