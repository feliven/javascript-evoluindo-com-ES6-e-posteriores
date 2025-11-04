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

    const pensamentoDataNaPagina = document.getElementById("pensamento-data") as HTMLInputElement;
    // quando vem do backend (via api.buscarPensamentoPorId()), pensamento.data é uma string ISO,
    // por isso convertemos para Date antes de chamar .toISOString()
    const dataFormatada = pensamento.data ? new Date(pensamento.data).toISOString().split("T")[0] : "";
    if (dataFormatada) {
      pensamentoDataNaPagina.value = dataFormatada;
    }

    // Estamos recebendo a data "1989-07-11T00:00:00.000" no formato UTC, e precisamos fazer
    // com que o input de data a reconheça. Para isso, utilizamos o toISOString().
    // Também fizemos um split(), portanto, a quebra acontecerá a partir do T,
    // e será dividida em duas partes: a primeira com a data e a segunda com o horário.
    // Por fim, o array entre colchetes que informamos com o valor zero indica que
    // queremos o primeiro elemento desse array — ou seja, a data.

    document.getElementById("form-container")?.scrollIntoView();
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

    const opcoesDeData: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    };

    const pensamentoData = document.createElement("div");
    const pensamentoDataComoString = pensamento.data
      ? new Date(pensamento.data).toLocaleDateString("pt-br", opcoesDeData)
      : null;
    pensamentoData.textContent = pensamentoDataComoString;
    pensamentoData.classList.add("pensamento-data");

    const botaoEditar = document.createElement("button");
    botaoEditar.type = "button";
    botaoEditar.classList.add("botao-editar");
    botaoEditar.onclick = (event) => {
      event.preventDefault();
      ui.preencherFormulario(pensamento.id as string);
    };

    const iconeEditar = document.createElement("img");
    iconeEditar.src = "assets/imagens/icone-editar.png";
    iconeEditar.alt = "Editar";
    botaoEditar.appendChild(iconeEditar);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.classList.add("botao-excluir");
    botaoExcluir.type = "button";
    botaoExcluir.onclick = async (event) => {
      event.preventDefault();
      try {
        await api.excluirPensamento(pensamento.id as string);

        // Remove only this specific list item from the DOM
        li.remove();

        // Check if the list is now empty and show the empty message if needed
        const listaPensamentos = document.getElementById("lista-pensamentos") as HTMLUListElement;
        const mensagemVazia = document.getElementById("mensagem-vazia") as HTMLDivElement;

        if (listaPensamentos.children.length === 0) {
          mensagemVazia.style.display = "block";
        }
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
    botaoFavorito.type = "button";
    botaoFavorito.onclick = async (event) => {
      event.preventDefault();
      try {
        await api.atualizarFavorito(pensamento.id as string);

        // Toggle the icon without re-rendering the entire list
        const isFavorited = iconeFavorito.src.includes("icone-favorito.png");
        iconeFavorito.src = isFavorited
          ? "assets/imagens/icone-favorito_outline.png"
          : "assets/imagens/icone-favorito.png";

        // Update the pensamento object to keep state in sync
        pensamento.favorito = !pensamento.favorito;
      } catch (error) {
        alert("Erro ao atualizar favorito");
      }
    };

    const iconeFavorito = document.createElement("img");
    iconeFavorito.src = pensamento.favorito
      ? "assets/imagens/icone-favorito.png"
      : "assets/imagens/icone-favorito_outline.png";
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
    li.appendChild(pensamentoData);
    li.appendChild(icones);
    listaPensamentos.appendChild(li);
  },
};

export default ui;
