import api from './api';

export const departmentService = {
  getAll: async () => {
    return api.get(`/api/v1/departments`);
  },

  getById: async (id) => {
    return api.get(`/api/v1/departments/${id}`);
  },

  create: async (name) => {
    return api.post(`/api/v1/departments`, { name });
  },

  update: async (id, name) => {
    return api.put(`/api/v1/departments/${id}`, { name });
  },

  delete: async (id) => {
    return api.delete(`/api/v1/departments/${id}`);
  },
};
