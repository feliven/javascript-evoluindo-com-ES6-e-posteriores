import api from "../js/api.js";
import type { InterfacePensamento } from "../js/interface-pensamento.js";
import { adicionarPensamentoNaLista } from "./adicionarPensamentoNaLista.js";
import { limparFormulario } from "../js/limparFormulario.js";
import { setPensamentos } from "../js/manipularSet.js";

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

// if checarSeDataEstaNoFuturo() compares dates without normalizing time, it can cause false positives
// if the current time is later in the day.

function checarSeDataEstaNoFuturo(data: Date): boolean {
  const dataAtual = new Date();
  dataAtual.setHours(0, 0, 0, 0);

  const dataComparar = new Date(data);
  dataComparar.setHours(0, 0, 0, 0);

  return dataComparar > dataAtual;
}

export async function manipularSubmissaoFormulario(event: SubmitEvent) {
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
        adicionarPensamentoNaLista(novoPensamento);
        // Add to Set!
        setPensamentos.add(chaveNovoPensamento);
      }
      // Oculta mensagem vazia se ela estiver visível
      const mensagemVazia = document.getElementById("mensagem-vazia") as HTMLDivElement;
      if (mensagemVazia) {
        mensagemVazia.style.display = "none";
      }
    }
    limparFormulario();

    const idInput = document.getElementById("pensamento-id") as HTMLInputElement;
    if (idInput) {
      idInput.value = "";
    }
  } catch {
    alert("Erro ao salvar pensamento");
  }
}
