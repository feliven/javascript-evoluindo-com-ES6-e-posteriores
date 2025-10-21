import ui from "./ui.js";
import api from "./api.js";
let formularioPensamento;
let botaoCancelar;
let botaoFavorito;
let inputBusca;
document.addEventListener("DOMContentLoaded", () => {
    ui.renderizarPensamentos();
    formularioPensamento = document.getElementById("pensamento-form");
    botaoCancelar = document.getElementById("botao-cancelar");
    // botaoFavorito = document.getElementById("botao-favorito") as HTMLButtonElement;
    inputBusca = document.getElementById("campo-busca");
    formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
    botaoCancelar.addEventListener("click", manipularCancelamento);
    // botaoFavorito.addEventListener("click", manipularFavorito);
    inputBusca.addEventListener("input", manipularBusca);
});
async function manipularSubmissaoFormulario(event) {
    event.preventDefault();
    const idSemValue = document.getElementById("pensamento-id");
    const id = idSemValue ? idSemValue.value : "";
    const conteudoSemValue = document.getElementById("pensamento-conteudo");
    const conteudo = conteudoSemValue ? conteudoSemValue.value : "";
    const autoriaSemValue = document.getElementById("pensamento-autoria");
    const autoria = autoriaSemValue ? autoriaSemValue.value : "";
    const favorito = false;
    try {
        if (id) {
            // Update existing item
            const updatedPensamento = await api.editarPensamento({ id, conteudo, autoria, favorito });
            // Find and update the specific li element using SERVER DATA
            const li = document.querySelector(`[data-id="${id}"]`);
            if (li) {
                li.querySelector(".pensamento-conteudo").textContent = updatedPensamento.conteudo;
                li.querySelector(".pensamento-autoria").textContent = updatedPensamento.autoria;
            }
            // Also update the favorite icon in case favorito changed
            const iconeFavorito = li.querySelector(".botao-favorito img");
            if (iconeFavorito) {
                iconeFavorito.src = updatedPensamento.favorito
                    ? "assets/imagens/icone-favorito.png"
                    : "assets/imagens/icone-favorito_outline.png";
            }
        }
        else {
            // Add new item
            const novoPensamento = await api.salvarPensamento({ conteudo, autoria, favorito });
            ui.adicionarPensamentoNaLista(novoPensamento);
            // Hide empty message if visible
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
        throw new Error("");
    }
}
//# sourceMappingURL=main.js.map