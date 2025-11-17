import api from "./api.js";
export async function preencherFormulario(pensamentoId) {
    const pensamento = (await api.buscarPensamentoPorId(pensamentoId));
    const pensamentoIDNaPagina = document.getElementById("pensamento-id");
    pensamentoIDNaPagina.value = pensamento.id;
    const pensamentoConteudoNaPagina = document.getElementById("pensamento-conteudo");
    pensamentoConteudoNaPagina.value = pensamento.conteudo;
    const pensamentoAutoriaNaPagina = document.getElementById("pensamento-autoria");
    pensamentoAutoriaNaPagina.value = pensamento.autoria;
    const pensamentoDataNaPagina = document.getElementById("pensamento-data");
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
//# sourceMappingURL=preencherFormulario.js.map