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
    async atualizarFavorito(id, novoEstadoFavorito) {
        try {
            const response = await fetch(`${URL_BASE}/pensamentos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ favorito: novoEstadoFavorito }),
            });
            if (!response.ok)
                throw new Error("Problema na resposta da rede");
        }
        catch {
            alert("Erro ao atualizar favorito");
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