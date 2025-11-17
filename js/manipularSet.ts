export const setPensamentos = new Set<string>();

export function removerPensamentoDoSet(conteudo: string, autoria: string) {
  const chave = `${conteudo.trim().toLowerCase()}-${autoria.trim().toLowerCase()}`;
  setPensamentos.delete(chave);
}
