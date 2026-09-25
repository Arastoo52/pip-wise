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

  /**
   * Record click lead for broker
   */
  async recordClick(id) {
    try {
      const response = await apiClient.post(`/brokers/${id}/click`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Update broker promotional announcement / deposit bonus offer
   */
  async updatePromotion(id, promoData) {
    const response = await apiClient.patch(`/brokers/${id}/promotion`, promoData);
    return response.data;
  },

  /**
   * Submit direct trader question to broker desk
   */
  async submitInquiry(id, inquiryData) {
    const response = await apiClient.post(`/brokers/${id}/inquiry`, inquiryData);
    return response.data;
  },

  /**
   * Reply to a trader inquiry (Broker Desk Answer)
   */
  async replyInquiry(id, inquiryId, replyData) {
    const response = await apiClient.post(`/brokers/${id}/inquiry/${inquiryId}/reply`, replyData);
    return response.data;
  },
};

export default brokerService;
