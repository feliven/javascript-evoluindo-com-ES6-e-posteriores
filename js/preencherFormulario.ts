import api from "./api.js";
import type { InterfacePensamento } from "./interface-pensamento.js";

export async function preencherFormulario(pensamentoId: string): Promise<void> {
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
}
