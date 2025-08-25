document.addEventListener("DOMContentLoaded", () => {
    const fotoPerfil = document.getElementById("fotoP");
    const modalPerfil = document.getElementById("modalPerfil");

    fotoPerfil.addEventListener("click", (e) => {
        e.preventDefault();
        modalPerfil.classList.toggle("d-none");
    });

    document.addEventListener("click", (e) => {
        const isClickInside = fotoPerfil.contains(e.target) || modalPerfil.contains(e.target);
        if (!isClickInside) {
            modalPerfil.classList.add("d-none");
        }
    });
});

document.getElementById('btnSair').addEventListener('click', (e) => {
    e.preventDefault();

    localStorage.removeItem('token');
    localStorage.removeItem('usuarioDados');
    localStorage.removeItem('usuarioLogado');

    window.location.href = 'index.html';
});