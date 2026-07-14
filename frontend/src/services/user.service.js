import api from './api';

export const userService = {
  getAll: async () => {
    return api.get(`/api/v1/users`);
  },

  updateRole: async (id, role) => {
    return api.put(`/api/v1/users/${id}/role`, { role });
  },

  delete: async (id) => {
    return api.delete(`/api/v1/users/${id}`);
  },
};
