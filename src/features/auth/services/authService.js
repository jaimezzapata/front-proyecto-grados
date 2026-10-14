import { httpClient } from '../../../core/api/httpClient';

export const authService = {
  async login(credentials) {
    const response = await httpClient.post('/auth/login', credentials);
    return response.data; // { token, user: { id, nombres, rol } }
  },

  async register(userData) {
    const response = await httpClient.post('/auth/register', userData);
    return response.data; // { id, nombres, apellidos, correo_institucional }
  }
};
