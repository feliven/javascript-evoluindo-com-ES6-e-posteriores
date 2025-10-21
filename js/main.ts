import ui from "./ui.js";
import api from "./api.js";

let formularioPensamento: HTMLFormElement | null;
let botaoCancelar: HTMLButtonElement | null;
let botaoFavorito: HTMLButtonElement | null;
let inputBusca: HTMLInputElement | null;

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos();

  formularioPensamento = document.getElementById("pensamento-form") as HTMLFormElement;
  botaoCancelar = document.getElementById("botao-cancelar") as HTMLButtonElement;
  // botaoFavorito = document.getElementById("botao-favorito") as HTMLButtonElement;
  inputBusca = document.getElementById("campo-busca") as HTMLInputElement;

  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
  botaoCancelar.addEventListener("click", manipularCancelamento);
  // botaoFavorito.addEventListener("click", manipularFavorito);
  inputBusca.addEventListener("input", manipularBusca);
});

async function manipularSubmissaoFormulario(event: SubmitEvent) {
  event.preventDefault();
  const idSemValue = document.getElementById("pensamento-id") as HTMLInputElement;
  const id = idSemValue ? idSemValue.value : "";
  const conteudoSemValue = document.getElementById("pensamento-conteudo") as HTMLTextAreaElement;
  const conteudo = conteudoSemValue ? conteudoSemValue.value : "";
  const autoriaSemValue = document.getElementById("pensamento-autoria") as HTMLInputElement;
  const autoria = autoriaSemValue ? autoriaSemValue.value : "";

  const favorito = false;

  try {
    if (id) {
      // Update existing item
      const updatedPensamento = await api.editarPensamento({ id, conteudo, autoria, favorito });
      // Find and update the specific li element using SERVER DATA
      const li = document.querySelector(`[data-id="${id}"]`) as HTMLLIElement;
      if (li) {
        li.querySelector(".pensamento-conteudo")!.textContent = updatedPensamento.conteudo;
        li.querySelector(".pensamento-autoria")!.textContent = updatedPensamento.autoria;
      }

      // Also update the favorite icon in case favorito changed
      const iconeFavorito = li.querySelector(".botao-favorito img") as HTMLImageElement;
      if (iconeFavorito) {
        iconeFavorito.src = updatedPensamento.favorito
          ? "assets/imagens/icone-favorito.png"
          : "assets/imagens/icone-favorito_outline.png";
      }
    } else {
      // Add new item
      const novoPensamento = await api.salvarPensamento({ conteudo, autoria, favorito });
      ui.adicionarPensamentoNaLista(novoPensamento);
      // Hide empty message if visible
      const mensagemVazia = document.getElementById("mensagem-vazia") as HTMLDivElement;
      if (mensagemVazia) {
        mensagemVazia.style.display = "none";
      }
    }
    ui.limparFormulario();

    const idInput = document.getElementById("pensamento-id") as HTMLInputElement;
    if (idInput) {
      idInput.value = "";
    }
  } catch {
    alert("Erro ao salvar pensamento");
  }
}

function manipularCancelamento() {
  ui.limparFormulario();
}

async function manipularFavorito() {
  try {
    const idSemValue = document.getElementById("pensamento-id") as HTMLInputElement;
    const id = idSemValue ? idSemValue.value : "";

    if (id) {
      await api.atualizarFavorito(id);
    }
  } catch (error) {
    throw new Error("ERRO");
  }
}

async function manipularBusca() {
  if (!inputBusca) {
    return;
  }

  const searchTerm = inputBusca.value;

  try {
    const pensamentosFiltrados = await api.pensamentoSearch(searchTerm);
    ui.renderizarPensamentos(pensamentosFiltrados);
  } catch (error) {
    throw new Error("");
  }
}
