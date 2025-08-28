// Carregar foto do perfil
async function carregarFoto() {
  const foto = document.getElementById('fotoP');
  const fotoPerfil = document.getElementById('fotoPerfil');
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  if (!usuario) return;

  let pers = Number(usuario.id);

  try {
    const res = await fetch(`http://localhost:3000/api/get/perfil/${pers}`);
    if (!res.ok) throw new Error("Erro ao carregar perfil");
    const data = await res.json();
    const avatar = Number(data.avatar);

    switch (avatar) {
      case 1: foto.src = fotoPerfil.src = 'img/foto0.jpeg'; break;
      case 2: foto.src = 'img/foto1.jpeg'; fotoPerfil.src = 'img/foto2.jpeg'; break;
      case 3: foto.src = fotoPerfil.src = 'img/foto2.jpeg'; break;
      case 4: foto.src = fotoPerfil.src = 'img/foto3.jpeg'; break;
      case 5: foto.src = fotoPerfil.src = 'img/foto4.jpeg'; break;
      case 6: foto.src = fotoPerfil.src = 'img/foto5.jpeg'; break;
      case 7: foto.src = fotoPerfil.src = 'img/foto6.jpeg'; break;
      case 8: foto.src = fotoPerfil.src = 'img/foto7.jpeg'; break;
      default: foto.src = 'https://i.postimg.cc/gJg6vRMH/image.png'; break;
    }

  } catch (error) {
    document.getElementById('mensagem').innerText = 'Erro na API: ' + error.message;
  }
}

// Função para mostrar alertas
function mostrarAlerta(mensagem, tipo = 'danger') {
  const alertContainer = document.getElementById('alertContainer');
  alertContainer.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensagem}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>
  `;
  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance(document.querySelector('.alert'));
    alert.close();
  }, 2000);
}

// Função para criar card de evento
function criarCardEvento(evento) {
  const col = document.createElement("div");

  // largura fixa do card
  col.style.flex = "0 0 300px";
  col.style.margin = "0.5rem";

  // Escolher imagem de acordo com a modalidade
  let imagem;
  switch ((evento.modalidade || "").toLowerCase()) {
    case "futebol": imagem = "https://i.postimg.cc/KjnJQfP1/image.png"; break;
    case "vôlei": imagem = "https://i.postimg.cc/VkPKSxcX/image.png"; break;
    case "basquete": imagem = "https://i.postimg.cc/rF0WNymh/image.png"; break;
    default: imagem = "https://i.postimg.cc/t43d06TM/image.png"; break;
  }

  col.innerHTML = `
    <div class="card h-100">
      <img src="${imagem}" class="card-img-top" alt="Imagem do evento" style="height: 225px; object-fit: cover;">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title fw-bold">${evento.nome}</h5>
        <p class="card-text">
          <strong>Tipo:</strong> ${evento.tipo}<br>
          <strong>Modalidade:</strong> ${evento.modalidade}
        </p>
        <div class="mt-auto">
          <button type="button" class="btn btn-primary btn-mais" data-id="${evento.id}">Mais Informações</button>
        </div>
      </div>
    </div>
  `;

  return col;
}

// Função para mostrar modal de evento
async function abrirModalEvento(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/peneira/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar evento");
    const evento = await res.json();

    document.getElementById("modalTitulo").innerText = evento.nome;
    document.getElementById("modalCorpo").innerHTML = `
      <p><strong>Tipo:</strong> ${evento.tipo}</p>
      <p><strong>Modalidade:</strong> ${evento.modalidade}</p>
      <p><strong>Local:</strong> ${evento.cep}</p>
      <p><strong>Descrição:</strong> ${evento.desc}</p>
    `;

    const botao = document.getElementById("modalBotaoAcao");

    // Remover todas as classes de cor do Bootstrap
    botao.classList.remove("btn-primary", "btn-success", "btn-danger");

    // Adicionar cor correta de acordo com a página
    if (window.location.pathname.includes("home.html")) {
      botao.innerText = "Participar";
      botao.classList.add("btn-success"); // verde
      botao.onclick = () => {
        alert(`Você participou do evento ${evento.nome}`);
        bootstrap.Modal.getInstance(document.getElementById("modalEvento")).hide();
      };
    } else if (window.location.pathname.includes("inscricoes.html")) {
      botao.innerText = "Sair do evento";
      botao.classList.add("btn-danger"); // vermelho
      botao.onclick = () => {
        alert(`Você saiu do evento ${evento.nome}`);
        bootstrap.Modal.getInstance(document.getElementById("modalEvento")).hide();
      };
    }

    // Forçar repaint do botão antes de abrir o modal
    botao.offsetHeight; // isso força o navegador a aplicar as classes imediatamente

    // Agora mostrar o modal
    new bootstrap.Modal(document.getElementById("modalEvento")).show();

  } catch (err) {
    console.error(err);
    mostrarAlerta("Erro ao carregar informações do evento.", "danger");
  }
}


// Carregar eventos e popular página
document.addEventListener("DOMContentLoaded", async () => {
  await carregarFoto();

  const container = document.getElementById("flex");

  try {
    const resposta = await fetch("http://localhost:3000/eventos");
    const eventos = await resposta.json();

    container.innerHTML = "";
    if (!eventos.length) {
      container.innerHTML = "<p>Nenhum evento encontrado.</p>";
      return;
    }

    eventos.forEach(evento => {
      const card = criarCardEvento(evento);
      container.appendChild(card);
    });

    // Adicionar listener aos botões "Mais Informações"
    container.querySelectorAll(".btn-mais").forEach(btn => {
      btn.addEventListener("click", () => abrirModalEvento(btn.dataset.id));
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Erro ao carregar eventos.</p>";
  }

});