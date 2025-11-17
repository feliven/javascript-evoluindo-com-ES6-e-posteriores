import api from "./api.js";
import { adicionarPensamentoNaLista } from "./adicionarPensamentoNaLista.js";
export async function renderizarPensamentos(arrayPensamentos) {
    const listaPensamentos = document.getElementById("lista-pensamentos");
    const mensagemVazia = document.getElementById("mensagem-vazia");
    listaPensamentos.innerHTML = "";
    try {
        const pensamentos = (await api.buscarPensamentos());
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
        }
        else {
            mensagemVazia.style.display = "none";
            arrayPensamentos.forEach(adicionarPensamentoNaLista);
        }
    }
    catch {
        alert("Erro ao renderizar pensamentos");
    }
}
//# sourceMappingURL=renderizarPensamentos.js.map