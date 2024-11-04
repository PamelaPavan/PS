let idParaExcluir = null;

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
