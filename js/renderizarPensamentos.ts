import api from "./api.js";
import type { InterfacePensamento } from "./interface-pensamento.js";
import { adicionarPensamentoNaLista } from "./adicionarPensamentoNaLista.js";

export async function renderizarPensamentos(arrayPensamentos?: InterfacePensamento[]): Promise<void> {
  const listaPensamentos = document.getElementById("lista-pensamentos") as HTMLUListElement;
  const mensagemVazia = document.getElementById("mensagem-vazia") as HTMLDivElement;
  listaPensamentos.innerHTML = "";

  try {
    const pensamentos = (await api.buscarPensamentos()) as InterfacePensamento[];

    // The check if (!pensamentos) will never be true because an empty array is truthy
    if (pensamentos.length === 0) {
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
      arrayPensamentos.forEach(adicionarPensamentoNaLista);
    }
  } catch {
    alert("Erro ao renderizar pensamentos");
  }
}
