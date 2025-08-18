function mostrarAlerta(mensagem, tipo = 'success') {
  const alerta = document.getElementById('alertContainer');

  alerta.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show text-center" role="alert">
      ${mensagem}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>
  `;

  alerta.classList.remove('d-none');

  setTimeout(() => {
    const alertaAtivo = alerta.querySelector('.alert');
    if (alertaAtivo) {
      alertaAtivo.classList.remove('show');
      setTimeout(() => alerta.classList.add('d-none'), 300);
    }
  }, 4000);
}

function mostrarAlertaGlobal(mensagem, tipo = 'warning') {
  const alerta = document.getElementById('alertGlobal');
  alerta.innerHTML = mensagem;
  alerta.className = `alert alert-${tipo} text-center`;
  alerta.classList.remove('d-none');

  setTimeout(() => {
    alerta.classList.add('d-none');
    alerta.innerHTML = '';
  }, 5000);
}

document.getElementById('btnExcluirConta').addEventListener('click', () => {
  const senhaInput = document.getElementById('senhaExclusao');
  senhaInput.value = ''; 
  new bootstrap.Modal(document.getElementById('modalExcluirConta')).show();
});


document.addEventListener("DOMContentLoaded", () => {
  carregarFoto("fotoPerfil");
  carregarPerfil();
});

document.addEventListener("DOMContentLoaded", () => {
  carregarFoto("fotoPerfil");
});

document.addEventListener("DOMContentLoaded", () => {
    const fotoPerfil = document.getElementById("fotoPerfil");
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));

  const fotoPerfilHeader = document.querySelector('#profile-container img');
  const modal = document.getElementById('modalPerfil');

  fotoPerfilHeader.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.toggle('d-none');
  });

  document.addEventListener('click', (event) => {
    const isClickInsideModal = modal.contains(event.target);
    const isClickOnProfileImg = fotoPerfilHeader.contains(event.target);

    if (!isClickInsideModal && !isClickOnProfileImg && !modal.classList.contains('d-none')) {
      modal.classList.add('d-none');
    }
  });

  document.getElementById('linkAlterarEmail').addEventListener('click', (e) => {
    e.preventDefault();
    fecharMiniOverlay();
    mostrarOverlayEmail();
  });

  document.getElementById('linkAlterarSenha').addEventListener('click', (e) => {
    e.preventDefault();
    fecharMiniOverlay();
    mostrarOverlaySenha();
  });

  document.getElementById('btnSair').addEventListener('click', (e) => {
    e.preventDefault();
    const confirmar = confirm('Tem certeza que quer sair da conta?');
    if (confirmar) {
      localStorage.removeItem('usuarioDados');
      alert('Logout realizado! Redirecionando...');
      window.location.href = 'index.html';
    }
  });
});

function fecharMiniOverlay() {
  const modal = document.getElementById('modalPerfil');
  if (modal) modal.classList.add('d-none');
}

function mostrarOverlayEmail() {
  const overlay = document.createElement('div');
  overlay.id = 'overlay-email-senha';
  overlay.innerHTML = `
    <div class="overlay-box">
      <button class="close-btn" onclick="fecharOverlay()">&times;</button>
      <h2>Alterar E-mail</h2>
      <input type="email" id="novoEmail" placeholder="Novo e-mail" />
      <input type="email" id="confirmarEmail" placeholder="Confirmar novo e-mail" />
      <button class="btn" onclick="confirmarAlteracaoEmail()">Confirmar novo e-mail</button>
      <button class="btn btn-cancel" onclick="fecharOverlay()">Cancelar</button>
    </div>
  `;
  document.body.appendChild(overlay);


  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) fecharOverlay();
  });
}

function mostrarOverlaySenha() {
  const overlay = document.createElement('div');
  overlay.id = 'overlay-email-senha';
  overlay.innerHTML = `
    <div class="overlay-box">
      <button class="close-btn" onclick="fecharOverlay()">&times;</button>
      <h2>Alterar Senha</h2>
      <input type="password" id="novaSenha" placeholder="Nova senha" />
      <input type="password" id="confirmarSenha" placeholder="Confirmar nova senha" />
      <button class="btn" onclick="confirmarAlteracaoSenha()">Confirmar nova senha</button>
      <button class="btn btn-cancel" onclick="fecharOverlay()">Cancelar</button>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) fecharOverlay();
  });
}

function fecharOverlay() {
  const overlay = document.getElementById('overlay-email-senha');
  if (overlay) overlay.remove();
}

function confirmarAlteracaoEmail() {
  const novoEmail = document.getElementById('novoEmail').value.trim();
  const confirmarEmail = document.getElementById('confirmarEmail').value.trim();

  if (!novoEmail || !novoEmail.includes('@')) {
    alert('Digite um e-mail válido.');
    return;
  }

  if (novoEmail !== confirmarEmail) {
    alert('Os e-mails não coincidem.');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  usuario.email = novoEmail;
  localStorage.setItem('usuarioDados', JSON.stringify(usuario));

  alert('E-mail atualizado com sucesso. Verifique seu novo endereço.');
  fecharOverlay();
}

function confirmarAlteracaoSenha() {
  const novaSenha = document.getElementById('novaSenha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (novaSenha.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  if (novaSenha !== confirmarSenha) {
    alert('As senhas não coincidem.');
    return;
  }

  alert('Senha alterada com sucesso! Verifique seu e-mail para confirmação.');
  fecharOverlay();
}

document.addEventListener("DOMContentLoaded", () => {
  const btnEscolherAvatar = document.getElementById("btnEscolherAvatar");
  const modalAvatar = document.getElementById("modalAvatar");
  const closeAvatar = document.querySelector(".close-avatar");
  const avatarOptions = document.querySelectorAll(".avatar-option");
  const fotoPerfil = document.getElementById("fotoPerfil");

  const token = localStorage.getItem("token");

  btnEscolherAvatar.addEventListener("click", () => {
    modalAvatar.style.display = "flex";
  });

  closeAvatar.addEventListener("click", () => {
    modalAvatar.style.display = "none";
  });

  modalAvatar.addEventListener("click", (event) => {
    if (event.target === modalAvatar) {
      modalAvatar.style.display = "none";
    }
  });

  avatarOptions.forEach((img, index) => {
    img.addEventListener("click", async () => {
      const avatarIndex = index; // índice direto da imagem clicada (0 a 7)
  
      const usuario = JSON.parse(localStorage.getItem("usuarioDados")) || {};
      usuario.avatar = avatarIndex;
      localStorage.setItem("usuarioDados", JSON.stringify(usuario));
  
  
      modalAvatar.style.display = "none";
  
      try {
        const token = localStorage.getItem("token");
        const userId = usuario.id;
  console.log(userId)
        const resposta = await fetch(`http://localhost:3000/api/perfil/${userId}/avatar`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ avatar: avatarIndex })
        });
        carregarFoto()
        const resultado = await resposta.json();
  
        if (resposta.ok) {
          console.log("Avatar atualizado com sucesso no servidor!");
        } else {
          console.warn("Erro ao atualizar avatar no backend:", resultado.mensagem);
        }
      } catch (erro) {
        console.error("Erro na requisição de avatar:", erro);
      }
    });
  });
});


async function carregarFoto() {
  const foto = document.getElementById('fotoP');
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  const fotoPerfil = document.getElementById("fotoPerfil");

  let pers = Number(usuario.id);

  try {
    const res = await fetch(`http://localhost:3000/api/get/perfil/${pers}`); // Troque 123 pelo ID real
    if (res.ok) {
      const data = await res.json(); // Extrai o JSON da resposta
      const pers = Number(data.avatar); // Garante que seja um número

      switch (pers) {
        case 1:
          foto.src = 'img/foto0.jpeg';
          fotoPerfil.src = 'img/foto0.jpeg';
          break;
        case 2:
          foto.src = 'img/foto1.jpeg';
          fotoPerfil.src = 'img/foto1.jpeg';
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
        default:
          foto.src = 'https://i.postimg.cc/gJg6vRMH/image.png';
          fotoPerfil.src = 'https://i.postimg.cc/gJg6vRMH/image.png'
          break;
      }
    } else {
      document.getElementById('mensagem').innerText = 'Erro ao carregar perfil.';
    }
  } catch (error) {
    document.getElementById('mensagem').innerText = 'Erro na API: ' + error.message;
  }
}

function obterIndiceDaFoto(src) {
  const fotos = [
    'img/foto0.jpeg',
    'img/foto1.jpeg',
    'img/foto2.jpeg',
    'img/foto3.jpeg',
    'img/foto4.jpeg',
    'img/foto5.jpeg',
    'img/foto6.jpeg',
    'img/foto7.jpeg',
  ];

  const indice = fotos.indexOf(src);
  return indice !== -1 ? indice : null; 
}

document.addEventListener("DOMContentLoaded", () => {
  const perfilHeader = document.getElementById("profile-container");

  function ajustarPerfilHeader() {
    if (window.innerWidth < 768) {
      perfilHeader.style.display = "none";
    } else {
      perfilHeader.style.display = "block";
    }
  }

  ajustarPerfilHeader();
  window.addEventListener("resize", ajustarPerfilHeader);
});

async function excluirConta() {
  const senhaDigitada = document.getElementById('senhaExclusao').value;

  if (!senhaDigitada) {
    mostrarAlertaGlobal('Por favor, digite sua senha.', 'danger');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  const token = localStorage.getItem('token');

  if (!usuario || !token) {
    mostrarAlertaGlobal('Usuário não autenticado.', 'danger');
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/api/perfil/${usuario.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ senha: senhaDigitada })
    });

    const data = await resposta.json();

    if (resposta.ok) {
      mostrarAlertaGlobal('Conta excluída com sucesso!', 'success');
      localStorage.removeItem('usuarioDados');
      localStorage.removeItem('token');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      mostrarAlertaGlobal(data.mensagem || 'Erro ao excluir conta: senha incorreta.', 'danger');
    }
  } catch (error) {
    mostrarAlertaGlobal('Erro na comunicação com o servidor.', 'danger');
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnExcluirConta = document.getElementById('btnConfirmarExclusao');
  if (btnExcluirConta) {
    btnExcluirConta.addEventListener('click', excluirConta);
  }
});


function converterDataBRparaISO(dataBR) {
  const partes = dataBR.split('/');
  if (partes.length !== 3) return null;
  const [dia, mes, ano] = partes;
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null;

  if (dataNascimento.includes('/')) {
    dataNascimento = converterDataBRparaISO(dataNascimento);
  }

  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  if (isNaN(nascimento)) return null;

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

// Função para carregar os dados do perfil do usuário e preencher a tela
async function carregarPerfil() {
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  const token = localStorage.getItem('token');

  if (!usuario || !token) {
    alert('Usuário não autenticado');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/get/perfil/${usuario.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Erro ao buscar perfil');

    const dados = await res.json();

    console.log('Dados recebidos do backend:', dados);
    console.log('Data nascimento:', dados.nascimento);

    document.getElementById('nomePerfil').textContent = dados.nome || '--';
    document.getElementById('tipoContaPerfil').textContent = dados.tipoConta || '--';

    const idadeCalculada = calcularIdade(dados.nascimento);
    console.log('Idade calculada:', idadeCalculada);

    const idadeElem = document.getElementById('idadePerfil');
    if (idadeElem) {
      idadeElem.textContent = (idadeCalculada !== null && idadeCalculada !== undefined) ? idadeCalculada : '--';
    } else {
      console.warn('Elemento com id "idadePerfil" não encontrado no HTML!');
    }

    document.getElementById('modalidadePerfil').textContent = dados.modalidade || '--';
    document.getElementById('bioPerfil').textContent = dados.bio || '--';

  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  carregarPerfil();
});

document.addEventListener('DOMContentLoaded', () => {
  const btnEditarPerfil = document.getElementById('btn-editar-perfil');
  const modalEditarPerfil = document.getElementById('modal-editar-perfil');
  const btnCancelarEdicao = document.getElementById('cancelarEdicaoPerfil');
  const btnSalvarEdicao = document.getElementById('salvarEdicaoPerfil');

  btnEditarPerfil.addEventListener('click', async () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
    const token = localStorage.getItem('token');

    if (!usuario || !token) {
      alert('Usuário não autenticado');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/get/perfil/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao buscar dados do perfil');

      const dados = await res.json();

      document.getElementById('editModalidade').value = dados.modalidade || '';
      document.getElementById('editBio').value = dados.bio || '';

      modalEditarPerfil.classList.remove('d-none');
    } catch (error) {
      alert(error.message);
    }
  });

  btnCancelarEdicao.addEventListener('click', () => {
    modalEditarPerfil.classList.add('d-none');
  });

btnSalvarEdicao.addEventListener('click', async () => {
  const modalidade = document.getElementById('editModalidade').value;
  const bio = document.getElementById('editBio').value.trim();

  if (!modalidade) {
    mostrarAlerta('Por favor, selecione uma modalidade.', 'warning');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  const token = localStorage.getItem('token');

  if (!usuario || !token) {
    mostrarAlerta('Usuário não autenticado', 'danger');
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/api/perfil/${usuario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        modalidade,
        bio
      })
    });

    const data = await resposta.json();

    if (resposta.ok) {
      mostrarAlerta('Perfil atualizado com sucesso!', 'success');

      document.getElementById('modalidadePerfil').textContent = modalidade;
      document.getElementById('bioPerfil').textContent = bio;

      modalEditarPerfil.classList.add('d-none');
    } else {
      mostrarAlerta(data.mensagem || 'Erro ao atualizar perfil.', 'danger');
    }
  } catch (error) {
    mostrarAlerta('Erro na comunicação com o servidor.', 'danger');
    console.error('Erro:', error);
  }
});

});
