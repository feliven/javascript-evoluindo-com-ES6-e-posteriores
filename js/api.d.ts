import type { InterfacePensamento } from "./interface-pensamento.js";
declare const api: {
    buscarPensamentos(): Promise<any>;
    salvarPensamento(pensamento: InterfacePensamento): Promise<any>;
    buscarPensamentoPorId(id: string): Promise<any>;
    editarPensamento(pensamento: InterfacePensamento): Promise<any>;
    atualizarFavorito(pensamento: InterfacePensamento): Promise<void>;
    excluirPensamento(id: string): Promise<void>;
    pensamentoSearch(searchTerm: string): Promise<InterfacePensamento[]>;
};
export default api;
//# sourceMappingURL=api.d.ts.map