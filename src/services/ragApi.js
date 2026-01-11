import api from "./index";

const RAG_PATH = import.meta.env.VITE_API_RAG_PATH;

const ragApi = {
  ask(query, k = 5) {
    return api.post(`${RAG_PATH}/ask`, { query, k });
  }
};

export default ragApi;
