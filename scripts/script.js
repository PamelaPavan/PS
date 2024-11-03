function confirmarExclusao(event, id) {
    event.preventDefault(); // Evita que o link redirecione imediatamente

    const confirmacao = confirm("Tem certeza de que deseja excluir esta tarefa?");
    if (confirmacao) {
        // Redireciona para a rota de exclusão se a confirmação for positiva
        window.location.href = `/remover/${id}`;
    }
}