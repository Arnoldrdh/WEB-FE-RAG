import api from './api';

class IngestApi {
  /**
   * Upload files synchronously
   */
  async uploadFiles(files) {
    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post('/ingest/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  }

  /**
   * Upload files asynchronously
   */
  async uploadFilesAsync(files) {
    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post('/ingest/upload/async', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Async upload error:', error);
      return {
        success: false,
        error: error.message || 'Async upload failed'
      };
    }
  }

  /**
   * Get task status for async upload
   */
  async getTaskStatus(taskId) {
    try {
      const response = await api.get(`/ingest/status/${taskId}`);

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Get task status error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get task status'
      };
    }
  }

  /**
   * Poll task status until completion
   */
  async pollTaskStatus(taskId, onProgress, interval = 2000) {
    const maxAttempts = 300;
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          attempts++;

          const result = await this.getTaskStatus(taskId);

          if (!result.success) {
            clearInterval(intervalId);
            reject(new Error(result.error));
            return;
          }

          const status = result.data;

          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'completed' || status.processed === status.total) {
            clearInterval(intervalId);
            resolve(status);
          } else if (status.status === 'failed') {
            clearInterval(intervalId);
            reject(new Error('Task failed'));
          } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            reject(new Error('Timeout waiting for task completion'));
          }

        } catch (error) {
          clearInterval(intervalId);
          reject(error);
        }
      }, interval);
    });
  }
}

export default new IngestApi();