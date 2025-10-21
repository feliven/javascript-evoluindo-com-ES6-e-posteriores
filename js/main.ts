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
      await api.editarPensamento({ id, conteudo, autoria, favorito });
    } else {
      await api.salvarPensamento({ conteudo, autoria, favorito });
    }
    ui.renderizarPensamentos();
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
