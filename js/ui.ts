import api from "./api.js";
import type { InterfacePensamento } from "./interface-pensamento.js";

const ui = {
  async preencherFormulario(pensamentoId: string) {
    const pensamento = (await api.buscarPensamentoPorId(pensamentoId)) as InterfacePensamento;

    const pensamentoIDNaPagina = document.getElementById("pensamento-id") as HTMLInputElement;
    pensamentoIDNaPagina.value = pensamento.id as string;

    const pensamentoConteudoNaPagina = document.getElementById("pensamento-conteudo") as HTMLTextAreaElement;
    pensamentoConteudoNaPagina.value = pensamento.conteudo;

    const pensamentoAutoriaNaPagina = document.getElementById("pensamento-autoria") as HTMLInputElement;
    pensamentoAutoriaNaPagina.value = pensamento.autoria;
  },

  limparFormulario() {
    const formulario = document.getElementById("pensamento-form") as HTMLFormElement;
    if (formulario) {
      formulario.reset();
    }
  },

  async renderizarPensamentos(arrayPensamentos?: InterfacePensamento[]) {
    const listaPensamentos = document.getElementById("lista-pensamentos") as HTMLUListElement;
    const mensagemVazia = document.getElementById("mensagem-vazia") as HTMLDivElement;
    listaPensamentos.innerHTML = "";

    try {
      const pensamentos = (await api.buscarPensamentos()) as InterfacePensamento[];

      if (!pensamentos) {
        return;
      }

      if (typeof arrayPensamentos === "undefined") {
        arrayPensamentos = pensamentos;
        // arrayPensamentos será do tipo InterfacePensamento[]
      }

      if (arrayPensamentos.length === 0) {
        mensagemVazia.style.display = "block";
      } else {
        mensagemVazia.style.display = "none";
        arrayPensamentos.forEach(ui.adicionarPensamentoNaLista);
      }
    } catch {
      alert("Erro ao renderizar pensamentos");
    }
  },

  adicionarPensamentoNaLista(pensamento: InterfacePensamento) {
    if (!pensamento.id) {
      return;
    }

    const listaPensamentos = document.getElementById("lista-pensamentos") as HTMLUListElement;
    const li: HTMLLIElement = document.createElement("li");
    li.setAttribute("data-id", pensamento.id);
    li.classList.add("li-pensamento");

    const iconeAspas = document.createElement("img");
    iconeAspas.src = "assets/imagens/aspas-azuis.png";
    iconeAspas.alt = "Aspas azuis";
    iconeAspas.classList.add("icone-aspas");

    const pensamentoConteudo = document.createElement("div");
    pensamentoConteudo.textContent = pensamento.conteudo;
    pensamentoConteudo.classList.add("pensamento-conteudo");

    const pensamentoAutoria = document.createElement("div");
    pensamentoAutoria.textContent = pensamento.autoria;
    pensamentoAutoria.classList.add("pensamento-autoria");

    const botaoEditar = document.createElement("button");
    botaoEditar.classList.add("botao-editar");
    botaoEditar.onclick = () => ui.preencherFormulario(pensamento.id as string);

    const iconeEditar = document.createElement("img");
    iconeEditar.src = "assets/imagens/icone-editar.png";
    iconeEditar.alt = "Editar";
    botaoEditar.appendChild(iconeEditar);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.classList.add("botao-excluir");
    botaoExcluir.onclick = async () => {
      try {
        await api.excluirPensamento(pensamento.id as string);
        ui.renderizarPensamentos();
      } catch (error) {
        alert("Erro ao excluir pensamento");
      }
    };

    const iconeExcluir = document.createElement("img");
    iconeExcluir.src = "assets/imagens/icone-excluir.png";
    iconeExcluir.alt = "Excluir";
    botaoExcluir.appendChild(iconeExcluir);

    const botaoFavorito = document.createElement("button");
    botaoFavorito.classList.add("botao-favorito");

    const iconeFavorito = document.createElement("img");
    iconeFavorito.src = "assets/imagens/icone-favorito_outline.png";
    iconeFavorito.alt = "Ícone de favorito";
    botaoFavorito.appendChild(iconeFavorito);

    const icones = document.createElement("div");
    icones.classList.add("icones");
    icones.appendChild(botaoFavorito);
    icones.appendChild(botaoEditar);
    icones.appendChild(botaoExcluir);

    li.appendChild(iconeAspas);
    li.appendChild(pensamentoConteudo);
    li.appendChild(pensamentoAutoria);
    li.appendChild(icones);
    listaPensamentos.appendChild(li);
  },
};

export default ui;
