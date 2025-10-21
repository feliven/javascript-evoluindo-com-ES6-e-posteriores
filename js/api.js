import axios from "axios";
const URL_BASE = "http://localhost:3000";
const api = {
    async buscarPensamentos() {
        try {
            const response = await axios.get(`${URL_BASE}/pensamentos`);
            return await response.data;
        }
        catch {
            alert("Erro ao buscar pensamentos");
            throw Error;
        }
    },
    async salvarPensamento(pensamento) {
        try {
            const response = await axios.post(`${URL_BASE}/pensamentos`, pensamento);
            return await response.data;
        }
        catch {
            alert("Erro ao salvar pensamento");
            throw Error;
        }
    },
    async buscarPensamentoPorId(id) {
        try {
            const response = await axios.get(`${URL_BASE}/pensamentos/${id}`);
            return await response.data;
        }
        catch {
            alert("Erro ao buscar pensamento");
            throw Error;
        }
    },
    async editarPensamento(pensamento) {
        try {
            const response = await axios.put(`${URL_BASE}/pensamentos/${pensamento.id}`, pensamento);
            return await response.data;
        }
        catch {
            alert("Erro ao editar pensamento");
            throw Error;
        }
    },
    async excluirPensamento(id) {
        try {
            const response = await axios.delete(`${URL_BASE}/pensamentos/${id}`);
        }
        catch {
            alert("Erro ao excluir um pensamento");
            throw Error;
        }
    },
    async pensamentoSearch(searchTerm) {
        try {
            const todosOsPensamentos = (await this.buscarPensamentos());
            const termoDeBuscaEmMinusculas = searchTerm.toLowerCase();
            const pensamentosFiltrados = todosOsPensamentos.filter((pensamento) => {
                return (pensamento.conteudo.toLowerCase().includes(termoDeBuscaEmMinusculas) ||
                    pensamento.autoria.toLowerCase().includes(termoDeBuscaEmMinusculas));
            });
            return pensamentosFiltrados;
        }
        catch (error) {
            throw new Error("${error}");
        }
    },
};
export default api;
//# sourceMappingURL=api.js.map