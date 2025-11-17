import ui from "./ui.js";
import api from "./api.js";
import { InterfacePensamento } from "./interface-pensamento.js";

const setPensamentos = new Set<string>();

async function adicionarChaveAoPensamento() {
  try {
    const listaPensamentos = (await api.buscarPensamentos()) as InterfacePensamento[];
    listaPensamentos.forEach((pensamento) => {
      const chavePensamento = `${pensamento.conteudo.trim().toLowerCase()}-${pensamento.autoria.trim().toLowerCase()}`;
      setPensamentos.add(chavePensamento);
    });
  } catch {
    alert("erro ao adicionar chave ao pensamento");
    throw new Error();
  }
}

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

document.addEventListener("DOMContentLoaded", async () => {
  await ui.renderizarPensamentos();
  await adicionarChaveAoPensamento();

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

  if (!validarConteudoRegex(conteudo)) {
    alert("Pensamento deve ter somente letras e espaços, com no mínimo 10 caracteres.");
    return;
  }

  if (!validarAutoriaRegex(autoria)) {
    alert("Autoria pode conter apenas letras, e deve ter de 3 a 15 caracteres.");
    return;
  }

  if (checarSeDataEstaNoFuturo(data)) {
    alert("Data não pode estar no futuro");
    return;
  }

  const chaveNovoPensamento = `${conteudo.trim().toLowerCase()}-${autoria.trim().toLowerCase()}`;

  let chaveAntiga: string = "";

  if (id) {
    // When editing, get the old key to remove it
    const pensamentoAntigo = (await api.buscarPensamentoPorId(id)) as InterfacePensamento;
    chaveAntiga = `${pensamentoAntigo.conteudo.trim().toLowerCase()}-${pensamentoAntigo.autoria.trim().toLowerCase()}`;

    // Check if new key already exists (but not the same as old key)
    if (setPensamentos.has(chaveNovoPensamento) && chaveNovoPensamento !== chaveAntiga) {
      alert("Este pensamento já EXISTE");
      return;
    }
  } else {
    // For new pensamentos, just check if it exists
    if (setPensamentos.has(chaveNovoPensamento)) {
      alert("Este pensamento já EXISTE");
      return;
    }
  }

  try {
    if (id) {
      const pensamentoAtualizado = (await api.editarPensamento({
        id,
        conteudo,
        autoria,
        favorito,
        data,
      })) as InterfacePensamento;

      // Update Set - remove old key and add new one (don't fetch again!)
      setPensamentos.delete(chaveAntiga);
      setPensamentos.add(chaveNovoPensamento);

      const li = document.querySelector(`[data-id="${id}"]`) as HTMLLIElement;
      if (li) {
        li.querySelector(".pensamento-conteudo")!.textContent = pensamentoAtualizado.conteudo;
        li.querySelector(".pensamento-autoria")!.textContent = pensamentoAtualizado.autoria;

        const opcoesDeData: Intl.DateTimeFormatOptions = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        };

        const dataFormatada = pensamentoAtualizado.data
          ? new Date(pensamentoAtualizado.data).toLocaleDateString("pt-br", opcoesDeData)
          : "";

        const dataComRegex = dataFormatada.replace(/^(\w)/, (match) => match.toUpperCase());
        li.querySelector(".pensamento-data")!.textContent = dataComRegex;
      }

      // Atualiza o ícone de favorito
      const iconeFavorito = li.querySelector(".botao-favorito img") as HTMLImageElement;
      if (iconeFavorito) {
        iconeFavorito.src = pensamentoAtualizado.favorito
          ? "./assets/imagens/icone-favorito.png"
          : "./assets/imagens/icone-favorito_outline.png";
      }
    } else {
      // Adiciona novo item
      const novoPensamento = await api.salvarPensamento({ conteudo, autoria, favorito, data });
      if (novoPensamento && typeof novoPensamento === "object" && "id" in novoPensamento) {
        ui.adicionarPensamentoNaLista(novoPensamento);
        // Add to Set!
        setPensamentos.add(chaveNovoPensamento);
      }
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

async function manipularBusca() {
  if (!inputBusca) {
    return;
  }

  const searchTerm = inputBusca.value;

  try {
    const pensamentosFiltrados = await api.pensamentoSearch(searchTerm);
    if (Array.isArray(pensamentosFiltrados)) {
      ui.renderizarPensamentos(pensamentosFiltrados);
    }
  } catch {
    throw new Error("errorrrrr");
  }
}

// if checarSeDataEstaNoFuturo() compares dates without normalizing time, it can cause false positives
// if the current time is later in the day.

function checarSeDataEstaNoFuturo(data: Date): boolean {
  const dataAtual = new Date();
  dataAtual.setHours(0, 0, 0, 0);

  const dataComparar = new Date(data);
  dataComparar.setHours(0, 0, 0, 0);

  return dataComparar > dataAtual;
}

export function removerPensamentoDoSet(conteudo: string, autoria: string) {
  const chave = `${conteudo.trim().toLowerCase()}-${autoria.trim().toLowerCase()}`;
  setPensamentos.delete(chave);
}
