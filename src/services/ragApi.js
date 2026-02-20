import api from './api';

const RAG_PATH = '/rag';

/**
 * RAG API Service
 * Public chat - no session management
 */
const ragApi = {
  /**
   * Ask a question with STREAMING (SSE)
   * POST /api/rag/stream
   */
  async askStreaming(query, k = 5, callbacks = {}) {
    const {
      onStatus  = () => {},
      onAnswer  = () => {},
      onSources = () => {},
      onDone    = () => {},
      onError   = () => {}
    } = callbacks;

    return new Promise((resolve, reject) => {
      // FIX: fullAnswer tidak di-accumulate di sini
      // Backend sudah kirim full answer sekaligus, bukan per-chunk
      // Jadi cukup simpan value terakhir yang diterima
      let lastAnswer = '';

      const baseURL = api.defaults.baseURL;
      const url = `${baseURL}${RAG_PATH}/stream`;

      // console.log('[RAG] Starting SSE stream to:', url);

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

          const reader  = response.body.getReader();
          const decoder = new TextDecoder();

          //track apakah sudah resolve/reject agar tidak dipanggil dua kali
          let settled = false;

          function readStream() {
            reader.read().then(({ done, value }) => {

              if (done) {
                // console.log('[RAG] Stream completed (reader done)');
                // Hanya resolve jika belum settled oleh event 'done' dari backend
                if (!settled) {
                  settled = true;
                  resolve({ success: true, answer: lastAnswer });
                }
                return;
              }

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (!line.startsWith('data: ')) continue;

                try {
                  const event = JSON.parse(line.slice(6));
                  // console.log('[RAG] Event:', event.type);

                  switch (event.type) {

                    case 'status':
                      onStatus(event.message, event.progress);
                      break;

                    case 'answer':
                      // FIX: assign langsung, bukan +=
                      // Backend kirim full_answer sekaligus bukan per-chunk
                      lastAnswer = event.content;
                      onAnswer(event.content, lastAnswer);
                      break;

                    case 'sources':
                      onSources(event.content);
                      break;

                    case 'done':
                      onDone(event.metadata || {});
                      // FIX: resolve di sini, bukan tunggu reader done
                      if (!settled) {
                        settled = true;
                        resolve({ success: true, answer: lastAnswer });
                      }
                      break;

                    case 'warning':
                      console.warn('[RAG] Warning:', event.message);
                      break;

                    case 'error':
                      onError(event.message);
                      if (!settled) {
                        settled = true;
                        // FIX: reject dengan Error object agar catch di ChatContainer
                        // bisa baca .message dengan benar
                        reject(new Error(event.message));
                      }
                      return;
                  }

                } catch (e) {
                  console.error('[RAG] Failed to parse SSE event:', line, e);
                  // Lanjut ke line berikutnya, jangan stop stream
                }
              }

              readStream();

            }).catch(err => {
              console.error('[RAG] Stream read error:', err);
              onError(err.message);
              if (!settled) {
                settled = true;
                reject(new Error(err.message));
              }
            });
          }

          readStream();
        })
        .catch(error => {
          console.error('[RAG] Fetch error:', error);
          onError(error.message);
          reject(new Error(error.message));
        });
    });
  },

  /**
   * Download document by ID
   * GET /api/documents/:id/download
   */
  async downloadDocument(documentId, filename) {
    try {
      console.log('[Download] Starting download for document:', documentId);

      const response = await api.get(`/documents/${documentId}/download`, {
        responseType: 'blob',
        timeout: 30000
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/pdf'
      });

      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = filename || `document-${documentId}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('[Download] Completed:', filename);
      return { success: true };

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