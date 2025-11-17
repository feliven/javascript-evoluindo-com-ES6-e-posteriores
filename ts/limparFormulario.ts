export function limparFormulario(): void {
  const formulario = document.getElementById("pensamento-form") as HTMLFormElement;
  if (formulario) {
    formulario.reset();
  }
}
