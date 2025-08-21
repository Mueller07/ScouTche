const links = document.querySelectorAll('header .nav-link');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    links.forEach(l => l.classList.remove('ativo'));
    link.classList.add('ativo');
  });
});

document.querySelectorAll('.filtro').forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdownName = button.dataset.dropdown;
    const dropdownDiv = document.getElementById('dropdown-' + dropdownName);
    const filtroDropdown = button.parentElement;

    document.querySelectorAll('.filtro-dropdown').forEach(fd => {
      if (fd !== filtroDropdown) {
        fd.classList.remove('open');
        fd.querySelector('.dropdown-content').classList.remove('show');
      }
    });

    const isOpen = filtroDropdown.classList.toggle('open');
    if (isOpen) {
      dropdownDiv.classList.add('show');
    } else {
      dropdownDiv.classList.remove('show');
    }
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.filtro-dropdown')) {
    document.querySelectorAll('.filtro-dropdown').forEach(fd => {
      fd.classList.remove('open');
      fd.querySelector('.dropdown-content').classList.remove('show');
    });
  }
});

const carousel = document.querySelector('#myCarousel');

if (carousel) {
  carousel.addEventListener('slid.bs.carousel', function () {
    const activeSlide = carousel.querySelector('.carousel-item.active');
    const index = Array.from(carousel.querySelectorAll('.carousel-item')).indexOf(activeSlide);

    document.querySelector('#info-futsal').classList.add('d-none');
    document.querySelector('#info-volei').classList.add('d-none');
    document.querySelector('#info-basquete').classList.add('d-none');

    if (index === 0) {
      document.querySelector('#info-futsal').classList.remove('d-none');
    } else if (index === 1) {
      document.querySelector('#info-volei').classList.remove('d-none');
    } else if (index === 2) {
      document.querySelector('#info-basquete').classList.remove('d-none');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const btnEscolherAvatar = document.getElementById('btnEscolherAvatar');
  const modalAvatar = document.getElementById('modalAvatar');
  const closeAvatar = document.querySelector('.close-avatar');
  const avatarOptions = document.querySelectorAll('.avatar-option');
  const fotoPerfil = document.getElementById('fotoPerfil');

  // Abrir modal avatar
  if (btnEscolherAvatar) {
    btnEscolherAvatar.addEventListener('click', () => {
      modalAvatar.classList.remove('d-none');
    });
  }

  // Fechar modal avatar ao clicar no botão X
  if (closeAvatar) {
    closeAvatar.addEventListener('click', () => {
      modalAvatar.classList.add('d-none');
    });
  }

  // Fechar modal avatar ao clicar fora da caixa de conteúdo
  if (modalAvatar) {
    modalAvatar.addEventListener('click', (e) => {
      if (e.target === modalAvatar) {
        modalAvatar.classList.add('d-none');
      }
    });
  }

  avatarOptions.forEach((img) => {
    img.addEventListener('click', () => {
      const usuario = JSON.parse(localStorage.getItem('usuarioDados')) || {};
      usuario.avatar = img.src;
      localStorage.setItem('usuarioDados', JSON.stringify(usuario));
      fotoPerfil.src = img.src;
      modalAvatar.classList.add('d-none');
    });
  });

  // Carregar avatar salvo ao abrir página
  const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioDados'));
  if (usuarioSalvo?.avatar) {
    fotoPerfil.src = usuarioSalvo.avatar;
  }

  // 🚀 Chamar carregarEventos ao abrir a página
  carregarEventos();
});

// Função para carregar eventos
async function carregarEventos() {
  try {
    const res = await fetch(`http://localhost:3000/api/peneira`);
    if (!res.ok) throw new Error("Erro ao carregar eventos");
    const eventos = await res.json();

    const row = document.querySelector(".container .row");
    if (!row) {
      console.error("Elemento .container .row não encontrado no HTML");
      return;
    }

    row.innerHTML = ""; // limpar cards anteriores

    eventos.forEach(evento => {
      // Definir imagem de acordo com a modalidade
      let imagem;
      switch (evento.modalidade?.toLowerCase()) {
        case "futebol":
          imagem = "https://i.postimg.cc/KjnJQfP1/image.png";
          break;
        case "vôlei":
          imagem = "https://i.postimg.cc/VkPKSxcX/image.png";
          break;
        case "basquete":
          imagem = "https://i.postimg.cc/rF0WNymh/image.png";
          break;
        default:
          imagem = "https://i.postimg.cc/t43d06TM/image.png"; // padrão
          break;
      }

      const col = document.createElement("div");
      col.classList.add("col-md-4");

      col.innerHTML = `
        <div class="card mb-4 box-shadow">
          <img class="card-img-top" 
               src="${imagem}" 
               alt="Imagem do evento" 
               style="height: 225px; width: 100%; display: block;">
          <div class="card-body">
            <h5 class="card-title fw-bold">${evento.nome}</h5>
            <p class="card-text">
              <strong>Tipo:</strong> ${evento.tipo}<br>
              <strong>Modalidade:</strong> ${evento.modalidade}<br>
              <strong>Descrição:</strong> ${evento.desc}<br>
              <strong>Cep:</strong> ${evento.cep}
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button type="button" class="btn btn-primary btn-mais" data-id="${evento.id}">Mais Informações</button>
                <button type="button" class="btn btn-primary btn-editar" data-id="${evento.id}">Entrar</button>
              </div>
            </div>
          </div>
        </div>
      `;

      row.appendChild(col);
    });

    // Adicionar eventos aos botões
    document.querySelectorAll(".btn-mais").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        console.log("Mais informações do evento:", id);
        alert("Mais informações do evento " + id);
      });
    });

    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        console.log("Entrar no evento:", id);
        alert("Entrar no evento " + id);
      });
    });

  } catch (err) {
    console.error("Erro ao carregar eventos:", err);
  }
}
async function buscarLogradouro(cep) {
  try {
    // Remove qualquer traço
    const cepLimpo = cep.replace(/\D/g, "");
    const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    if (!res.ok) throw new Error("Erro ao consultar CEP");
    const data = await res.json();
    return data.logradouro || "Logradouro não encontrado";
  } catch (err) {
    console.error("Erro ViaCEP:", err);
    return "Erro ao consultar CEP";
  }
}


// Função para carregar foto do perfil
async function carregarFoto() {
  const foto = document.getElementById('fotoP');
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));  

  let pers = Number(usuario.id);

  try {
    const res = await fetch(`http://localhost:3000/api/get/perfil/${pers}`);
    if (res.ok) {
      const data = await res.json();
      const pers = Number(data.avatar);

      switch (pers) {
        case 1:
          foto.src = 'img/foto0.jpeg';
          fotoPerfil.src = 'img/foto0.jpeg';
          break;
        case 2:
          foto.src = 'img/foto1.jpeg';
          fotoPerfil.src = 'img/foto2.jpeg';
          break;
        case 3:
          foto.src = 'img/foto2.jpeg';
          fotoPerfil.src = 'img/foto2.jpeg';
          break;
        case 4:
          foto.src = 'img/foto3.jpeg';
          fotoPerfil.src = 'img/foto3.jpeg';
          break;
        case 5:
          foto.src = 'img/foto4.jpeg';
          fotoPerfil.src = 'img/foto4.jpeg';
          break;
        case 6:
          foto.src = 'img/foto5.jpeg';
          fotoPerfil.src = 'img/foto5.jpeg';
          break;
        case 7:
          foto.src = 'img/foto6.jpeg';
          fotoPerfil.src = 'img/foto6.jpeg';
          break;
        case 8:
          foto.src = 'img/foto7.jpeg';
          fotoPerfil.src = 'img/foto7.jpeg';
          break;
        default:
          foto.src = 'https://i.postimg.cc/gJg6vRMH/image.png';
          break;
      }
    } else {
      document.getElementById('mensagem').innerText = 'Erro ao carregar perfil.';
    }
  } catch (error) {
    document.getElementById('mensagem').innerText = 'Erro na API: ' + error.message;
  }
}
