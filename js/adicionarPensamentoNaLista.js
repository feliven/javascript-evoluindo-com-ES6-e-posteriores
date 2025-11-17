import api from "./api.js";
import { preencherFormulario } from "./preencherFormulario.js";
import { removerPensamentoDoSet } from "./manipularSet.js";
export function adicionarPensamentoNaLista(pensamento) {
    if (!pensamento.id) {
        return;
    }
    const listaPensamentos = document.getElementById("lista-pensamentos");
    const li = document.createElement("li");
    li.setAttribute("data-id", pensamento.id);
    li.classList.add("li-pensamento");
    const iconeAspas = document.createElement("img");
    iconeAspas.src = "./assets/imagens/aspas-azuis.png";
    iconeAspas.alt = "Aspas azuis";
    iconeAspas.classList.add("icone-aspas");
    const pensamentoConteudo = document.createElement("div");
    pensamentoConteudo.textContent = pensamento.conteudo;
    pensamentoConteudo.classList.add("pensamento-conteudo");
    const pensamentoAutoria = document.createElement("div");
    pensamentoAutoria.textContent = pensamento.autoria;
    pensamentoAutoria.classList.add("pensamento-autoria");
    const opcoesDeData = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    };
    const pensamentoData = document.createElement("div");
    const pensamentoDataComoString = pensamento.data
        ? new Date(pensamento.data).toLocaleDateString("pt-br", opcoesDeData)
        : null;
    // o nome do dia da semana presente no card terá letra inicial maiúscula
    const dataComRegex = pensamentoDataComoString
        ? pensamentoDataComoString.replace(/^(\w)/, (match) => match.toUpperCase())
        : "";
    pensamentoData.textContent = dataComRegex;
    pensamentoData.classList.add("pensamento-data");
    const botaoEditar = document.createElement("button");
    botaoEditar.type = "button";
    botaoEditar.classList.add("botao-editar");
    botaoEditar.onclick = (event) => {
        event.preventDefault();
        preencherFormulario(pensamento.id);
    };
    const iconeEditar = document.createElement("img");
    iconeEditar.src = "./assets/imagens/icone-editar.png";
    iconeEditar.alt = "Editar";
    botaoEditar.appendChild(iconeEditar);
    const botaoExcluir = document.createElement("button");
    botaoExcluir.classList.add("botao-excluir");
    botaoExcluir.type = "button";
    botaoExcluir.onclick = async (event) => {
        event.preventDefault();
        try {
            await api.excluirPensamento(pensamento.id);
            // Update the Set
            removerPensamentoDoSet(pensamento.conteudo, pensamento.autoria);
            // Remove only this specific list item from the DOM
            li.remove();
            // Check if the list is now empty and show the empty message if needed
            const listaPensamentos = document.getElementById("lista-pensamentos");
            const mensagemVazia = document.getElementById("mensagem-vazia");
            if (listaPensamentos.children.length === 0) {
                mensagemVazia.style.display = "block";
            }
        }
        catch {
            alert("Erro ao excluir pensamento");
        }
    };
    const iconeExcluir = document.createElement("img");
    iconeExcluir.src = "./assets/imagens/icone-excluir.png";
    iconeExcluir.alt = "Excluir";
    botaoExcluir.appendChild(iconeExcluir);
    const botaoFavorito = document.createElement("button");
    botaoFavorito.classList.add("botao-favorito");
    botaoFavorito.type = "button";
    botaoFavorito.onclick = async (event) => {
        event.preventDefault();
        try {
            await api.atualizarFavorito(pensamento.id);
            // Toggle the icon without re-rendering the entire list
            const isFavorited = iconeFavorito.src.includes("icone-favorito.png");
            iconeFavorito.src = isFavorited
                ? "./assets/imagens/icone-favorito_outline.png"
                : "./assets/imagens/icone-favorito.png";
            // Update the pensamento object to keep state in sync
            pensamento.favorito = !pensamento.favorito;
        }
        catch {
            alert("Erro ao atualizar favorito");
        }
    };
    const iconeFavorito = document.createElement("img");
    iconeFavorito.src = pensamento.favorito
        ? "./assets/imagens/icone-favorito.png"
        : "./assets/imagens/icone-favorito_outline.png";
    iconeFavorito.alt = "Ícone de favorito";
    botaoFavorito.appendChild(iconeFavorito);
    const icones = document.createElement("div");
    icones.classList.add("icones");
    icones.appendChild(botaoFavorito);
    icones.appendChild(botaoEditar);
    icones.appendChild(botaoExcluir);
    li.appendChild(iconeAspas);
    li.appendChild(pensamentoConteudo);
    li.appendChild(pensamentoAutoria);
    li.appendChild(pensamentoData);
    li.appendChild(icones);
    listaPensamentos.appendChild(li);
}
//# sourceMappingURL=adicionarPensamentoNaLista.js.map