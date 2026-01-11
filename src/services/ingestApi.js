import api from './api';

const INGEST_PATH = import.meta.env.VITE_API_INGEST_PATH || '/api/ingest';

/**
 * Document Ingest API Service
 * Handle document upload and processing
 */
const ingestApi = {
  /**
   * Upload files to be processed
   * @param {FileList|Array} files - Files to upload
   * @param {number} chunkSize - Size of text chunks (default: 500)
   * @param {number} overlap - Overlap between chunks (default: 100)
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Upload response
   */
  async uploadFiles(files, chunkSize = 500, overlap = 100, onProgress = null) {
    try {
      const formData = new FormData();

      // Convert FileList to Array if needed
      const fileArray = Array.from(files);
      
      // Append each file
      fileArray.forEach((file) => {
        formData.append('files', file);
      });

      // Append parameters
      formData.append('chunk_size', chunkSize.toString());
      formData.append('overlap', overlap.toString());

      const response = await api.post(`${INGEST_PATH}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted, progressEvent);
          }
        },
        // Increase timeout for large files
        timeout: 300000 // 5 minutes
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Upload Files Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload files',
        details: error.data
      };
    }
  },

  /**
   * Upload a single file
   * @param {File} file - File to upload
   * @param {number} chunkSize - Size of text chunks
   * @param {number} overlap - Overlap between chunks
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Upload response
   */
  async uploadFile(file, chunkSize = 500, overlap = 100, onProgress = null) {
    return this.uploadFiles([file], chunkSize, overlap, onProgress);
  },

  /**
   * Get upload status
   * @param {string} uploadId - Upload task ID
   * @returns {Promise} Upload status
   */
  async getUploadStatus(uploadId) {
    try {
      const response = await api.get(`${INGEST_PATH}/status/${uploadId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Upload Status Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get upload status',
        details: error.data
      };
    }
  },

  /**
   * Get all documents
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Document list
   */
  async getDocuments(page = 1, limit = 10) {
    try {
      const response = await api.get(`${INGEST_PATH}/documents`, {
        params: { page, limit }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Documents Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get documents',
        details: error.data
      };
    }
  },

  /**
   * Get document by ID
   * @param {string} documentId - Document ID
   * @returns {Promise} Document details
   */
  async getDocument(documentId) {
    try {
      const response = await api.get(`${INGEST_PATH}/documents/${documentId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Document Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get document',
        details: error.data
      };
    }
  },

  /**
   * Delete a document
   * @param {string} documentId - Document ID to delete
   * @returns {Promise}
   */
  async deleteDocument(documentId) {
    try {
      await api.delete(`${INGEST_PATH}/documents/${documentId}`);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Delete Document Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete document',
        details: error.data
      };
    }
  },

  /**
   * Download a document
   * @param {string} documentId - Document ID
   * @returns {Promise} Document blob
   */
  async downloadDocument(documentId) {
    try {
      const response = await api.get(
        `${INGEST_PATH}/documents/${documentId}/download`,
        {
          responseType: 'blob'
        }
      );
      
      return {
        success: true,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      console.error('Download Document Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to download document',
        details: error.data
      };
    }
  },

  /**
   * Reprocess a document
   * @param {string} documentId - Document ID to reprocess
   * @param {number} chunkSize - New chunk size
   * @param {number} overlap - New overlap
   * @returns {Promise}
   */
  async reprocessDocument(documentId, chunkSize = 500, overlap = 100) {
    try {
      const response = await api.post(
        `${INGEST_PATH}/documents/${documentId}/reprocess`,
        {
          chunk_size: chunkSize,
          overlap: overlap
        }
      );
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Reprocess Document Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to reprocess document',
        details: error.data
      };
    }
  },

  /**
   * Get processing statistics
   * @returns {Promise} Processing stats
   */
  async getStats() {
    try {
      const response = await api.get(`${INGEST_PATH}/stats`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Stats Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get stats',
        details: error.data
      };
    }
  }
};

export default ingestApi;