import ui from "./ui.js";
import api from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos();

  const formularioPensamento = document.getElementById("pensamento-form");
  const botaoCancelar = document.getElementById("botao-cancelar");

  if (formularioPensamento) {
    formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
  }
  if (botaoCancelar) {
    botaoCancelar.addEventListener("click", manipularCancelamento);
  }
});

async function manipularSubmissaoFormulario(event: SubmitEvent) {
  event.preventDefault();
  const idSemValue = document.getElementById("pensamento-id") as HTMLInputElement;
  const id = idSemValue ? idSemValue.value : "";
  const conteudoSemValue = document.getElementById("pensamento-conteudo") as HTMLTextAreaElement;
  const conteudo = conteudoSemValue ? conteudoSemValue.value : "";
  const autoriaSemValue = document.getElementById("pensamento-autoria") as HTMLInputElement;
  const autoria = autoriaSemValue ? autoriaSemValue.value : "";

  try {
    if (id) {
      await api.editarPensamento({ id, conteudo, autoria });
    } else {
      await api.salvarPensamento({ conteudo, autoria });
    }
    ui.renderizarPensamentos();
  } catch {
    alert("Erro ao salvar pensamento");
  }
}

function manipularCancelamento() {
  ui.limparFormulario();
}
