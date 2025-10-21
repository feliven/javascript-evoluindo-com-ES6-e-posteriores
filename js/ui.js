import api from "./api.js";
const ui = {
    async preencherFormulario(pensamentoId) {
        const pensamento = (await api.buscarPensamentoPorId(pensamentoId));
        if (pensamento) {
            const pensamentoIDNaPagina = document.getElementById("pensamento-id");
            if (pensamentoIDNaPagina) {
                pensamentoIDNaPagina.value = pensamento.id;
            }
            const pensamentoConteudoNaPagina = document.getElementById("pensamento-conteudo");
            if (pensamentoConteudoNaPagina) {
                pensamentoConteudoNaPagina.value = pensamento.conteudo;
            }
            const pensamentoAutoriaNaPagina = document.getElementById("pensamento-autoria");
            if (pensamentoAutoriaNaPagina) {
                pensamentoAutoriaNaPagina.value = pensamento.autoria;
            }
        }
    },
    limparFormulario() {
        const formulario = document.getElementById("pensamento-form");
        if (formulario) {
            formulario.reset();
        }
    },
    async renderizarPensamentos() {
        const listaPensamentos = document.getElementById("lista-pensamentos");
        const mensagemVazia = document.getElementById("mensagem-vazia");
        listaPensamentos.innerHTML = "";
        try {
            const pensamentos = (await api.buscarPensamentos());
            if (!pensamentos) {
                return;
            }
            if (pensamentos.length === 0) {
                mensagemVazia.style.display = "block";
            }
            else {
                mensagemVazia.style.display = "none";
                pensamentos.forEach(ui.adicionarPensamentoNaLista);
            }
        }
        catch {
            alert("Erro ao renderizar pensamentos");
        }
    },
    adicionarPensamentoNaLista(pensamento) {
        if (!pensamento.id) {
            return;
        }
        const listaPensamentos = document.getElementById("lista-pensamentos");
        const li = document.createElement("li");
        li.setAttribute("data-id", pensamento.id);
        li.classList.add("li-pensamento");
        const iconeAspas = document.createElement("img");
        iconeAspas.src = "assets/imagens/aspas-azuis.png";
        iconeAspas.alt = "Aspas azuis";
        iconeAspas.classList.add("icone-aspas");
        const pensamentoConteudo = document.createElement("div");
        pensamentoConteudo.textContent = pensamento.conteudo;
        pensamentoConteudo.classList.add("pensamento-conteudo");
        const pensamentoAutoria = document.createElement("div");
        pensamentoAutoria.textContent = pensamento.autoria;
        pensamentoAutoria.classList.add("pensamento-autoria");
        const botaoEditar = document.createElement("button");
        botaoEditar.classList.add("botao-editar");
        botaoEditar.onclick = () => ui.preencherFormulario(pensamento.id);
        const iconeEditar = document.createElement("img");
        iconeEditar.src = "assets/imagens/icone-editar.png";
        iconeEditar.alt = "Editar";
        botaoEditar.appendChild(iconeEditar);
        const botaoExcluir = document.createElement("button");
        botaoExcluir.classList.add("botao-excluir");
        botaoExcluir.onclick = async () => {
            try {
                await api.excluirPensamento(pensamento.id);
                ui.renderizarPensamentos();
            }
            catch (error) {
                alert("Erro ao excluir pensamento");
            }
        };
        const iconeExcluir = document.createElement("img");
        iconeExcluir.src = "assets/imagens/icone-excluir.png";
        iconeExcluir.alt = "Excluir";
        botaoExcluir.appendChild(iconeExcluir);
        const icones = document.createElement("div");
        icones.classList.add("icones");
        icones.appendChild(botaoEditar);
        icones.appendChild(botaoExcluir);
        li.appendChild(iconeAspas);
        li.appendChild(pensamentoConteudo);
        li.appendChild(pensamentoAutoria);
        li.appendChild(icones);
        listaPensamentos.appendChild(li);
    },
};
export default ui;
//# sourceMappingURL=ui.js.map