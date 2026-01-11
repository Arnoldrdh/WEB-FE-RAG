import api from "./index";

const INGEST_PATH = import.meta.env.VITE_API_INGEST_PATH;

const ingestApi = {
  uploadFiles(files, chunkSize = 500, overlap = 100) {
    const formData = new FormData();

    files.forEach(file => {
      formData.append("files", file);
    });

    formData.append("chunk_size", chunkSize);
    formData.append("overlap", overlap);

    return api.post(`${INGEST_PATH}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
};

export default ingestApi;
