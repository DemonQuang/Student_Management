import api from './api';

export const studentService = {
  getAll: async (page = 0, size = 10, sort = 'id', direction = 'asc') => {
    return api.get(`/api/v1/students`, {
      params: { page, size, sort, direction },
    });
  },

  getById: async (id) => {
    return api.get(`/api/v1/students/${id}`);
  },

  create: async (studentData) => {
    return api.post(`/api/v1/students`, studentData);
  },

  update: async (id, studentData) => {
    return api.put(`/api/v1/students/${id}`, studentData);
  },

  delete: async (id) => {
    return api.delete(`/api/v1/students/${id}`);
  },

  search: async (keyword, page = 0, size = 10, sort = 'id', direction = 'asc') => {
    return api.get(`/api/v1/students/search`, {
      params: { keyword, page, size, sort, direction },
    });
  },

  filter: async (filters = {}, page = 0, size = 10, sort = 'id', direction = 'asc') => {
    const { departmentId, classroomId, gender, status, email } = filters;
    return api.get(`/api/v1/students/filter`, {
      params: {
        departmentId: departmentId || undefined,
        classroomId: classroomId || undefined,
        gender: gender || undefined,
        status: status || undefined,
        email: email || undefined,
        page,
        size,
        sort,
        direction,
      },
    });
  },
};
