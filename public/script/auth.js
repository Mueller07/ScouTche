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

// Evento do formulário de login
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
    localStorage.setItem('token', resultado.token);
    localStorage.setItem('usuarioLogado', 'true');
   
      closeModal();

      console.log('Login OK, redirecionando para home');
      // Redireciona para a home após fechar modal
      window.location.href = 'home.html';
    } else {
      alert(resultado.mensagem || 'Erro no login');
    }
  } catch (error) {
    alert('Erro ao conectar com o servidor');
    console.error(error);
  }
});

// Cadastro e tipo de conta
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const tipoContaEtapa = document.getElementById('tipo-conta-etapa');
  const finalizarBtn = document.getElementById('finalizar-cadastro');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    tipoContaEtapa.style.display = 'flex';
  });

  const radios = document.querySelectorAll("input[name='tipoConta']");
  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      finalizarBtn.style.display = 'block';
    });
  });

  finalizarBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const tipoSelecionado = document.querySelector("input[name='tipoConta']:checked")?.value;
    if (!tipoSelecionado) {
      alert('Por favor, selecione um tipo de conta.');
      return;
    }

    const inputs = form.querySelectorAll('input');
    const nome = (inputs[0].value.trim() + ' ' + inputs[1].value.trim()).trim();
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          confirmarSenha,
          tipoConta: tipoSelecionado,
        }),
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        alert('Cadastro confirmado com sucesso!');
        closeModal();
        form.reset();
        tipoContaEtapa.style.display = 'none';
        form.style.display = 'flex';
      } else {
        alert(resultado.mensagem || 'Erro no cadastro');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
      console.error(error);
    }
  });
});