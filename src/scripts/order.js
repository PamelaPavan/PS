document.addEventListener('DOMContentLoaded', () => {
    const listaTarefas = document.getElementById('listaTarefas');

    // Função para atualizar a ordem no servidor
    function atualizarOrdemServidor() {
        const ordem = Array.from(listaTarefas.children).map(item => item.dataset.id);
        
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
                response.text().then(text => console.error(text));
            }
        });
    }

    // Função para atualizar o estado das setas
    function atualizarEstadoSetas() {
        const items = Array.from(listaTarefas.children);

        items.forEach((item, index) => {
            const btnCima = item.querySelector('.mover-cima');
            const btnBaixo = item.querySelector('.mover-baixo');

            // Habilita ou desabilita as setas
            btnCima.disabled = (index === 0);  // Desabilita a seta para cima do primeiro item
            btnBaixo.disabled = (index === items.length - 1);  // Desabilita a seta para baixo do último item

            // Garante que as cores das setas sejam consistentes
            btnCima.classList.remove('disabled');
            btnBaixo.classList.remove('disabled');
        });
    }

    // Configuração do sortable para drag-and-drop
    if (listaTarefas) {
        new Sortable(listaTarefas, {
            animation: 150,
            onEnd: () => {
                atualizarOrdemServidor();
                atualizarEstadoSetas();
            }
        });
    }

    // Funções para mover tarefas
    listaTarefas.addEventListener('click', (event) => {
        const btn = event.target.closest('.btn-mover');
        if (!btn) return;

        const tarefa = btn.closest('.tarefa-item');
        if (!tarefa) return;

        if (btn.classList.contains('mover-cima') && tarefa.previousElementSibling) {
            listaTarefas.insertBefore(tarefa, tarefa.previousElementSibling);
            atualizarOrdemServidor();
            atualizarEstadoSetas();
        } else if (btn.classList.contains('mover-baixo') && tarefa.nextElementSibling) {
            listaTarefas.insertBefore(tarefa.nextElementSibling, tarefa);
            atualizarOrdemServidor();
            atualizarEstadoSetas();
        }
    });

    // Inicializa o estado das setas ao carregar a página
    atualizarEstadoSetas();
});
