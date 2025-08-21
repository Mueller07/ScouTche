// ==================== ALERTAS ====================
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

// ==================== MODAL EXCLUSÃO ====================
document.getElementById('btnExcluirConta')?.addEventListener('click', () => {
  document.getElementById('senhaExclusao').value = '';
  new bootstrap.Modal(document.getElementById('modalExcluirConta')).show();
});

// ==================== PERFIL E OVERLAYS ====================
function fecharMiniOverlay() {
  document.getElementById('modalPerfil')?.classList.add('d-none');
}

function fecharOverlay() {
  document.getElementById('overlay-email-senha')?.remove();
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
  overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharOverlay(); });
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
  overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharOverlay(); });
}

function confirmarAlteracaoEmail() {
  const novoEmail = document.getElementById('novoEmail').value.trim();
  const confirmarEmail = document.getElementById('confirmarEmail').value.trim();
  if (!novoEmail || !novoEmail.includes('@')) return alert('Digite um e-mail válido.');
  if (novoEmail !== confirmarEmail) return alert('Os e-mails não coincidem.');

  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  usuario.email = novoEmail;
  localStorage.setItem('usuarioDados', JSON.stringify(usuario));
  alert('E-mail atualizado com sucesso.');
  fecharOverlay();
}

function confirmarAlteracaoSenha() {
  const novaSenha = document.getElementById('novaSenha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  if (novaSenha.length < 6) return alert('A senha deve ter pelo menos 6 caracteres.');
  if (novaSenha !== confirmarSenha) return alert('As senhas não coincidem.');
  alert('Senha alterada com sucesso!');
  fecharOverlay();
}

// ==================== AVATAR ====================
function configurarAvatar() {
  const btnEscolherAvatar = document.getElementById("btnEscolherAvatar");
  const modalAvatar = document.getElementById("modalAvatar");
  const closeAvatar = document.querySelector(".close-avatar");
  const avatarOptions = document.querySelectorAll(".avatar-option");

  btnEscolherAvatar?.addEventListener("click", () => modalAvatar.style.display = "flex");
  closeAvatar?.addEventListener("click", () => modalAvatar.style.display = "none");
  modalAvatar?.addEventListener("click", (e) => { if (e.target === modalAvatar) modalAvatar.style.display = "none"; });

  avatarOptions.forEach((img, index) => {
    img.addEventListener("click", async () => {
      const usuario = JSON.parse(localStorage.getItem("usuarioDados")) || {};
      usuario.avatar = index;
      localStorage.setItem("usuarioDados", JSON.stringify(usuario));
      modalAvatar.style.display = "none";

      try {
        const token = localStorage.getItem("token");
        const resposta = await fetch(`http://localhost:3000/api/perfil/${usuario.id}/avatar`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ avatar: index })
        });
        await carregarFoto();
        const resultado = await resposta.json();
        if (!resposta.ok) console.warn("Erro ao atualizar avatar no backend:", resultado.mensagem);
      } catch (erro) { console.error("Erro na requisição de avatar:", erro); }
    });
  });
}

// ==================== CARREGAR FOTO ====================
async function carregarFoto() {
  const foto = document.getElementById('fotoP');
  const fotoPerfil = document.getElementById("fotoPerfil");
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  if (!usuario) return;

  try {
    const res = await fetch(`http://localhost:3000/api/get/perfil/${usuario.id}`);
    if (!res.ok) throw new Error("Erro ao carregar perfil");
    const data = await res.json();
    const av = Number(data.avatar);

    const imagens = [
      'img/foto0.jpeg','img/foto1.jpeg','img/foto2.jpeg','img/foto3.jpeg',
      'img/foto4.jpeg','img/foto5.jpeg','img/foto6.jpeg','img/foto7.jpeg'
    ];
    const src = imagens[av-1] || 'https://i.postimg.cc/gJg6vRMH/image.png';
    if (foto) foto.src = src;
    if (fotoPerfil) fotoPerfil.src = src;

  } catch (error) {
    document.getElementById('mensagem').innerText = 'Erro na API: ' + error.message;
  }
}

// ==================== FUNÇÕES AUXILIARES ====================
function converterDataBRparaISO(dataBR) {
  const [dia, mes, ano] = dataBR.split('/');
  return `${ano}-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}`;
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null;
  if (dataNascimento.includes('/')) dataNascimento = converterDataBRparaISO(dataNascimento);
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  if (isNaN(nascimento)) return null;
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

// ==================== PERFIL ====================
async function carregarPerfil() {
  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  const token = localStorage.getItem('token');
  if (!usuario || !token) return alert('Usuário não autenticado');

  try {
    const res = await fetch(`http://localhost:3000/api/get/perfil/${usuario.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erro ao buscar perfil');
    const dados = await res.json();

    document.getElementById('nomePerfil').textContent = dados.nome || '--';
    document.getElementById('tipoContaPerfil').textContent = dados.tipoConta || '--';
    const idade = calcularIdade(dados.nascimento);
    document.getElementById('idadePerfil').textContent = idade ?? '--';
    document.getElementById('modalidadePerfil').textContent = dados.modalidade || '--';
    document.getElementById('bioPerfil').textContent = dados.bio || '--';

  } catch (error) { alert(error.message); }
}

// ==================== EXCLUIR CONTA ====================
async function excluirConta() {
  const senha = document.getElementById('senhaExclusao').value;
  if (!senha) return mostrarAlertaGlobal('Por favor, digite sua senha.', 'danger');

  const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  const token = localStorage.getItem('token');
  if (!usuario || !token) return mostrarAlertaGlobal('Usuário não autenticado.', 'danger');

  try {
    const res = await fetch(`http://localhost:3000/api/perfil/${usuario.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ senha })
    });
    const data = await res.json();
    if (res.ok) {
      mostrarAlertaGlobal('Conta excluída com sucesso!', 'success');
      localStorage.removeItem('usuarioDados');
      localStorage.removeItem('token');
      setTimeout(() => window.location.href = 'index.html', 1000);
    } else {
      mostrarAlertaGlobal(data.mensagem || 'Erro ao excluir conta: senha incorreta.', 'danger');
    }
  } catch (error) {
    mostrarAlertaGlobal('Erro na comunicação com o servidor.', 'danger');
    console.error(error);
  }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener("DOMContentLoaded", () => {
  carregarFoto();
  carregarPerfil();
  configurarAvatar();

  const fotoPerfilHeader = document.querySelector('#profile-container img');
  const modal = document.getElementById('modalPerfil');

  fotoPerfilHeader?.addEventListener('click', (e) => { e.preventDefault(); modal.classList.toggle('d-none'); });
  document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && !fotoPerfilHeader.contains(e.target) && !modal.classList.contains('d-none')) {
      modal.classList.add('d-none');
    }
  });

  document.getElementById('linkAlterarEmail')?.addEventListener('click', (e) => { e.preventDefault(); fecharMiniOverlay(); mostrarOverlayEmail(); });
  document.getElementById('linkAlterarSenha')?.addEventListener('click', (e) => { e.preventDefault(); fecharMiniOverlay(); mostrarOverlaySenha(); });
  document.getElementById('btnSair')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Tem certeza que quer sair da conta?')) {
      localStorage.removeItem('usuarioDados');
      alert('Logout realizado! Redirecionando...');
      window.location.href = 'index.html';
    }
  });

  document.getElementById('btnConfirmarExclusao')?.addEventListener('click', excluirConta);

  // Ajuste do header para mobile
  const perfilHeader = document.getElementById("profile-container");
  function ajustarPerfilHeader() { perfilHeader.style.display = window.innerWidth < 768 ? "none" : "block"; }
  ajustarPerfilHeader();
  window.addEventListener("resize", ajustarPerfilHeader);

  // Botão editar perfil
  const btnEditarPerfil = document.getElementById('btn-editar-perfil');
  const modalEditarPerfil = document.getElementById('modal-editar-perfil');
  const btnCancelarEdicao = document.getElementById('cancelarEdicaoPerfil');
  const btnSalvarEdicao = document.getElementById('salvarEdicaoPerfil');

  btnEditarPerfil?.addEventListener('click', async () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
    const token = localStorage.getItem('token');
    if (!usuario || !token) return alert('Usuário não autenticado');

    try {
      const res = await fetch(`http://localhost:3000/api/get/perfil/${usuario.id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Erro ao buscar dados do perfil');
      const dados = await res.json();
      document.getElementById('editModalidade').value = dados.modalidade || '';
      document.getElementById('editBio').value = dados.bio || '';
      modalEditarPerfil.classList.remove('d-none');
    } catch (error) { alert(error.message); }
  });

  btnCancelarEdicao?.addEventListener('click', () => modalEditarPerfil.classList.add('d-none'));

  btnSalvarEdicao?.addEventListener('click', async () => {
    const modalidade = document.getElementById('editModalidade').value;
    const bio = document.getElementById('editBio').value.trim();
    if (!modalidade) return mostrarAlerta('Por favor, selecione uma modalidade.', 'warning');

    const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
    const token = localStorage.getItem('token');
    if (!usuario || !token) return mostrarAlerta('Usuário não autenticado', 'danger');

    try {
      const res = await fetch(`http://localhost:3000/api/perfil/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ modalidade, bio })
      });
      const data = await res.json();
      if (res.ok) {
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