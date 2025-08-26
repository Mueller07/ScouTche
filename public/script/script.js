// Navegação do header
const links = document.querySelectorAll('header .nav-link');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    links.forEach(l => l.classList.remove('ativo'));
    link.classList.add('ativo');
  });
});

// Dropdowns de filtros
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

// Controle do carousel
const carousel = document.querySelector('#myCarousel');

if (carousel) {
  carousel.addEventListener('slid.bs.carousel', function () {
    const activeSlide = carousel.querySelector('.carousel-item.active');
    const index = Array.from(carousel.querySelectorAll('.carousel-item')).indexOf(activeSlide);

    document.querySelector('#info-futsal').classList.add('d-none');
    document.querySelector('#info-volei').classList.add('d-none');
    document.querySelector('#info-basquete').classList.add('d-none');

    if (index === 0) document.querySelector('#info-futsal').classList.remove('d-none');
    else if (index === 1) document.querySelector('#info-volei').classList.remove('d-none');
    else if (index === 2) document.querySelector('#info-basquete').classList.remove('d-none');
  });
}

// Carregar avatar e abrir modal
document.addEventListener("DOMContentLoaded", () => {
  const btnEscolherAvatar = document.getElementById('btnEscolherAvatar');
  const modalAvatar = document.getElementById('modalAvatar');
  const closeAvatar = document.querySelector('.close-avatar');
  const avatarOptions = document.querySelectorAll('.avatar-option');
  const fotoPerfil = document.getElementById('fotoPerfil');

  if (btnEscolherAvatar) {
    btnEscolherAvatar.addEventListener('click', () => modalAvatar.classList.remove('d-none'));
  }

  if (closeAvatar) {
    closeAvatar.addEventListener('click', () => modalAvatar.classList.add('d-none'));
  }

  if (modalAvatar) {
    modalAvatar.addEventListener('click', (e) => {
      if (e.target === modalAvatar) modalAvatar.classList.add('d-none');
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

  const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioDados'));
  if (usuarioSalvo?.avatar) fotoPerfil.src = usuarioSalvo.avatar;

  carregarEventos();
});

// Função para carregar eventos
async function carregarEventos() {
  try {
    const res = await fetch(`http://localhost:3000/api/peneira`);
    if (!res.ok) throw new Error("Erro ao carregar eventos");
    const eventos = await res.json();

    const row = document.querySelector(".container .row");
    if (!row) return console.error("Elemento .container .row não encontrado");

    row.innerHTML = "";

    eventos.forEach(evento => {
      let imagem;
      switch ((evento.modalidade || "").toLowerCase()) {
        case "futebol": imagem = "https://i.postimg.cc/KjnJQfP1/image.png"; break;
        case "vôlei": imagem = "https://i.postimg.cc/VkPKSxcX/image.png"; break;
        case "basquete": imagem = "https://i.postimg.cc/rF0WNymh/image.png"; break;
        default: imagem = "https://i.postimg.cc/t43d06TM/image.png"; break;
      }

      const col = document.createElement("div");
      col.classList.add("col-md-3", "mb-3"); 
      col.innerHTML = `
  <div class="card h-100" style="font-size: 0.9rem;"> <!-- card menor com fonte menor -->
    <img class="card-img-top" src="${imagem}" alt="Imagem do evento" 
         style="height: 150px; width: 100%; object-fit: cover;"> <!-- altura menor -->
    <div class="card-body p-2"> <!-- menos padding -->
      <h5 class="card-title fw-bold" style="font-size: 1rem;">${evento.nome}</h5>
      <p class="card-text mb-2" style="font-size: 0.85rem;">
        <strong>Tipo:</strong> ${evento.tipo}<br>
        <strong>Modalidade:</strong> ${evento.modalidade}<br>
      </p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group">
          <button type="button" class="btn btn-primary btn-mais btn-sm" data-id="${evento.id}">
            Mais Informações
          </button>
        </div>
      </div>
    </div>
  </div>
`;


      row.appendChild(col);
    });

    document.querySelectorAll(".btn-mais").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        try {
          const res = await fetch(`http://localhost:3000/api/peneira/${id}`);
          const evento = await res.json();

          document.getElementById("modalTitulo").innerText = evento.nome;
          document.getElementById("modalCorpo").innerHTML = `
            <p><strong>Tipo:</strong> ${evento.tipo}</p>
            <p><strong>Modalidade:</strong> ${evento.modalidade}</p>
            <p><strong>Local:</strong> ${evento.cep}</p>
            <p><strong>Descrição:</strong> ${evento.desc || "Sem descrição"}</p>
          `;

          const botao = document.getElementById("modalBotaoAcao");

          // remover classes antigas do Bootstrap
          botao.classList.remove("btn-primary", "btn-success", "btn-danger");
          
          // definir estilo inline ou adicionar a nova classe
          if (window.location.pathname.includes("home.html")) {
            botao.innerText = "Participar";
            botao.classList.add("btn-success"); // ou botao.style.backgroundColor = "#28a745"
            botao.onclick = () => {
              alert(`Você participou do evento ${evento.nome}`);
              bootstrap.Modal.getInstance(document.getElementById("modalEvento")).hide();
            };
          } else if (window.location.pathname.includes("inscricoes.html")) {
            botao.innerText = "Sair do evento";
            botao.classList.add("btn-danger"); // ou botao.style.backgroundColor = "#dc3545"
            botao.onclick = () => {
              alert(`Você saiu do evento ${evento.nome}`);
              bootstrap.Modal.getInstance(document.getElementById("modalEvento")).hide();
            };
          }
          
                    new bootstrap.Modal(document.getElementById("modalEvento")).show();
          
        } catch (err) {
          console.error(err);
          alert("Erro ao carregar informações do evento.");
        }
      });
    });

  } catch (err) {
    console.error("Erro ao carregar eventos:", err);
  }
}

// Buscar logradouro pelo CEP
async function buscarLogradouro(cep) {
  try {
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

// Carregar foto do perfil
async function carregarFoto() {
  const foto = document.getElementById('fotoP');
  const fotoPerfil = document.getElementById('fotoPerfil');
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
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