
    const listaTarefas = document.getElementById('listaTarefas');
    Sortable.create(listaTarefas, {
        animation: 150,
        onEnd: function(event) {
            // Obtenha a nova ordem dos IDs das tarefas
            const ordem = Array.from(listaTarefas.children).map(item => item.dataset.id);

            // Envie a nova ordem para o servidor via AJAX
            fetch('/reordenar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ordem_apresentacao: ordem })

            }).then(response => {
                if (response.ok) {
                    console.log('Ordem das tarefas atualizada com sucesso');
                } else {
                    console.error('Erro ao atualizar a ordem das tarefas');
                }
            });
        }
    });

