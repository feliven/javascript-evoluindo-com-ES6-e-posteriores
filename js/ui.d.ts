import type { InterfacePensamento } from "./interface-pensamento.js";
declare const ui: {
    preencherFormulario(pensamentoId: string): Promise<void>;
    limparFormulario(): void;
    renderizarPensamentos(): Promise<void>;
    adicionarPensamentoNaLista(pensamento: InterfacePensamento): void;
};
export default ui;
//# sourceMappingURL=ui.d.ts.map