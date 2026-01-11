import api from './api';

const RAG_PATH = import.meta.env.VITE_API_RAG_PATH || '/api/rag';

/**
 * RAG API Service
 * Handle all RAG-related API calls
 */
const ragApi = {
  /**
   * Ask a question to the RAG system
   * @param {string} query - User question
   * @param {number} k - Number of documents to retrieve (default: 5)
   * @param {string} sessionId - Optional session ID for conversation context
   * @returns {Promise} Response with answer and sources
   */
  async ask(query, k = 5, sessionId = null) {
    try {
      const response = await api.post(`${RAG_PATH}/ask`, {
        query,
        k,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('RAG Ask Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get answer',
        details: error.data
      };
    }
  },

  /**
   * Get chat history for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise} Chat history
   */
  async getChatHistory(sessionId) {
    try {
      const response = await api.get(`${RAG_PATH}/history/${sessionId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Chat History Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get chat history',
        details: error.data
      };
    }
  },

  /**
   * Create a new chat session
   * @returns {Promise} New session data
   */
  async createSession() {
    try {
      const response = await api.post(`${RAG_PATH}/session`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Create Session Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create session',
        details: error.data
      };
    }
  },

  /**
   * Delete a chat session
   * @param {string} sessionId - Session ID to delete
   * @returns {Promise}
   */
  async deleteSession(sessionId) {
    try {
      await api.delete(`${RAG_PATH}/session/${sessionId}`);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Delete Session Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete session',
        details: error.data
      };
    }
  },

  /**
   * Get all available sessions
   * @returns {Promise} List of sessions
   */
  async getSessions() {
    try {
      const response = await api.get(`${RAG_PATH}/sessions`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Sessions Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get sessions',
        details: error.data
      };
    }
  },

  /**
   * Search documents without asking a question
   * @param {string} query - Search query
   * @param {number} k - Number of results
   * @returns {Promise} Search results
   */
  async search(query, k = 5) {
    try {
      const response = await api.post(`${RAG_PATH}/search`, {
        query,
        k
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Search Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to search',
        details: error.data
      };
    }
  },

  /**
   * Get similar documents
   * @param {string} documentId - Document ID
   * @param {number} k - Number of similar documents
   * @returns {Promise} Similar documents
   */
  async getSimilarDocuments(documentId, k = 5) {
    try {
      const response = await api.get(`${RAG_PATH}/similar/${documentId}`, {
        params: { k }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Similar Documents Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get similar documents',
        details: error.data
      };
    }
  }
};

export default ragApi;