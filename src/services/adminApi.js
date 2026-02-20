import api from './api';

class AdminApi {
  /**
   * Get overall statistics
   */
  async getStats() {
    try {
      console.log('Fetching stats from /admin/stats...');
      
      const response = await api.get('/admin/stats');
      
      console.log('Stats response:', response.data);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      }

      return {
        success: false,
        error: 'Invalid response format'
      };

    } catch (error) {
      console.error('Get stats error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to get statistics',
        data: {
          total: 0,
          completed: 0,
        }
      };
    }
  }

  /**
   * Get all documents with pagination
   */
  async getDocuments(page = 1, limit = 100) {
    try {
      // console.log(`Fetching documents page ${page}...`);
      
      const response = await api.get('/admin/documents', {
        params: { page, limit }
      });
      
      // console.log('Documents response:', response.data);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      }

      return {
        success: false,
        error: 'Invalid response format'
      };

    } catch (error) {
      console.error('Get documents error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to get documents',
        data: {
          documents: [],
          total: 0,
          page,
          limit
        }
      };
    }
  }

  /**
   * Get single document details
   */
  async getDocumentById(docId) {
    try {
      console.log(`Fetching document ${docId}...`);
      
      const response = await api.get(`/admin/documents/${docId}`);

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      }

      return {
        success: false,
        error: 'Document not found'
      };

    } catch (error) {
      console.error('Get document error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get document'
      };
    }
  }

  /**
   * Delete document by ID
   */
  async deleteDocument(docId) {
    try {
      console.log(`Deleting document ${docId}...`);
      
      const response = await api.delete(`/admin/documents/${docId}`);

      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Document deleted successfully',
          data: response.data.data
        };
      }

      return {
        success: false,
        error: 'Failed to delete document'
      };

    } catch (error) {
      console.error('Delete document error:', error);
      
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          error: 'Document not found'
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to delete document'
      };
    }
  }

  /**
   * Bulk delete documents
   */
  async deleteDocuments(docIds) {
    try {
      console.log(`Deleting ${docIds.length} documents...`);
      
      const results = await Promise.allSettled(
        docIds.map(id => this.deleteDocument(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.length - successful;

      return {
        success: failed === 0,
        message: `Deleted ${successful} of ${results.length} documents`,
        deleted: successful,
        failed: failed
      };

    } catch (error) {
      console.error('Bulk delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete documents'
      };
    }
  }
}

export default new AdminApi();