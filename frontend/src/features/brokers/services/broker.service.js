import apiClient from '../../auth/services/api.client.js';

export const brokerService = {
  /**
   * Fetch all brokers from backend
   */
  async getAllBrokers(params = {}) {
    const response = await apiClient.get('/brokers', { params });
    return response.data?.brokers || [];
  },

  /**
   * Create / Join as a new Broker
   */
  async createBroker(brokerData) {
    const response = await apiClient.post('/brokers', brokerData);
    return response.data?.broker;
  },

  /**
   * Get single broker by slug
   */
  async getBrokerBySlug(slug) {
    const response = await apiClient.get(`/brokers/${slug}`);
    return response.data?.broker;
  },

  /**
   * Delete broker by ID
   */
  async deleteBroker(id) {
    const response = await apiClient.delete(`/brokers/${id}`);
    return response.data;
  },
};

export default brokerService;
