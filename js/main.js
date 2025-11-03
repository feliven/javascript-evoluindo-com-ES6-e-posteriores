import ui from "./ui.js";
import api from "./api.js";
let formularioPensamento;
let botaoCancelar;
let inputBusca;
document.addEventListener("DOMContentLoaded", () => {
    ui.renderizarPensamentos();
    formularioPensamento = document.getElementById("pensamento-form");
    botaoCancelar = document.getElementById("botao-cancelar");
    inputBusca = document.getElementById("campo-busca");
    formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
    botaoCancelar.addEventListener("click", manipularCancelamento);
    inputBusca.addEventListener("input", manipularBusca);
});
async function manipularSubmissaoFormulario(event) {
    event.preventDefault();
    const idElemento = document.getElementById("pensamento-id");
    const id = idElemento ? idElemento.value : "";
    const conteudoElemento = document.getElementById("pensamento-conteudo");
    const conteudo = conteudoElemento ? conteudoElemento.value : "";
    const autoriaElemento = document.getElementById("pensamento-autoria");
    const autoria = autoriaElemento ? autoriaElemento.value : "";
    const dataElemento = document.getElementById("pensamento-data");
    const dataString = dataElemento ? dataElemento.value : ""; // it is in a ISO 8601 standard format ("YYYY-MM-DD")
    const data = new Date(dataString + "T00:00:00"); // meia-noite no horário local
    const favorito = false;
    if (checarSeDataEstaNoFuturo(data)) {
        alert("Data não pode estar no futuro");
        return;
    }
    try {
        if (id) {
            const pensamentoAtualizado = await api.editarPensamento({
                id,
                conteudo,
                autoria,
                favorito,
                data,
            });
            const li = document.querySelector(`[data-id="${id}"]`);
            if (li) {
                li.querySelector(".pensamento-conteudo").textContent = pensamentoAtualizado.conteudo;
                li.querySelector(".pensamento-autoria").textContent = pensamentoAtualizado.autoria;
                li.querySelector(".pensamento-data").textContent = pensamentoAtualizado.data
                    ? pensamentoAtualizado.data.toString()
                    : null;
            }
            // Atualiza o ícone de favorito
            const iconeFavorito = li.querySelector(".botao-favorito img");
            if (iconeFavorito) {
                iconeFavorito.src = pensamentoAtualizado.favorito
                    ? "assets/imagens/icone-favorito.png"
                    : "assets/imagens/icone-favorito_outline.png";
            }
        }
        else {
            // Adiciona novo item
            const novoPensamento = await api.salvarPensamento({ conteudo, autoria, favorito, data });
            ui.adicionarPensamentoNaLista(novoPensamento);
            // Oculta mensagem vazia se ela estiver visível
            const mensagemVazia = document.getElementById("mensagem-vazia");
            if (mensagemVazia) {
                mensagemVazia.style.display = "none";
            }
        }
        ui.limparFormulario();
        const idInput = document.getElementById("pensamento-id");
        if (idInput) {
            idInput.value = "";
        }
    }
    catch {
        alert("Erro ao salvar pensamento");
    }
}
function manipularCancelamento() {
    ui.limparFormulario();
}
async function manipularFavorito() {
    try {
        const idSemValue = document.getElementById("pensamento-id");
        const id = idSemValue ? idSemValue.value : "";
        if (id) {
            await api.atualizarFavorito(id);
        }
    }
    catch (error) {
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
    }
    catch (error) {
        throw new Error("errorrrrr");
    }
}
function checarSeDataEstaNoFuturo(data) {
    const dataAtual = new Date();
    return data > dataAtual;
}
//# sourceMappingURL=main.js.map