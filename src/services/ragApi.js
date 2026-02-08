import api from './api';

const RAG_PATH = '/rag';

/**
 * RAG API Service
 * Public chat – no session management
 */
const ragApi = {
  /**
   * Ask a question with STREAMING (SSE)
   * POST /api/rag/stream
   */
  async askStreaming(query, k = 5, callbacks = {}) {
    const {
      onStatus = () => {},
      onAnswer = () => {},
      onSources = () => {},
      onDone = () => {},
      onError = () => {}
    } = callbacks;

    return new Promise((resolve, reject) => {
      let fullAnswer = '';

      const baseURL = api.defaults.baseURL;
      const url = `${baseURL}${RAG_PATH}/stream`;

      console.log('[RAG] Starting SSE stream to:', url);

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, k })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          function readStream() {
            reader.read().then(({ done, value }) => {
              if (done) {
                console.log('[RAG] Stream completed');
                resolve({ success: true, answer: fullAnswer });
                return;
              }

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              lines.forEach(line => {
                if (!line.startsWith('data: ')) return;

                try {
                  const event = JSON.parse(line.slice(6));
                  console.log('[RAG] Event:', event.type);

                  switch (event.type) {
                    case 'status':
                      onStatus(event.message, event.progress);
                      break;

                    case 'answer':
                      fullAnswer += event.content;
                      onAnswer(event.content, fullAnswer);
                      break;

                    case 'sources':
                      onSources(event.content);
                      break;

                    case 'done':
                      onDone(event.metadata || {});
                      break;

                    case 'warning':
                      console.warn('[RAG] Warning:', event.message);
                      break;

                    case 'error':
                      onError(event.message);
                      reject({
                        success: false,
                        error: event.message
                      });
                      return;
                  }
                } catch (e) {
                  console.error('[RAG] Failed to parse SSE event:', e);
                }
              });

              readStream();
            }).catch(err => {
              console.error('[RAG] Stream read error:', err);
              onError(err.message);
              reject({ success: false, error: err.message });
            });
          }

          readStream();
        })
        .catch(error => {
          console.error('[RAG] Fetch error:', error);
          onError(error.message);
          reject({ success: false, error: error.message });
        });
    });
  },

  /**
   * Download document by ID
   * GET /api/documents/:id/download
   * 
   * @param {number|string} documentId - Document ID
   * @param {string} filename - Filename for download
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async downloadDocument(documentId, filename) {
    try {
      console.log('[Download] Starting download for document:', documentId);

      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob',
        timeout: 30000
      });

      // Create blob and trigger download
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `document-${documentId}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('[Download] Completed:', filename);

      return {
        success: true
      };
    } catch (error) {
      console.error('[Download] Error:', error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to download document'
      };
    }
  }
};

export default ragApi;