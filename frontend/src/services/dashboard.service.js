import api from './api';

export const dashboardService = {
  getDashboardData: async () => {
    return api.get(`/api/v1/dashboard`);
  },
};
