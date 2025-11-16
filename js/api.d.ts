import type { InterfacePensamento } from "./interface-pensamento.js";
declare const api: {
    buscarPensamentos(): Promise<InterfacePensamento[] | Error>;
    salvarPensamento(pensamento: InterfacePensamento): Promise<InterfacePensamento | Error>;
    buscarPensamentoPorId(id: string): Promise<InterfacePensamento | Error>;
    editarPensamento(pensamento: InterfacePensamento): Promise<InterfacePensamento | Error>;
    atualizarFavorito(id: string): Promise<void | Error>;
    excluirPensamento(id: string): Promise<void | Error>;
    pensamentoSearch(searchTerm: string): Promise<InterfacePensamento[] | Error>;
};
export default api;
//# sourceMappingURL=api.d.ts.map