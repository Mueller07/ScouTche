document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioDados"));

    const tiposPermitidos = ["profissional", "equipeSeletiva", "atleta"];

    if (!usuario || !tiposPermitidos.includes(usuario.tipo)) {
        const btnSeletiva = document.querySelector('[data-bs-target="#modalSeletiva"]');
        const btnTorneio = document.querySelector('[data-bs-target="#modalTorneio"]');

        btnSeletiva.removeAttribute("data-bs-toggle");
        btnSeletiva.removeAttribute("data-bs-target");

        btnTorneio.removeAttribute("data-bs-toggle");
        btnTorneio.removeAttribute("data-bs-target");

        btnSeletiva.classList.add("btn-secondary");
        btnTorneio.classList.add("btn-secondary");

        const toastEl = document.getElementById('alertPermissao');
        const bsToast = new bootstrap.Toast(toastEl);

        const showToast = () => {
            bsToast.show();
        };

        btnSeletiva.addEventListener("click", showToast);
        btnTorneio.addEventListener("click", showToast);
    }
});
