const URL_BASE = "http://localhost:3000";
const api = {
    async buscarPensamentos() {
        try {
            const response = await fetch(`${URL_BASE}/pensamentos`);
            if (!response.ok)
                throw new Error("Problema na resposta da rede");
            return await response.json();
        }
        catch {
            alert("Erro ao buscar pensamentos");
            throw new Error();
        }
    },
    async salvarPensamento(pensamento) {
        try {
            const response = await fetch(`${URL_BASE}/pensamentos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(pensamento),
            });
            if (!response.ok)
                throw new Error("Problema na resposta da rede");
            return await response.json();
        }
        catch {
            alert("Erro ao salvar pensamento");
            throw new Error();
        }
    },
    async buscarPensamentoPorId(id) {
        try {
            const response = await fetch(`${URL_BASE}/pensamentos/${id}`);
            if (!response.ok)
                throw new Error("Problema na resposta da rede");
            return await response.json();
        }
        catch {
            alert("Erro ao buscar pensamento");
            throw new Error();
        }
    },
    async editarPensamento(pensamento) {
        try {
            const response = await fetch(`${URL_BASE}/pensamentos/${pensamento.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(pensamento),
            });
            if (!response.ok)
                throw new Error("Problema na resposta da rede");
            return await response.json();
        }
        catch {
            alert("Erro ao editar pensamento");
            throw new Error();
        }
    },
    async atualizarFavorito(id) {
        try {
            const response = await fetch(`${URL_BASE}/pensamentos/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok)
                throw new Error("Problema na resposta da rede");
            let responseJSON = (await response.json());
            if (responseJSON.favorito === true) {
                responseJSON.favorito = false;
            }
            else {
                responseJSON.favorito = true;
            }
            await this.editarPensamento(responseJSON);
        }
        catch {
            alert("Erro ao editar um pensamento");
            throw new Error();
        }
    },
    async excluirPensamento(id) {
        try {
            const response = await fetch(`${URL_BASE}/pensamentos/${id}`, {
                method: "DELETE",
            });
            if (!response.ok)
                throw new Error("Problema na resposta da rede");
        }
        catch {
            alert("Erro ao excluir um pensamento");
            throw new Error();
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
        catch {
            throw new Error();
        }
    },
};
export default api;
//# sourceMappingURL=api.js.map