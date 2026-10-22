import { httpClient } from '../../../core/api/httpClient';

/**
 * Servicio cliente para el Módulo 2: Ingesta de Material de Clase
 */
class MaterialService {
  /**
   * Sube un archivo (.pdf, .docx, .txt) con extracción automática de texto
   * @param {FormData} formData
   */
  async uploadMaterial(formData) {
    const response = await httpClient.post('/materials/upload', formData);
    return response.data;
  }

  /**
   * Obtiene los materiales de clase subidos, filtrados opcionalmente por asignatura
   * @param {number|string} asignaturaId
   */
  async getMaterialsByAsignatura(asignaturaId) {
    const endpoint = asignaturaId ? `/materials?asignatura_id=${asignaturaId}` : '/materials';
    const response = await httpClient.get(endpoint);
    return response.data || [];
  }

  /**
   * Obtiene el detalle de un material con su texto extraído
   * @param {string} id UUID del material
   */
  async getMaterialById(id) {
    const response = await httpClient.get(`/materials/${id}`);
    return response.data;
  }

  /**
   * Elimina un material de clase y su archivo en el backend
   * @param {string} id UUID del material
   */
  async deleteMaterial(id) {
    const response = await httpClient.delete(`/materials/${id}`);
    return response.data;
  }
}

export const materialService = new MaterialService();
