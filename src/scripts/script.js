

let idParaExcluir = null;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const alertBox = document.getElementById('alert-situacao');
        if (alertBox) {
            alertBox.style.transition = 'opacity 0.5s ease';
            alertBox.style.opacity = '0';
            setTimeout(() => alertBox.remove(), 500); // Remove o elemento após a transição
        }
    }, 3000);
});


function confirmarExclusao(event, id) {
    event.preventDefault();
    idParaExcluir = id;
    
    const confirmacaoModal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
    confirmacaoModal.show();
}

document.addEventListener('DOMContentLoaded', () => {
    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.onclick = function () {
            if (idParaExcluir !== null) {
                // Redireciona para a rota de remoção
                window.location.href = `/remover/${idParaExcluir}`;
            }
            const confirmacaoModal = bootstrap.Modal.getInstance(document.getElementById('confirmacaoModal'));
            confirmacaoModal.hide();
        };
    }
});

function toggleConcluida(checkbox) {
    const card = checkbox.closest('.card');
    card.classList.toggle('concluida', checkbox.checked);
}
