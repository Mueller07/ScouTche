function mostrarAlerta(mensagem, tipo = 'danger') {
  const alerta = document.getElementById('alertContainer');
  alerta.textContent = mensagem;
  alerta.className = `alert alert-${tipo} mt-3 text-center`;
  alerta.classList.remove('d-none');

  setTimeout(() => {
    alerta.classList.add('d-none');
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  const telasContainer = document.querySelector(".telas");

  // ---------- Carregar eventos ----------
  async function carregarEventos() {
    try {
      const res = await fetch(`http://localhost:3000/api/peneira`);
      if (!res.ok) throw new Error("Erro ao carregar eventos");
      const eventos = await res.json();
      telasContainer.innerHTML = "";
      eventos.forEach(evento => {
        const card = document.createElement("section");
        card.classList.add("tela");
        card.dataset.id = evento.id;
        card.innerHTML = `
          <h6>${evento.nome}</h6>
          <p>Tipo: ${evento.tipo}</p>
          <p>Modalidade: ${evento.modalidade}</p>
          <button class="btn-editar">Editar</button>
          <button class="btn-excluir">Excluir</button>
        `;
        telasContainer.appendChild(card);
      });
    } catch (error) {
      mostrarAlerta(error.message, 'danger');
    }
  }

  // ---------- Criar evento ----------
  async function criarEvento(form, tipo) {
    const token = localStorage.getItem("token");
  
    if (!token) {
      mostrarAlerta("Usuário não autenticado", "danger");
      return;
    }
  
    // Validação simples dos campos
    if (!form.nome.value || !form.desc.value || !form.cep.value || !form.modalidade.value) {
      mostrarAlerta("Todos os campos são obrigatórios", "danger");
      return;
    }
  
    const dados = {
      tipo,
      nome: form.nome.value,
      desc: form.desc.value,
      cep: form.cep.value,
      modalidade: form.modalidade.value,
    };
  
    try {
      const res = await fetch("http://localhost:3000/api/peneira", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
        credentials: "include",
      });
  
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao criar evento");
      }
  
      mostrarAlerta("Evento criado com sucesso!", "success");
      carregarEventos();
    } catch (error) {
      mostrarAlerta(error.message, "danger");
    }
  }

  // ---------- Atualizar evento ----------
  async function atualizarEvento(id, dados) {
    try {
      const res = await fetch(`http://localhost:3000/api/peneira/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao atualizar evento");
      }
      mostrarAlerta("Evento atualizado com sucesso!", "success");
      carregarEventos();
    } catch (error) {
      mostrarAlerta(error.message, "danger");
    }
  }

  // ---------- Deletar evento ----------
  async function deletarEvento(id) {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/peneira/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao excluir evento");
      }
      mostrarAlerta("Evento excluído com sucesso!", "success");
      carregarEventos();
    } catch (error) {
      mostrarAlerta(error.message, "danger");
    }
  }

  // ---------- Editar evento ----------
  async function editarEvento(id, dadosAtualizados) {
    const token = localStorage.getItem("token");

    try {
      const resposta = await fetch(`http://localhost:3000/api/peneira/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizados)
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.message || "Erro ao editar evento");
      }

      mostrarAlerta("Evento atualizado com sucesso!", "success");
      carregarEventos();
    } catch (err) {
      mostrarAlerta(err.message, "danger");
    }
  }

  // ---------- Listener único para todos os forms ----------
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();

      // Descobre o tipo do evento pelo ID do modal
      if (form.id === "formSeletiva") {
        criarEvento(form, "Seletiva");
      } else if (form.id === "formTorneio") {
        criarEvento(form, "Torneio");
      } else if (form.id === "formJogo") {
        criarEvento(form, "Jogo");
      } else if (form.id === "formEditar") {
        const idEvento = document.getElementById("editId").value;
        const dados = {
          nome: form.nome.value,
          desc: form.desc.value,
          cep: form.cep.value,
          modalidade: form.modalidade.value
        };
        editarEvento(idEvento, dados);
      }

      // Fecha modal se houver
      const modal = bootstrap.Modal.getInstance(form.closest(".modal"));
      if (modal) modal.hide();
      form.reset();
    });
  });

  // ---------- Clique nos cards ----------
  telasContainer.addEventListener("click", async e => {
    const btn = e.target;
    const card = btn.closest(".tela");
    if (!card) return;
    const id = card.dataset.id;

    if (btn.classList.contains("btn-editar")) {
      // Preenche modal de edição
      document.getElementById("editId").value = id;
      document.getElementById("editNome").value = card.querySelector("h6").textContent;
      document.getElementById("editDesc").value = ""; // poderia puxar real da API
      document.getElementById("editCep").value = "";
      document.getElementById("editModalidade").value =
        card.querySelector("p:nth-child(3)").textContent.replace("Modalidade: ", "");

      new bootstrap.Modal(document.getElementById("modalEditar")).show();
    }

    if (btn.classList.contains("btn-excluir")) {
      await deletarEvento(id);
    }
  });

  carregarEventos();
});

// ---------- Carregar foto perfil ----------
async function carregarFoto() {
  const foto = document.getElementById('fotoP');
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  let pers = Number(usuario.id);

  try {
    const res = await fetch(`http://localhost:3000/api/get/perfil/${pers}`);
    if (res.ok) {
      const data = await res.json();
      const avatar = Number(data.avatar);

      const fotoPerfil = document.getElementById('fotoPMobile') || {};

      switch (avatar) {
        case 1: foto.src = 'img/foto0.jpeg'; fotoPerfil.src = 'img/foto0.jpeg'; break;
        case 2: foto.src = 'img/foto1.jpeg'; fotoPerfil.src = 'img/foto1.jpeg'; break;
        case 3: foto.src = 'img/foto2.jpeg'; fotoPerfil.src = 'img/foto2.jpeg'; break;
        case 4: foto.src = 'img/foto3.jpeg'; fotoPerfil.src = 'img/foto3.jpeg'; break;
        case 5: foto.src = 'img/foto4.jpeg'; fotoPerfil.src = 'img/foto4.jpeg'; break;
        case 6: foto.src = 'img/foto5.jpeg'; fotoPerfil.src = 'img/foto5.jpeg'; break;
        case 7: foto.src = 'img/foto6.jpeg'; fotoPerfil.src = 'img/foto6.jpeg'; break;
        case 8: foto.src = 'img/foto7.jpeg'; fotoPerfil.src = 'img/foto7.jpeg'; break;
        default: foto.src = 'https://i.postimg.cc/gJg6vRMH/image.png'; break;
      }
    }
  } catch (error) {
    mostrarAlerta("Erro ao carregar perfil: " + error.message, "danger");
  }
}
