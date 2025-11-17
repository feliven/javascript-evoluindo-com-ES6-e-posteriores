import api from "./api.js";
import { InterfacePensamento } from "./interface-pensamento.js";
import { renderizarPensamentos } from "./renderizarPensamentos.js";
import { manipularSubmissaoFormulario } from "./manipularSubmissaoFormulario.js";
import { setPensamentos } from "./manipularSet.js";
import { limparFormulario } from "./limparFormulario.js";

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

document.addEventListener("DOMContentLoaded", async () => {
  await renderizarPensamentos();
  await adicionarChaveAoPensamento();

  formularioPensamento = document.getElementById("pensamento-form") as HTMLFormElement;
  botaoCancelar = document.getElementById("botao-cancelar") as HTMLButtonElement;
  inputBusca = document.getElementById("campo-busca") as HTMLInputElement;

  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
  botaoCancelar.addEventListener("click", manipularCancelamento);
  inputBusca.addEventListener("input", manipularBusca);
});

function manipularCancelamento() {
  limparFormulario();
}

async function manipularBusca() {
  if (!inputBusca) {
    return;
  }

  const searchTerm = inputBusca.value;

  try {
    const pensamentosFiltrados = await api.pensamentoSearch(searchTerm);
    if (Array.isArray(pensamentosFiltrados)) {
      renderizarPensamentos(pensamentosFiltrados);
    }
  } catch {
    throw new Error("errorrrrr");
  }
}
