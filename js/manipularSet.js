export const setPensamentos = new Set();
export function removerPensamentoDoSet(conteudo, autoria) {
    const chave = `${conteudo.trim().toLowerCase()}-${autoria.trim().toLowerCase()}`;
    setPensamentos.delete(chave);
}
//# sourceMappingURL=manipularSet.js.map