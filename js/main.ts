import ui from "./ui.js";
import api from "./api.js";
import { InterfacePensamento } from "./interface-pensamento.js";

let formularioPensamento: HTMLFormElement | null;
let botaoCancelar: HTMLButtonElement | null;
let inputBusca: HTMLInputElement | null;

const filtroRegexConteudo = /^[a-zA-Z ]{10,}$/;
const filtroRegexAutoria = /^[a-zA-Z]{3,15}$/;

function validarConteudoRegex(conteudo: string) {
  return filtroRegexConteudo.test(conteudo.trim());
}

function validarAutoriaRegex(autoria: string) {
  return filtroRegexAutoria.test(autoria.trim());
}

function removerEspacos(texto: string) {
  return texto.replaceAll(/\s+/g, "");
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos();

  formularioPensamento = document.getElementById("pensamento-form") as HTMLFormElement;
  botaoCancelar = document.getElementById("botao-cancelar") as HTMLButtonElement;
  inputBusca = document.getElementById("campo-busca") as HTMLInputElement;

  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
  botaoCancelar.addEventListener("click", manipularCancelamento);
  inputBusca.addEventListener("input", manipularBusca);
});

async function manipularSubmissaoFormulario(event: SubmitEvent) {
  event.preventDefault();
  const idElemento = document.getElementById("pensamento-id") as HTMLInputElement;
  const id = idElemento ? idElemento.value : "";
  const conteudoElemento = document.getElementById("pensamento-conteudo") as HTMLTextAreaElement;
  const conteudo = conteudoElemento ? conteudoElemento.value : "";
  const autoriaElemento = document.getElementById("pensamento-autoria") as HTMLInputElement;
  const autoria = autoriaElemento ? autoriaElemento.value : "";
  const dataElemento = document.getElementById("pensamento-data") as HTMLInputElement;
  const dataString = dataElemento ? dataElemento.value : ""; // it is in a ISO 8601 standard format ("YYYY-MM-DD")
  const data = new Date(dataString + "T00:00:00"); // meia-noite no horário local

  const favorito = false;

  const conteudoSemEspacos = removerEspacos(conteudo);
  const autoriaSemEspacos = removerEspacos(autoria);

  if (!validarConteudoRegex(conteudoSemEspacos)) {
    alert("Pensamento deve ter somente letras e espaços, com no mínimo 10 caracteres.");
    return;
  }

  if (!validarAutoriaRegex(autoriaSemEspacos)) {
    alert("Autoria pode conter apenas letras, e deve ter de 3 a 15 caracteres.");
    return;
  }

  if (checarSeDataEstaNoFuturo(data)) {
    alert("Data não pode estar no futuro");
    return;
  }

  try {
    if (id) {
      const pensamentoAtualizado: InterfacePensamento = await api.editarPensamento({
        id,
        conteudo,
        autoria,
        favorito,
        data,
      });

      const li = document.querySelector(`[data-id="${id}"]`) as HTMLLIElement;
      if (li) {
        li.querySelector(".pensamento-conteudo")!.textContent = pensamentoAtualizado.conteudo;
        li.querySelector(".pensamento-autoria")!.textContent = pensamentoAtualizado.autoria;
        li.querySelector(".pensamento-data")!.textContent = pensamentoAtualizado.data
          ? pensamentoAtualizado.data.toString()
          : null;
      }

      // Atualiza o ícone de favorito
      const iconeFavorito = li.querySelector(".botao-favorito img") as HTMLImageElement;
      if (iconeFavorito) {
        iconeFavorito.src = pensamentoAtualizado.favorito
          ? "assets/imagens/icone-favorito.png"
          : "assets/imagens/icone-favorito_outline.png";
      }
    } else {
      // Adiciona novo item
      const novoPensamento = await api.salvarPensamento({ conteudo, autoria, favorito, data });
      ui.adicionarPensamentoNaLista(novoPensamento);
      // Oculta mensagem vazia se ela estiver visível
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
    throw new Error("errorrrrr");
  }
}

function checarSeDataEstaNoFuturo(data: Date): boolean {
  const dataAtual = new Date();

  return data > dataAtual;
}
