// auth.js

const modal = document.getElementById('modal-auth');
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup');
const closeBtn = document.getElementById('close-auth');

const authContainer = document.getElementById('auth-container');
const backToSignup = document.getElementById('back-to-signup');
const backToLogin = document.getElementById('back-to-login');

// Abrir/fechar modal
function openModal(isSignup = false) {
  modal.classList.add('active');
  authContainer.classList.toggle('right-panel-active', isSignup);
}

function closeModal() {
  modal.classList.remove('active');
  authContainer.classList.remove('right-panel-active');
}

btnLogin.addEventListener('click', () => openModal(false));
btnSignup.addEventListener('click', () => openModal(true));
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
backToSignup.addEventListener('click', () => authContainer.classList.add('right-panel-active'));
backToLogin.addEventListener('click', () => authContainer.classList.remove('right-panel-active'));

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const senha = e.target.senha.value.trim();

  if (!email || !senha) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  try {
    const resposta = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const resultado = await resposta.json();
    if (resposta.ok) {
      alert('Login realizado com sucesso!');
      localStorage.setItem('usuarioDados', JSON.stringify(resultado.usuario));
      localStorage.setItem('token', resultado.token.token);
      localStorage.setItem('usuarioLogado', 'true');
      closeModal();
      window.location.href = 'home.html';
    } else {
      alert(resultado.mensagem || 'Erro no login');
    }
  } catch (error) {
    alert('Erro ao conectar com o servidor');
    console.error(error);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const tipoContaEtapa = document.getElementById('tipo-conta-etapa');
  const senhaInput = document.getElementById('senha');
  const confirmarInput = document.getElementById('confirmar-senha');
  const erroDiv = document.getElementById('senha-erro');
  const finalizarBtn = document.getElementById('finalizar-cadastro'); 
  const radios = document.querySelectorAll("input[name='tipoConta']");
  const btnVoltar = document.getElementById('voltar-cadastro');

  // Validação em tempo real das senhas
  confirmarInput.addEventListener('input', () => {
    erroDiv.textContent = (confirmarInput.value !== senhaInput.value) 
      ? 'As senhas não coincidem' 
      : '';
  });

  // Botão "Próximo" / submit da primeira etapa
  form.addEventListener('submit', (e) => {
  e.preventDefault();

  const senha = senhaInput.value.trim();
  const confirmar = confirmarInput.value.trim();

  // Se campos vazios
  if (!senha || !confirmar) {
    alert('Por favor, preencha todos os campos de senha.');
    return;
  }

  // Se senhas não coincidirem
  if (senha !== confirmar) {
    erroDiv.textContent = 'As senhas não coincidem';
    alert('As senhas não coincidem');
    return; // interrompe o código, não avança
  }

  // Só chega aqui se senhas coincidirem
  erroDiv.textContent = '';
  form.style.display = 'none';
  tipoContaEtapa.style.display = 'block';
});

  // Botão "Voltar" da segunda etapa
  btnVoltar.addEventListener('click', () => {
    tipoContaEtapa.style.display = 'none';
    form.style.display = 'flex';
  });

  // Mostrar botão "Finalizar Cadastro" quando escolher tipo de conta
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      finalizarBtn.style.display = 'inline-block';
    });
  });

  // Finalizar cadastro
  finalizarBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const tipoSelecionado = document.querySelector("input[name='tipoConta']:checked")?.value;
    if (!tipoSelecionado) {
      alert('Por favor, selecione um tipo de conta.');
      return;
    }

    const inputs = form.querySelectorAll('input');
    const nome = inputs[0].value.trim();
    const nascimento = inputs[1].value.trim();
    const email = inputs[2].value.trim();
    const senha = inputs[3].value.trim();
    const confirmarSenha = inputs[4].value.trim();

    if (!nome || !email || !senha || !confirmarSenha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      const resposta = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          nascimento,
          email,
          senha,
          confirmarSenha,
          tipoConta: tipoSelecionado,
        }),
      });

      const resultado = await resposta.json();
      if (resposta.ok) {
        alert('Cadastro confirmado com sucesso!');
        form.reset();
        tipoContaEtapa.style.display = 'none';
        form.style.display = 'flex';
        finalizarBtn.style.display = 'none';
        closeModal();
      } else {
        alert(resultado.mensagem || 'Erro no cadastro');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
      console.error(error);
    }
  });
});