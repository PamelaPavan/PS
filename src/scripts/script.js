let idParaExcluir = null;

function confirmarExclusao(event, id) {
    event.preventDefault();
    idParaExcluir = id;
    
    const confirmacaoModal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
    confirmacaoModal.show();
}

document.getElementById('btnConfirmarExclusao').onclick = function () {
    if (idParaExcluir !== null) {
        // Redireciona para a rota de remoção
        window.location.href = `/remover/${idParaExcluir}`;
    }
    const confirmacaoModal = bootstrap.Modal.getInstance(document.getElementById('confirmacaoModal'));
    confirmacaoModal.hide();
};
