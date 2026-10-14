/**
 * Cliente HTTP Centralizado para consumo de la API REST
 * Inyecta automáticamente el token JWT y procesa respuestas y errores estándar.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('evalia_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Si el body es FormData (subida de archivos), el navegador asigna el Content-Type y boundary
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);

      // Si la respuesta es un archivo descargable (Blob)
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/pdf') || contentType.includes('application/vnd.openxmlformats') || contentType.includes('application/octet-stream')) {
        if (!response.ok) {
          throw new Error('Error al descargar el archivo solicitado.');
        }
        return await response.blob();
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('evalia:unauthorized'));
        }

        const error = new Error(data.error || 'Ocurrió un error en la solicitud');
        error.status = response.status;
        error.code = data.code || 'HTTP_ERROR';
        error.details = data.details || null;
        throw error;
      }

      return data;
    } catch (error) {
      // Si fue error de red o timeout
      if (!error.status) {
        error.message = 'No se pudo establecer conexión con el servidor. Verifique su conexión o intente más tarde.';
        error.code = 'NETWORK_ERROR';
      }
      throw error;
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers
    });
  }

  put(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers
    });
  }

  patch(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers
    });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

export const httpClient = new HttpClient(BASE_URL);
