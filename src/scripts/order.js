const listaTarefas = document.getElementById('listaTarefas');
Sortable.create(listaTarefas, {
    animation: 150,
    onEnd: function(event) {
        // Obtenha a nova ordem dos IDs das tarefas
        const ordem = Array.from(listaTarefas.children).map(item => item.dataset.id);

        // Log para verificar a ordem antes de enviar
        console.log("Ordem a ser enviada:", ordem);

        // Envie a nova ordem para o servidor via AJAX
        fetch('/reordenar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ordem_apresentacao: ordem }) // Mudou para 'ordem'

        }).then(response => {
            if (response.ok) {
                console.log('Ordem das tarefas atualizada com sucesso');
            } else {
                console.error('Erro ao atualizar a ordem das tarefas');
                response.text().then(text => console.error(text)); // Log da resposta do servidor
            }
        });
    }
});
