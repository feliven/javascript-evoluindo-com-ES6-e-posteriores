import type { InterfacePensamento } from "./interface-pensamento.js";

const URL_BASE = "http://localhost:3000";

const api = {
  async buscarPensamentos() {
    try {
      const response = await fetch(`${URL_BASE}/pensamentos`);
      if (!response.ok) throw new Error("Problema na resposta da rede");
      return await response.json();
    } catch {
      alert("Erro ao buscar pensamentos");
      throw Error;
    }
  },

  async salvarPensamento(pensamento: InterfacePensamento) {
    try {
      const response = await fetch(`${URL_BASE}/pensamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pensamento),
      });
      if (!response.ok) throw new Error("Problema na resposta da rede");
      return await response.json();
    } catch {
      alert("Erro ao salvar pensamento");
      throw Error;
    }
  },

  async buscarPensamentoPorId(id: string) {
    try {
      const response = await fetch(`${URL_BASE}/pensamentos/${id}`);
      if (!response.ok) throw new Error("Problema na resposta da rede");
      return await response.json();
    } catch {
      alert("Erro ao buscar pensamento");
      throw Error;
    }
  },

  async editarPensamento(pensamento: InterfacePensamento) {
    try {
      const response = await fetch(`${URL_BASE}/pensamentos/${pensamento.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pensamento),
      });
      if (!response.ok) throw new Error("Problema na resposta da rede");
      return await response.json();
    } catch {
      alert("Erro ao editar pensamento");
      throw Error;
    }
  },

  async atualizarFavorito(id: string) {
    try {
      const response = await fetch(`${URL_BASE}/pensamentos/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Problema na resposta da rede");

      let responseJSON = (await response.json()) as InterfacePensamento;
      if (responseJSON.favorito === true) {
        responseJSON.favorito = false;
      } else {
        responseJSON.favorito = true;
      }
      await this.editarPensamento(responseJSON);
    } catch {
      alert("Erro ao editar um pensamento");
      throw Error;
    }
  },

  async excluirPensamento(id: string) {
    try {
      const response = await fetch(`${URL_BASE}/pensamentos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Problema na resposta da rede");
    } catch {
      alert("Erro ao excluir um pensamento");
      throw Error;
    }
  },

  async pensamentoSearch(searchTerm: string) {
    try {
      const todosOsPensamentos = (await this.buscarPensamentos()) as InterfacePensamento[];
      const termoDeBuscaEmMinusculas = searchTerm.toLowerCase();

      const pensamentosFiltrados = todosOsPensamentos.filter((pensamento) => {
        return (
          pensamento.conteudo.toLowerCase().includes(termoDeBuscaEmMinusculas) ||
          pensamento.autoria.toLowerCase().includes(termoDeBuscaEmMinusculas)
        );
      });

      return pensamentosFiltrados;
    } catch (error) {
      throw new Error("${error}");
    }
  },
};

export default api;
