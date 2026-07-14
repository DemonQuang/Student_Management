import api from './api';

export const classroomService = {
  getAll: async () => {
    return api.get(`/api/v1/classrooms`);
  },

  getById: async (id) => {
    return api.get(`/api/v1/classrooms/${id}`);
  },

  getByDepartmentId: async (departmentId) => {
    return api.get(`/api/v1/classrooms/department/${departmentId}`);
  },

  create: async (name, departmentId, active = true) => {
    return api.post(`/api/v1/classrooms`, { name, departmentId, active });
  },

  update: async (id, name, departmentId, active) => {
    return api.put(`/api/v1/classrooms/${id}`, { name, departmentId, active });
  },

  delete: async (id) => {
    return api.delete(`/api/v1/classrooms/${id}`);
  },
};
